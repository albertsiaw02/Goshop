package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid_credentials")
	ErrEmailTaken         = errors.New("email_taken")
	ErrRefreshToken       = errors.New("invalid_refresh_token")
	ErrUserNotFound       = errors.New("user_not_found")
	ErrInvalidPassword    = errors.New("invalid_password")
	ErrIncorrectPassword  = errors.New("incorrect_password")
	ErrPasswordResetToken = errors.New("invalid_password_reset_token")
	ErrResetEmailDisabled = errors.New("password_reset_email_not_configured")
	ErrResetEmailDelivery = errors.New("password_reset_email_delivery_failed")
)

type SMTPConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string
	ResetURL string
}

type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Session struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         User   `json:"user"`
}

type Service struct {
	db         *pgxpool.Pool
	jwtSecret  []byte
	smtpConfig SMTPConfig
}

func NewService(db *pgxpool.Pool, jwtSecret []byte, smtpConfig SMTPConfig) *Service {
	return &Service{db: db, jwtSecret: jwtSecret, smtpConfig: smtpConfig}
}

func normalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

func (s *Service) Register(ctx context.Context, name, email, password string) (Session, error) {
	name = strings.TrimSpace(name)
	email = normalizeEmail(email)
	if name == "" || email == "" || len(password) < 8 || len(password) > 72 {
		return Session{}, fmt.Errorf("invalid registration")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return Session{}, err
	}

	var user User
	err = s.db.QueryRow(ctx,
		`INSERT INTO users (name, email, password_hash)
		 VALUES ($1, $2, $3)
		 RETURNING id::text, name, email`,
		name, email, string(hash),
	).Scan(&user.ID, &user.Name, &user.Email)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return Session{}, ErrEmailTaken
		}
		return Session{}, err
	}
	return s.createSession(ctx, user)
}

func (s *Service) Login(ctx context.Context, email, password string) (Session, error) {
	var user User
	var passwordHash string
	err := s.db.QueryRow(ctx,
		`SELECT id::text, name, email, password_hash
		 FROM users WHERE email = $1`,
		normalizeEmail(email),
	).Scan(&user.ID, &user.Name, &user.Email, &passwordHash)
	if errors.Is(err, pgx.ErrNoRows) {
		return Session{}, ErrInvalidCredentials
	}
	if err != nil {
		return Session{}, err
	}
	if bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password)) != nil {
		return Session{}, ErrInvalidCredentials
	}
	return s.createSession(ctx, user)
}

func (s *Service) createSession(ctx context.Context, user User) (Session, error) {
	accessToken, err := s.issueAccessToken(user.ID)
	if err != nil {
		return Session{}, err
	}

	refreshToken, tokenHash, err := newRefreshToken()
	if err != nil {
		return Session{}, err
	}
	expiresAt := time.Now().UTC().Add(30 * 24 * time.Hour)
	if _, err = s.db.Exec(ctx,
		`INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
		 VALUES ($1::uuid, $2, $3)`,
		user.ID, tokenHash, expiresAt,
	); err != nil {
		return Session{}, err
	}

	return Session{AccessToken: accessToken, RefreshToken: refreshToken, User: user}, nil
}

