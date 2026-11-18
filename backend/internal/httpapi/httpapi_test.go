package httpapi

import "testing"

func TestOriginAllowed(t *testing.T) {
	if !originAllowed([]string{"http://localhost:8081"}, "http://localhost:8081") {
		t.Fatal("configured origin was rejected")
	}
	if originAllowed([]string{"http://localhost:8081"}, "https://example.com") {
		t.Fatal("unknown origin was allowed")
	}
}
