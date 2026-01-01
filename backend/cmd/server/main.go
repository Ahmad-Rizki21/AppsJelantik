package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jelantik/jelantik-api/internal/config"
	"github.com/jelantik/jelantik-api/internal/handler"
	"github.com/jelantik/jelantik-api/internal/middleware"
	"github.com/jelantik/jelantik-api/internal/pkg/database"
	"github.com/jelantik/jelantik-api/internal/repository"
	"github.com/jelantik/jelantik-api/internal/service"
)

func main() {
	// Load configuration
	if err := config.LoadConfig(); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Connect to database
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Set Gin mode
	gin.SetMode(config.AppConfig.Server.Mode)

	// Create Gin router
	router := gin.Default()

	// Apply CORS middleware
	router.Use(middleware.CORSMiddleware(config.AppConfig.CORS.AllowedOrigins))

	// Initialize repositories
	userRepo := repository.NewUserRepository(database.DB)
	packageRepo := repository.NewPackageRepository(database.DB)

	// Initialize services
	userService := service.NewUserService(userRepo)
	packageService := service.NewPackageService(packageRepo)

	// Initialize handlers
	userHandler := handler.NewUserHandler(userService)
	packageHandler := handler.NewPackageHandler(packageService)

	// Public routes
	router.GET("/health", userHandler.HealthCheck)

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Package routes (public - no auth required for now)
		packages := v1.Group("/packages")
		{
			packages.GET("", packageHandler.GetAll)
			packages.GET("/:id", packageHandler.GetByID)
		}

		// User routes (authenticated)
		users := v1.Group("/users")
		users.Use(middleware.AuthMiddleware(userService))
		{
			users.GET("/me", userHandler.GetMe)
			users.POST("/sync", userHandler.Sync)
			users.PUT("/me", userHandler.UpdateProfile)
		}
	}

	// Admin routes (authenticated + admin check)
	// TODO: Add admin middleware
	admin := v1.Group("/admin")
	admin.Use(middleware.AuthMiddleware(userService))
	{
		admin.POST("/packages", packageHandler.Create)
		admin.PUT("/packages/:id", packageHandler.Update)
		admin.DELETE("/packages/:id", packageHandler.Delete)
	}

	// Start server
	addr := fmt.Sprintf("%s:%d", config.AppConfig.Server.Host, config.AppConfig.Server.Port)
	log.Printf("Server starting on %s", addr)
	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
