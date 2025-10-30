from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, SpecialistProfile

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'phone_number', 'location', 'date_of_birth')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(SpecialistProfile)
