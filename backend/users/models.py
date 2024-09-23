from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(
            email=self.normalize_email(email),
            **kwargs,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **kwargs):
        user = self.create_user(
            email,
            password=password,
            **kwargs,
        )
        user.is_staff = True
        user.is_superuser = True
        user.role = "admin"
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("instructor", "Instructor"),
        ("student", "Student"),
    )
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    full_name = models.CharField(max_length=255)
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default="student",
    )
    profile_image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
        null=True,
        default="profile_images/user.jpg",
    )
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return f"{self.full_name} - {self.role}"

    def can_change(self, user):
        return user.is_superuser or user == self

    class Meta:
        db_table = "user"
        verbose_name_plural = "Users"
        ordering = ["-created_at"]
