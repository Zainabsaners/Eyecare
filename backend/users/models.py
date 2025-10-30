from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('user', 'User'),
        ('specialist', 'Specialist'),
        ('admin', 'Admin'),
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='user')
    phone_number = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    specialization = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Medical specialization (for specialists only)"
    )


    def __str__(self):
        return f"{self.username} ({self.user_type})"

class SpecialistProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50)
    years_of_experience = models.IntegerField(default=0)
    hospital_affiliation = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.specialization}"
