package auth

import (
	"testing"

	"golang.org/x/crypto/bcrypt"
)

func TestPasswordHash(t *testing.T) {
	hash, err := bcrypt.GenerateFromPassword([]byte("correct horse"), bcrypt.MinCost)
	if err != nil {
		t.Fatal(err)
	}
	if bcrypt.CompareHashAndPassword(hash, []byte("wrong")) == nil {
		t.Fatal("wrong password matched")
	}
}

func TestRefreshTokenHash(t *testing.T) {
	hash1, err := refreshTokenHash("token")
	if err != nil {
		t.Fatal(err)
	}
	hash2, _ := refreshTokenHash("token")
	if hash1 != hash2 {
		t.Fatal("same token produced different hashes")
	}
}
