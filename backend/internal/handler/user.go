package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jelantik/jelantik-api/internal/middleware"
	"github.com/jelantik/jelantik-api/internal/service"
)

type UserHandler struct {
	service service.UserService
}

func NewUserHandler(service service.UserService) *UserHandler {
	return &UserHandler{service: service}
}

// GetMe handles GET /users/me - Get current user profile
func (h *UserHandler) GetMe(c *gin.Context) {
	userID := middleware.GetUserID(c)

	user, err := h.service.GetByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": user,
	})
}

// Sync handles POST /users/sync - Sync user from Supabase
func (h *UserHandler) Sync(c *gin.Context) {
	userID := middleware.GetUserID(c)
	email := middleware.GetUserEmail(c)
	fullName, _ := c.Get("full_name")
	avatarURL := ""

	if claims, exists := c.Get("claims"); exists {
		// TODO: extract avatar from claims if needed
		_ = claims
	}

	user, err := h.service.SyncUser(userID, email, fullName.(string), avatarURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to sync user",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": user,
		"message": "User synced successfully",
	})
}

// UpdateProfile handles PUT /users/me - Update user profile
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var req struct {
		FullName string `json:"full_name"`
		Phone    string `json:"phone"`
		NIK      string `json:"nik"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	user, err := h.service.GetByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	user.FullName = req.FullName
	user.Phone = req.Phone
	user.NIK = req.NIK

	if err := h.service.Update(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update profile",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    user,
		"message": "Profile updated successfully",
	})
}

// HealthCheck handles GET /health
func (h *UserHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"service": "jelantik-api",
	})
}
