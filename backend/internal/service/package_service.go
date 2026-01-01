package service

import (
	"github.com/jelantik/jelantik-api/internal/model"
	"github.com/jelantik/jelantik-api/internal/repository"
)

type PackageService interface {
	GetAll(activeOnly bool) ([]model.Package, error)
	GetByID(id string) (*model.Package, error)
	Create(pkg *model.Package) error
	Update(pkg *model.Package) error
	Delete(id string) error
}

type packageService struct {
	repo repository.PackageRepository
}

func NewPackageService(repo repository.PackageRepository) PackageService {
	return &packageService{repo: repo}
}

func (s *packageService) GetAll(activeOnly bool) ([]model.Package, error) {
	return s.repo.GetAll(activeOnly)
}

func (s *packageService) GetByID(id string) (*model.Package, error) {
	return s.repo.GetByID(id)
}

func (s *packageService) Create(pkg *model.Package) error {
	return s.repo.Create(pkg)
}

func (s *packageService) Update(pkg *model.Package) error {
	return s.repo.Update(pkg)
}

func (s *packageService) Delete(id string) error {
	return s.repo.Delete(id)
}
