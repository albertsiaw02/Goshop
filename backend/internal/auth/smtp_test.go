package auth

import (
	"net/url"
	"testing"
)

func TestPasswordResetLink(t *testing.T) {
	link, err := passwordResetLink("https://example.com/reset?source=email", "opaque-token")
	if err != nil {
		t.Fatal(err)
	}

	parsed, err := url.Parse(link)
	if err != nil {
		t.Fatal(err)
	}
	if parsed.Query().Get("source") != "email" || parsed.Query().Get("token") != "opaque-token" {
		t.Fatalf("unexpected reset link query: %s", parsed.RawQuery)
	}
}

func TestPasswordResetLinkRejectsNonHTTPURL(t *testing.T) {
	if _, err := passwordResetLink("javascript:alert(1)", "token"); err == nil {
		t.Fatal("expected invalid reset URL to be rejected")
	}
}
