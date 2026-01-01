package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents app user (synced from Supabase auth)
type User struct {
	ID        string         `gorm:"type:char(36);primaryKey" json:"id"`
	Email     string         `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	FullName  string         `gorm:"type:varchar(100)" json:"full_name"`
	Phone     string         `gorm:"type:varchar(20)" json:"phone"`
	NIK       string         `gorm:"type:varchar(20)" json:"nik"`
	AvatarURL string         `gorm:"type:text" json:"avatar_url"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// BeforeCreate generates UUID if not set
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}
