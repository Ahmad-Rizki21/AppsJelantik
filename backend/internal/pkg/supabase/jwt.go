package supabase

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// JWTClaims represents Supabase JWT claims
type JWTClaims struct {
	jwt.RegisteredClaims
	Email         string                 `json:"email"`
	Phone         string                 `json:"phone"`
	AppMetadata   map[string]interface{} `json:"app_metadata"`
	UserMetadata  map[string]interface{} `json:"user_metadata"`
	Role          string                 `json:"role"`
	AAL           string                 `json:"aal"`
	AMREntries    []map[string]interface{} `json:"amr"`
	SessionID     string                 `json:"session_id"`
}

// JWKS represents a JSON Web Key Set
type JWKS struct {
	Keys []JSONWebKey `json:"keys"`
}

// JSONWebKey represents a JSON Web Key
type JSONWebKey struct {
	Kty string `json:"kty"`
	Kid string `json:"kid"`
	Use string `json:"use"`
	N   string `json:"n"`
	E   string `json:"e"`
	X   string `json:"x"`
	Y   string `json:"y"`
	Crv string `json:"crv"`
}

// Validator validates Supabase JWT tokens
type Validator struct {
	supabaseURL     string
	publicKeys      map[string]any
	lastRefresh     time.Time
	refreshInterval time.Duration
	mu              sync.RWMutex
	httpClient      *http.Client
}

// NewValidator creates a new JWT validator
func NewValidator(supabaseURL string) *Validator {
	return &Validator{
		supabaseURL:     supabaseURL,
		publicKeys:      make(map[string]any),
		refreshInterval: 1 * time.Hour,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// refreshJWKS fetches the latest JWKS from Supabase
func (v *Validator) refreshJWKS() error {
	// Supabase uses /auth/v1/ path for JWKS
	jwksURL := fmt.Sprintf("%s/auth/v1/.well-known/jwks.json", v.supabaseURL)

	resp, err := v.httpClient.Get(jwksURL)
	if err != nil {
		return fmt.Errorf("failed to fetch JWKS: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("JWKS endpoint returned status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read JWKS response: %w", err)
	}

	var jwks JWKS
	if err := json.Unmarshal(body, &jwks); err != nil {
		return fmt.Errorf("failed to parse JWKS: %w", err)
	}

	v.mu.Lock()
	defer v.mu.Unlock()

	// Parse keys
	for _, key := range jwks.Keys {
		if key.Kty == "EC" && (key.Crv == "P-256" || key.Crv == "P-384" || key.Crv == "P-521") {
			// Parse EC key (ES256, ES384, ES512)
			publicKey, err := v.parseECPublicKey(key)
			if err != nil {
				continue
			}
			v.publicKeys[key.Kid] = publicKey
		}
	}

	v.lastRefresh = time.Now()
	return nil
}

// Parse EC public key from JWK format
func (v *Validator) parseECPublicKey(key JSONWebKey) (*ecdsa.PublicKey, error) {
	// Decode base64url coordinates
	xBytes, err := base64.RawURLEncoding.DecodeString(key.X)
	if err != nil {
		return nil, fmt.Errorf("failed to decode X: %w", err)
	}

	yBytes, err := base64.RawURLEncoding.DecodeString(key.Y)
	if err != nil {
		return nil, fmt.Errorf("failed to decode Y: %w", err)
	}

	// Create curve based on crv
	var curve elliptic.Curve
	switch key.Crv {
	case "P-256":
		curve = elliptic.P256()
	case "P-384":
		curve = elliptic.P384()
	case "P-521":
		curve = elliptic.P521()
	default:
		return nil, fmt.Errorf("unsupported curve: %s", key.Crv)
	}

	// Create public key
	publicKey := &ecdsa.PublicKey{
		Curve: curve,
		X:     new(big.Int).SetBytes(xBytes),
		Y:     new(big.Int).SetBytes(yBytes),
	}

	return publicKey, nil
}

// getKey returns the public key for a given kid
func (v *Validator) getKey(kid string) (any, error) {
	v.mu.RLock()
	if key, exists := v.publicKeys[kid]; exists {
		v.mu.RUnlock()
		return key, nil
	}
	v.mu.RUnlock()

	// Refresh if needed
	if time.Since(v.lastRefresh) > v.refreshInterval {
		if err := v.refreshJWKS(); err != nil {
			return nil, err
		}
	}

	v.mu.RLock()
	defer v.mu.RUnlock()
	if key, exists := v.publicKeys[kid]; exists {
		return key, nil
	}

	return nil, fmt.Errorf("key not found: %s", kid)
}

// ValidateToken validates a Supabase JWT token and returns the claims
func (v *Validator) ValidateToken(tokenString string) (*JWTClaims, error) {
	// Remove "Bearer " prefix if present
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	if tokenString == "" {
		return nil, errors.New("token is empty")
	}

	// Initial parse to get kid (without verification)
	unverifiedToken, _, err := jwt.NewParser().ParseUnverified(tokenString, &JWTClaims{})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token header: %w", err)
	}

	// Get kid from header
	kid, ok := unverifiedToken.Header["kid"].(string)
	if !ok {
		return nil, errors.New("token missing kid header")
	}

	// Refresh JWKS if first time or expired
	if time.Since(v.lastRefresh) > v.refreshInterval || len(v.publicKeys) == 0 {
		if err := v.refreshJWKS(); err != nil {
			return nil, fmt.Errorf("failed to refresh JWKS: %w", err)
		}
	}

	// Get the public key
	publicKey, err := v.getKey(kid)
	if err != nil {
		return nil, fmt.Errorf("failed to get public key: %w", err)
	}

	// Parse and verify token
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Verify algorithm
		if _, ok := token.Method.(*jwt.SigningMethodECDSA); !ok {
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
		}
		return publicKey, nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to verify token: %w", err)
	}

	// Extract claims
	claims, ok := token.Claims.(*JWTClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	// Check expiration
	if claims.ExpiresAt != nil && claims.ExpiresAt.Before(time.Now()) {
		return nil, errors.New("token expired")
	}

	return claims, nil
}

// GetUserID extracts user ID from JWT claims
func (c *JWTClaims) GetUserID() string {
	return c.Subject
}

// GetEmail extracts email from JWT claims
func (c *JWTClaims) GetEmail() string {
	return c.Email
}

// GetFullName extracts full name from user metadata
func (c *JWTClaims) GetFullName() string {
	if name, ok := c.UserMetadata["full_name"].(string); ok {
		return name
	}
	if name, ok := c.UserMetadata["name"].(string); ok {
		return name
	}
	return ""
}

// GetAvatarURL extracts avatar URL from user metadata
func (c *JWTClaims) GetAvatarURL() string {
	if avatar, ok := c.UserMetadata["avatar_url"].(string); ok {
		return avatar
	}
	return ""
}

// GetPhoneNumber extracts phone number from user metadata
func (c *JWTClaims) GetPhoneNumber() string {
	if phone, ok := c.UserMetadata["phone"].(string); ok {
		return phone
	}
	if phone, ok := c.UserMetadata["phone_number"].(string); ok {
		return phone
	}
	return c.Phone
}
