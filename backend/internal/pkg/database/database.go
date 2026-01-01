package database

import (
	"fmt"
	"log"

	"github.com/jelantik/jelantik-api/internal/config"
	"github.com/jelantik/jelantik-api/internal/model"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// GetDSN returns database connection string based on DB_MODE
func GetDSN(dbMode string) string {
	switch dbMode {
	case "postgres":
		return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable TimeZone=Asia/Jakarta",
			config.AppConfig.Database.Host,
			config.AppConfig.Database.Port,
			config.AppConfig.Database.User,
			config.AppConfig.Database.Password,
			config.AppConfig.Database.DBName,
		)
	default: // mysql
		return config.AppConfig.Database.GetMySQLDSN()
	}
}

// Connect connects to database (PostgreSQL or MySQL)
func Connect() error {
	dbMode := config.AppConfig.Database.Mode
	dsn := GetDSN(dbMode)

	var err error
	switch dbMode {
	case "postgres":
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	default: // mysql
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	}

	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}

	// Connection pool settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	log.Printf("Database (%s) connected successfully", dbMode)
	return nil
}

// Migrate runs auto migration for all models
func Migrate() error {
	err := DB.AutoMigrate(
		&model.User{},
		&model.Package{},
		&model.Order{},
		&model.Subscription{},
	)

	if err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	log.Println("Database migrations completed")
	return nil
}

// Close closes database connection
func Close() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
