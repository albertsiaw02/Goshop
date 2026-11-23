package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/gocerie/goshop/backend/internal/auth"
)

type Config struct {
	DatabaseURL    string
	JWTSecret      []byte
	HTTPAddr       string
	AllowedOrigins []string
	SMTP           auth.SMTPConfig
}

func Load() (Config, error) {
	databaseURL := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if databaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}
	secret := strings.TrimSpace(os.Getenv("JWT_SECRET"))
	if len(secret) < 32 {
		return Config{}, fmt.Errorf("JWT_SECRET must be at least 32 characters")
	}

	addr := strings.TrimSpace(os.Getenv("HTTP_ADDR"))
	if addr == "" {
		addr = ":8080"
	}

	var origins []string
	for _, origin := range strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",") {
		if origin = strings.TrimSpace(origin); origin != "" {
			origins = append(origins, origin)
		}
	}

	return Config{
		DatabaseURL:    databaseURL,
		JWTSecret:      []byte(secret),
		HTTPAddr:       addr,
		AllowedOrigins: origins,
		SMTP: auth.SMTPConfig{
			Host:     strings.TrimSpace(os.Getenv("SMTP_HOST")),
			Port:     strings.TrimSpace(os.Getenv("SMTP_PORT")),
			Username: strings.TrimSpace(os.Getenv("SMTP_USERNAME")),
			Password: os.Getenv("SMTP_PASSWORD"),
			From:     strings.TrimSpace(os.Getenv("SMTP_FROM")),
			ResetURL: strings.TrimSpace(os.Getenv("RESET_PASSWORD_URL")),
		},
	}, nil
}