func (s *Service) Refresh(ctx context.Context, refreshToken string) (Session, error) {
	tokenHash, err := refreshTokenHash(refreshToken)
	if err != nil {
		return Session{}, ErrRefreshToken
	}

	tx, err := s.db.Begin(ctx)
	if err != nil {
		return Session{}, err
	}
	defer tx.Rollback(ctx)

	var user User
	var tokenID string
	err = tx.QueryRow(ctx,
		`SELECT rt.id::text, u.id::text, u.name, u.email
		 FROM refresh_tokens rt
		 JOIN users u ON u.id = rt.user_id
		 WHERE rt.token_hash = $1
		   AND rt.revoked_at IS NULL
		   AND rt.expires_at > now()
		 FOR UPDATE OF rt`,
		tokenHash,
	).Scan(&tokenID, &user.ID, &user.Name, &user.Email)
	if errors.Is(err, pgx.ErrNoRows) {
		return Session{}, ErrRefreshToken
	}
	if err != nil {
		return Session{}, err
	}

	if _, err = tx.Exec(ctx,
		`UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1::uuid`,
		tokenID,
	); err != nil {
		return Session{}, err
	}

	accessToken, err := s.issueAccessToken(user.ID)
	if err != nil {
		return Session{}, err
	}
	newRefreshToken, newTokenHash, err := newRefreshToken()
	if err != nil {
		return Session{}, err
	}
	expiresAt := time.Now().UTC().Add(30 * 24 * time.Hour)
	if _, err = tx.Exec(ctx,
		`INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
		 VALUES ($1::uuid, $2, $3)`,
		user.ID, newTokenHash, expiresAt,
	); err != nil {
		return Session{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return Session{}, err
	}
	return Session{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		User:         user,
	}, nil
}

func (s *Service) Revoke(ctx context.Context, userID, refreshToken string) error {
	tokenHash, err := refreshTokenHash(refreshToken)
	if err != nil {
		return nil
	}
	_, err = s.db.Exec(ctx,
		`UPDATE refresh_tokens SET revoked_at = now()
		 WHERE token_hash = $1 AND user_id = $2::uuid AND revoked_at IS NULL`,
		tokenHash, userID,
	)
	return err
}

func (s *Service) Me(ctx context.Context, userID string) (User, error) {
	var user User
	err := s.db.QueryRow(ctx,
		`SELECT id::text, name, email FROM users WHERE id = $1::uuid`,
		userID,
	).Scan(&user.ID, &user.Name, &user.Email)
	if errors.Is(err, pgx.ErrNoRows) {
		return User{}, ErrUserNotFound
	}
	return user, err
}

func (s *Service) RequestPasswordReset(ctx context.Context, email string) error {
	if !s.smtpConfig.enabled() {
		return ErrResetEmailDisabled
	}

	email = normalizeEmail(email)
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var userID string
	err = tx.QueryRow(ctx,
		`SELECT id::text FROM users WHERE email = $1 FOR UPDATE`,
		email,
	).Scan(&userID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil
	}
	if err != nil {
		return err
	}

	var recentlyRequested bool
	if err = tx.QueryRow(ctx,
		`SELECT EXISTS (
		   SELECT 1 FROM password_reset_tokens
		   WHERE user_id = $1::uuid AND created_at > now() - interval '1 minute'
		 )`,
		userID,
	).Scan(&recentlyRequested); err != nil {
		return err
	}
	if recentlyRequested {
		return tx.Commit(ctx)
	}

	token, tokenHash, err := newRefreshToken()
	if err != nil {
		return err
	}

	if _, err = tx.Exec(ctx,
		`UPDATE password_reset_tokens
		 SET used_at = now()
		 WHERE user_id = $1::uuid AND used_at IS NULL`,
		userID,
	); err != nil {
		return err
	}
	if _, err = tx.Exec(ctx,
		`INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
		 VALUES ($1::uuid, $2, now() + interval '30 minutes')`,
		userID, tokenHash,
	); err != nil {
		return err
	}
	if err = tx.Commit(ctx); err != nil {
		return err
	}

	if err := sendPasswordResetEmail(ctx, s.smtpConfig, email, token); err != nil {
		return fmt.Errorf("%w: %v", ErrResetEmailDelivery, err)
	}
	return nil
}

func (s *Service) ResetPassword(ctx context.Context, token, password string) error {
	if len(password) < 8 || len(password) > 72 {
		return ErrInvalidPassword
	}
	tokenHash, err := refreshTokenHash(token)
	if err != nil {
		return ErrPasswordResetToken
	}
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var userID string
	err = tx.QueryRow(ctx,
		`SELECT user_id::text FROM password_reset_tokens
		 WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
		 FOR UPDATE`,
		tokenHash,
	).Scan(&userID)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrPasswordResetToken
	}
	if err != nil {
		return err
	}
	if _, err = tx.Exec(ctx,
		`UPDATE users SET password_hash = $1 WHERE id = $2::uuid`,
		string(passwordHash), userID,
	); err != nil {
		return err
	}
	if _, err = tx.Exec(ctx,
		`UPDATE password_reset_tokens SET used_at = now()
		 WHERE user_id = $1::uuid AND used_at IS NULL`,
		userID,
	); err != nil {
		return err
	}
	if _, err = tx.Exec(ctx,
		`UPDATE refresh_tokens SET revoked_at = now()
		 WHERE user_id = $1::uuid AND revoked_at IS NULL`,
		userID,
	); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func (s *Service) DeleteAccount(ctx context.Context, userID, password string) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var passwordHash string
	err = tx.QueryRow(ctx,
		`SELECT password_hash FROM users WHERE id = $1::uuid FOR UPDATE`,
		userID,
	).Scan(&passwordHash)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrUserNotFound
	}
	if err != nil {
		return err
	}
	if bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password)) != nil {
		return ErrIncorrectPassword
	}
	if _, err = tx.Exec(ctx, `DELETE FROM users WHERE id = $1::uuid`, userID); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func (s *Service) issueAccessToken(userID string) (string, error) {
	now := time.Now().UTC()
	claims := jwt.MapClaims{
		"sub": userID,
		"iat": now.Unix(),
		"exp": now.Add(15 * time.Minute).Unix(),
		"iss": "goshop-api",
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}

func (s *Service) VerifyAccessToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return s.jwtSecret, nil
	}, jwt.WithValidMethods([]string{"HS256"}), jwt.WithIssuer("goshop-api"))
	if err != nil || !token.Valid {
		return "", fmt.Errorf("invalid access token")
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("invalid access token")
	}
	subject, err := claims.GetSubject()
	if err != nil || subject == "" {
		return "", fmt.Errorf("invalid access token")
	}
	return subject, nil
}

func newRefreshToken() (plain string, hash string, err error) {
	bytes := make([]byte, 32)
	if _, err = rand.Read(bytes); err != nil {
		return "", "", err
	}
	plain = base64.RawURLEncoding.EncodeToString(bytes)
	hash, err = refreshTokenHash(plain)
	return plain, hash, err
}

func refreshTokenHash(token string) (string, error) {
	if token == "" {
		return "", fmt.Errorf("empty refresh token")
	}
	sum := sha256.Sum256([]byte(token))
	return base64.RawURLEncoding.EncodeToString(sum[:]), nil
}
