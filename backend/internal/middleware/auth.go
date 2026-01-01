package middleware

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jelantik/jelantik-api/internal/config"
	"github.com/jelantik/jelantik-api/internal/pkg/supabase"
	"github.com/jelantik/jelantik-api/internal/service"
)

// AuthMiddleware validates Supabase JWT token and auto-syncs user
func AuthMiddleware(userService service.UserService) gin.HandlerFunc {
	// Use Supabase URL to fetch JWKS for ES256 token validation
	validator := supabase.NewValidator(config.AppConfig.Supabase.URL)

	return func(c *gin.Context) {
		// Get Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header required",
			})
			c.Abort()
			return
		}

		// Check Bearer prefix
		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid authorization format. Use: Bearer <token>",
			})
			c.Abort()
			return
		}

		// Validate token
		claims, err := validator.ValidateToken(authHeader)
		if err != nil {
			log.Printf("[Auth] Token validation failed: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid or expired token",
			})
			c.Abort()
			return
		}

		userID := claims.GetUserID()
		email := claims.GetEmail()
		fullName := claims.GetFullName()
		avatarURL := claims.GetAvatarURL()

		// Auto-sync user if not exists in local DB
		user, err := userService.GetByID(userID)
		if err != nil {
			// User not found, sync from Supabase
			log.Printf("[Auth] User %s not found in local DB, syncing...", userID)
			user, err = userService.SyncUser(userID, email, fullName, avatarURL)
			if err != nil {
				log.Printf("[Auth] Failed to sync user: %v", err)
				// Continue anyway, don't block request
			} else {
				log.Printf("[Auth] User %s synced successfully", userID)
			}
		}

		// Set user info in context
		c.Set("user_id", userID)
		c.Set("email", email)
		c.Set("full_name", fullName)
		c.Set("claims", claims)
		c.Set("user", user) // Full user object from DB

		c.Next()
	}
}

// GetUserID returns user ID from context
func GetUserID(c *gin.Context) string {
	userID, _ := c.Get("user_id")
	return userID.(string)
}

// GetUserEmail returns user email from context
func GetUserEmail(c *gin.Context) string {
	email, _ := c.Get("email")
	return email.(string)
}

// GetUser returns full user object from context
func GetUser(c *gin.Context) map[string]interface{} {
	user, _ := c.Get("user")
	return user.(map[string]interface{})
}
