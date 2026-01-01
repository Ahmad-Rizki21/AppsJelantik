package service

import (
	"github.com/jelantik/jelantik-api/internal/model"
	"github.com/jelantik/jelantik-api/internal/repository"
)

type UserService interface {
	GetByID(id string) (*model.User, error)
	GetByEmail(email string) (*model.User, error)
	SyncUser(id, email, fullName, avatarURL string) (*model.User, error)
	Update(user *model.User) error
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) GetByID(id string) (*model.User, error) {
	return s.repo.GetByID(id)
}

func (s *userService) GetByEmail(email string) (*model.User, error) {
	return s.repo.GetByEmail(email)
}

func (s *userService) SyncUser(id, email, fullName, avatarURL string) (*model.User, error) {
	// Check if user exists
	user, err := s.repo.GetByID(id)
	if err != nil {
		// User doesn't exist, create new
		user = &model.User{
			ID:        id,
			Email:     email,
			FullName:  fullName,
			AvatarURL: avatarURL,
		}
		if err := s.repo.Create(user); err != nil {
			return nil, err
		}
		return user, nil
	}

	// User exists, update if needed
	user.Email = email
	if fullName != "" {
		user.FullName = fullName
	}
	if avatarURL != "" {
		user.AvatarURL = avatarURL
	}

	if err := s.repo.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) Update(user *model.User) error {
	return s.repo.Update(user)
}
