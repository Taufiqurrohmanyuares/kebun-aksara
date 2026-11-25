import random
import string
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password, check_password
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email wajib diisi.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.CURRICULUM_ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        PARENT = "PARENT", "Orang Tua"
        TEACHER = "TEACHER", "Guru PAUD/TK"
        CURRICULUM_ADMIN = "CURRICULUM_ADMIN", "Admin Kurikulum"

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=120)
    role = models.CharField(max_length=24, choices=Role.choices, default=Role.PARENT)
    parent_pin_hash = models.CharField(max_length=128, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def set_parent_pin(self, raw_pin: str):
        self.parent_pin_hash = make_password(raw_pin)

    def check_parent_pin(self, raw_pin: str) -> bool:
        if not self.parent_pin_hash:
            return False
        return check_password(raw_pin, self.parent_pin_hash)

    def __str__(self):
        return f"{self.full_name} ({self.role})"


def generate_invite_code():
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


class Classroom(models.Model):
    teacher = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="managed_classrooms"
    )
    name = models.CharField(max_length=100)
    invite_code = models.CharField(max_length=8, unique=True, default=generate_invite_code)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.invite_code})"


def default_mascot_gear() -> dict:
    return {"hat": None, "glasses": None, "shirt": "kaos_dasar_hijau"}


class ChildProfile(models.Model):

    parent = models.ForeignKey(User, on_delete=models.CASCADE, related_name="children")
    classroom = models.ForeignKey(
        Classroom, on_delete=models.SET_NULL, null=True, blank=True, related_name="students"
    )
    name = models.CharField(max_length=80)
    avatar_code = models.CharField(max_length=40, default="kiko_default")
    birth_year = models.PositiveIntegerField(default=2020)
    stars_balance = models.PositiveIntegerField(default=0)
    current_level = models.PositiveIntegerField(default=1)
    mascot_equipped = models.JSONField(
        default=dict,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.mascot_equipped:
            self.mascot_equipped = {"hat": None, "glasses": None, "shirt": None}
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} (Level {self.current_level})"