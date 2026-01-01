package repository

import (
	"github.com/jelantik/jelantik-api/internal/model"
	"gorm.io/gorm"
)

type PackageRepository interface {
	Create(pkg *model.Package) error
	GetByID(id string) (*model.Package, error)
	GetAll(activeOnly bool) ([]model.Package, error)
	Update(pkg *model.Package) error
	Delete(id string) error
}

type packageRepository struct {
	db *gorm.DB
}

func NewPackageRepository(db *gorm.DB) PackageRepository {
	return &packageRepository{db: db}
}

func (r *packageRepository) Create(pkg *model.Package) error {
	return r.db.Create(pkg).Error
}

func (r *packageRepository) GetByID(id string) (*model.Package, error) {
	var pkg model.Package
	err := r.db.Where("id = ?", id).First(&pkg).Error
	if err != nil {
		return nil, err
	}
	return &pkg, nil
}

func (r *packageRepository) GetAll(activeOnly bool) ([]model.Package, error) {
	var packages []model.Package
	query := r.db.Order("is_promo DESC, price ASC")
	if activeOnly {
		query = query.Where("is_active = ?", true)
	}
	err := query.Find(&packages).Error
	return packages, err
}

func (r *packageRepository) Update(pkg *model.Package) error {
	return r.db.Save(pkg).Error
}

func (r *packageRepository) Delete(id string) error {
	return r.db.Delete(&model.Package{}, "id = ?", id).Error
}
