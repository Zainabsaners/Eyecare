# consultations/permissions.py
from rest_framework import permissions

class IsAdminOrSpecialist(permissions.BasePermission):
    """Allows access only to admin and specialist users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type in ['admin', 'specialist'] or 
            request.user.is_staff
        )

class CanCreateConsultation(permissions.BasePermission):
    """Allows patients to create consultations and specialists/admins to view"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        if view.action == 'create':
            # Patients can create consultations
            return request.user.user_type in ['patient', 'admin', 'specialist']
        elif view.action in ['list', 'retrieve']:
            # Users can only see their own consultations
            # Specialists/admins can see all
            return True
        return False

    def has_object_permission(self, request, view, obj):
        # Users can see their own consultations
        # Specialists/admins can see all
        if request.user.user_type in ['admin', 'specialist'] or request.user.is_staff:
            return True
        return obj.patient == request.user