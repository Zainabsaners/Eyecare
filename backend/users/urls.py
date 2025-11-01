from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse
from . import views

# Root endpoint that works with GET
@api_view(['GET'])
@permission_classes([AllowAny])
def auth_overview(request):
    return Response({
        "message": "EyeCare Authentication API",
        "status": "active",
        "endpoints": {
            "login": "POST /api/auth/login/",
            "register": "POST /api/auth/register/",
            "token_refresh": "POST /api/token/refresh/",
            "specialists": "GET /api/auth/specialists/",
            "users": "GET /api/auth/users/"
        },
        "note": "Login and register endpoints require POST requests"
    })

# Add GET endpoints that explain how to use the API
@api_view(['GET'])
@permission_classes([AllowAny])
def register_info(request):
    return Response({
        "endpoint": "POST /api/auth/register/",
        "description": "Register a new user",
        "required_fields": ["username", "email", "password", "user_type"],
        "user_types": ["patient", "specialist"],
        "for_specialists": ["specialization", "license_number"]
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def login_info(request):
    return Response({
        "endpoint": "POST /api/auth/login/",
        "description": "Login user and get JWT tokens",
        "required_fields": ["username", "password"],
        "returns": ["access_token", "refresh_token", "user_data"]
    })

urlpatterns = [
    path('', auth_overview, name='auth_api_overview'),
    path('register/', views.register, name='register'),
    path('register/info/', register_info, name='register_info'),
    path('login/', views.login, name='login'),
    path('login/info/', login_info, name='login_info'),
    
    # NEW ENDPOINTS - Add these lines
    path('specialists/', views.get_specialists, name='get_specialists'),
    path('users/', views.get_users, name='get_users'),
]