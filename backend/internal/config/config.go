package config

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Supabase SupabaseConfig
	CORS     CORSConfig
}

type ServerConfig struct {
	Host string
	Port int
	Mode string // debug, release, test
}

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	Mode     string // postgres, mysql
}

type SupabaseConfig struct {
	URL       string
	AnonKey   string
	JWTSecret string
}

type CORSConfig struct {
	AllowedOrigins []string
}

var AppConfig *Config

// LoadConfig loads configuration from .env file
func LoadConfig() error {
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	viper.AddConfigPath("../")
	viper.AddConfigPath("../../")

	// Set defaults
	viper.SetDefault("SERVER_PORT", 8080)
	viper.SetDefault("SERVER_HOST", "0.0.0.0")
	viper.SetDefault("GIN_MODE", "debug")
	viper.SetDefault("DB_PORT", 5432)
	viper.SetDefault("DB_MODE", "postgres")

	// Read environment variables
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		// .env file is optional, use defaults and env vars
		log.Printf("Warning: .env file not found, using defaults and environment variables: %v", err)
	}

	AppConfig = &Config{
		Server: ServerConfig{
			Host: viper.GetString("SERVER_HOST"),
			Port: viper.GetInt("SERVER_PORT"),
			Mode: viper.GetString("GIN_MODE"),
		},
		Database: DatabaseConfig{
			Host:     viper.GetString("DB_HOST"),
			Port:     viper.GetInt("DB_PORT"),
			User:     viper.GetString("DB_USER"),
			Password: viper.GetString("DB_PASSWORD"),
			DBName:   viper.GetString("DB_NAME"),
			Mode:     viper.GetString("DB_MODE"),
		},
		Supabase: SupabaseConfig{
			URL:       viper.GetString("SUPABASE_URL"),
			AnonKey:   viper.GetString("SUPABASE_ANON_KEY"),
			JWTSecret: viper.GetString("SUPABASE_JWT_SECRET"),
		},
		CORS: CORSConfig{
			AllowedOrigins: viper.GetStringSlice("ALLOWED_ORIGINS"),
		},
	}

	return nil
}

// GetMySQLDSN returns MySQL DSN string
func (c *DatabaseConfig) GetMySQLDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		c.User,
		c.Password,
		c.Host,
		c.Port,
		c.DBName,
	)
}
