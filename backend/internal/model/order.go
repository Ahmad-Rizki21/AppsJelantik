package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// OrderStatus represents order status
type OrderStatus string

const (
	OrderStatusPending    OrderStatus = "pending"
	OrderStatusPaid       OrderStatus = "paid"
	OrderStatusProcessing OrderStatus = "processing"
	OrderStatusCompleted  OrderStatus = "completed"
	OrderStatusCancelled  OrderStatus = "cancelled"
)

// Order represents customer order
type Order struct {
	ID               string          `gorm:"type:char(36);primaryKey" json:"id"`
	UserID           string          `gorm:"type:char(36);not null;index" json:"user_id"`
	PackageID        string          `gorm:"type:char(36);not null" json:"package_id"`
	CustomerData     string          `gorm:"type:json" json:"customer_data"` // JSON: NIK, name, email, phone, address
	InstallationDate *time.Time      `json:"installation_date"`
	InstallationTime string          `gorm:"type:varchar(10)" json:"installation_time"`
	Subtotal         float64         `gorm:"type:decimal(12,2)" json:"subtotal"`
	Tax              float64         `gorm:"type:decimal(12,2);default:0" json:"tax"`
	AdminFee         float64         `gorm:"type:decimal(12,2);default:0" json:"admin_fee"`
	TotalAmount      float64         `gorm:"type:decimal(12,2);not null" json:"total_amount"`
	Status           OrderStatus     `gorm:"type:varchar(20);default:pending;index" json:"status"`
	PaymentMethod    string          `gorm:"type:varchar(50)" json:"payment_method"`
	CreatedAt        time.Time       `json:"created_at"`
	UpdatedAt        time.Time       `json:"updated_at"`
	DeletedAt        gorm.DeletedAt  `gorm:"index" json:"-"`

	// Relations
	User    User    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Package Package `gorm:"foreignKey:PackageID" json:"package,omitempty"`
}

// BeforeCreate generates UUID if not set
func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == "" {
		o.ID = uuid.New().String()
	}
	return nil
}
