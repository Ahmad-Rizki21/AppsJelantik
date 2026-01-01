package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SubscriptionStatus represents subscription status
type SubscriptionStatus string

const (
	SubscriptionStatusPending   SubscriptionStatus = "pending"
	SubscriptionStatusActive    SubscriptionStatus = "active"
	SubscriptionStatusSuspended SubscriptionStatus = "suspended"
	SubscriptionStatusCancelled SubscriptionStatus = "cancelled"
)

// Subscription represents active subscription
type Subscription struct {
	ID                 string             `gorm:"type:char(36);primaryKey" json:"id"`
	UserID             string             `gorm:"type:char(36);not null;index" json:"user_id"`
	PackageID          string             `gorm:"type:char(36);not null" json:"package_id"`
	Status             SubscriptionStatus `gorm:"type:varchar(20);default:pending" json:"status"`
	InstallationAddress string            `gorm:"type:text" json:"installation_address"`
	BillingDate        int                `gorm:"default:1" json:"billing_date"` // 1-31
	InstalledAt        *time.Time         `json:"installed_at"`
	CreatedAt          time.Time          `json:"created_at"`
	UpdatedAt          time.Time          `json:"updated_at"`
	DeletedAt          gorm.DeletedAt      `gorm:"index" json:"-"`

	// Relations
	User    User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Package Package `gorm:"foreignKey:PackageID" json:"package,omitempty"`
}

// BeforeCreate generates UUID if not set
func (s *Subscription) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	return nil
}
