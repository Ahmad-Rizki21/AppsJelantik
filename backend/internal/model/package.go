package model

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// StringSlice is a custom type for JSON string arrays
type StringSlice []string

// Scan implements sql.Scanner interface
func (s *StringSlice) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(bytes, s)
}

// Value implements driver.Valuer interface
func (s StringSlice) Value() (driver.Value, error) {
	if len(s) == 0 {
		return "[]", nil
	}
	return json.Marshal(s)
}

// MarshalJSON implements json.Marshaler interface
func (s StringSlice) MarshalJSON() ([]byte, error) {
	if len(s) == 0 {
		return []byte("[]"), nil
	}
	return json.Marshal([]string(s))
}

// Package represents internet package
type Package struct {
	ID           string         `gorm:"type:char(36);primaryKey" json:"id"`
	Name         string         `gorm:"type:varchar(100);not null" json:"name"`
	Speed        string         `gorm:"type:varchar(50);not null" json:"speed"`
	Price        float64        `gorm:"type:decimal(12,2);not null" json:"price"`
	Description  string         `gorm:"type:text" json:"description"`
	Features     StringSlice    `gorm:"type:json" json:"features"` // JSON array of strings
	ActivePeriod int            `gorm:"default:30" json:"active_period"` // in days
	IsPromo      bool           `gorm:"default:false" json:"is_promo"`
	IsActive     bool           `gorm:"default:true" json:"is_active"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

// BeforeCreate generates UUID if not set
func (p *Package) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	return nil
}
