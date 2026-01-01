package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jelantik/jelantik-api/internal/model"
	"github.com/jelantik/jelantik-api/internal/service"
)

type PackageHandler struct {
	service service.PackageService
}

func NewPackageHandler(service service.PackageService) *PackageHandler {
	return &PackageHandler{service: service}
}

// GetAll handles GET /packages
func (h *PackageHandler) GetAll(c *gin.Context) {
	activeOnly := c.DefaultQuery("active", "true") == "true"

	packages, err := h.service.GetAll(activeOnly)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch packages",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": packages,
	})
}

// GetByID handles GET /packages/:id
func (h *PackageHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	pkg, err := h.service.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Package not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": pkg,
	})
}

// Create handles POST /packages (admin only)
func (h *PackageHandler) Create(c *gin.Context) {
	var pkg model.Package
	if err := c.ShouldBindJSON(&pkg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if err := h.service.Create(&pkg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create package",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": pkg,
	})
}

// Update handles PUT /packages/:id (admin only)
func (h *PackageHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var pkg model.Package
	if err := c.ShouldBindJSON(&pkg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	pkg.ID = id
	if err := h.service.Update(&pkg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update package",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": pkg,
	})
}

// Delete handles DELETE /packages/:id (admin only)
func (h *PackageHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete package",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Package deleted successfully",
	})
}
