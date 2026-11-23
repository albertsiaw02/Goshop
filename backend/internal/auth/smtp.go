package auth

import (
	"context"
	"crypto/tls"
	"fmt"
	"net"
	"net/mail"
	"net/smtp"
	"net/url"
	"strings"
	"time"
)

func (c SMTPConfig) enabled() bool {
	return c.Host != "" && c.Port != "" && c.Username != "" &&
		c.Password != "" && c.From != "" && c.ResetURL != ""
}

func sendPasswordResetEmail(ctx context.Context, config SMTPConfig, recipient, token string) error {
	from, err := mail.ParseAddress(config.From)
	if err != nil {
		return fmt.Errorf("invalid SMTP sender address: %w", err)
	}
	to, err := mail.ParseAddress(recipient)
	if err != nil {
		return fmt.Errorf("invalid recipient address: %w", err)
	}
	resetURL, err := passwordResetLink(config.ResetURL, token)
	if err != nil {
		return err
	}

	address := net.JoinHostPort(config.Host, config.Port)
	dialer := net.Dialer{Timeout: 10 * time.Second}
	conn, err := dialer.DialContext(ctx, "tcp", address)
	if err != nil {
		return fmt.Errorf("connect to SMTP server: %w", err)
	}
	defer conn.Close()
	deadline := time.Now().Add(10 * time.Second)
	if contextDeadline, ok := ctx.Deadline(); ok && contextDeadline.Before(deadline) {
		deadline = contextDeadline
	}
	if err := conn.SetDeadline(deadline); err != nil {
		return fmt.Errorf("set SMTP deadline: %w", err)
	}

	client, err := smtp.NewClient(conn, config.Host)
	if err != nil {
		return fmt.Errorf("initialize SMTP client: %w", err)
	}
	defer client.Close()

	if ok, _ := client.Extension("STARTTLS"); !ok {
		return fmt.Errorf("SMTP server does not support STARTTLS")
	}
	if err := client.StartTLS(&tls.Config{
		ServerName: config.Host,
		MinVersion: tls.VersionTLS12,
	}); err != nil {
		return fmt.Errorf("start SMTP TLS: %w", err)
	}
	if err := client.Auth(smtp.PlainAuth("", config.Username, config.Password, config.Host)); err != nil {
		return fmt.Errorf("authenticate with SMTP server: %w", err)
	}
	if err := client.Mail(from.Address); err != nil {
		return fmt.Errorf("set SMTP sender: %w", err)
	}
	if err := client.Rcpt(to.Address); err != nil {
		return fmt.Errorf("set SMTP recipient: %w", err)
	}

	writer, err := client.Data()
	if err != nil {
		return fmt.Errorf("start SMTP message: %w", err)
	}
	message := strings.Join([]string{
		"From: " + from.String(),
		"To: " + to.String(),
		"Subject: Reset your GoShop password",
		"MIME-Version: 1.0",
		"Content-Type: text/plain; charset=UTF-8",
		"",
		"Use this link to reset your GoShop password. It expires in 30 minutes:",
		resetURL,
		"",
	}, "\r\n")
	if _, err := fmt.Fprint(writer, message); err != nil {
		_ = writer.Close()
		return fmt.Errorf("write SMTP message: %w", err)
	}
	if err := writer.Close(); err != nil {
		return fmt.Errorf("send SMTP message: %w", err)
	}
	if err := client.Quit(); err != nil {
		return fmt.Errorf("close SMTP session: %w", err)
	}
	return nil
}

func passwordResetLink(baseURL, token string) (string, error) {
	parsed, err := url.Parse(baseURL)
	if err != nil || (parsed.Scheme != "https" && parsed.Scheme != "http") || parsed.Host == "" {
		return "", fmt.Errorf("RESET_PASSWORD_URL must be an absolute URL")
	}
	query := parsed.Query()
	query.Set("token", token)
	parsed.RawQuery = query.Encode()
	return parsed.String(), nil
}
