from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import JsonResponse
from . import views

# Add this root view function
def auth_overview(request):
    return JsonResponse({
        "message": "EyeCare Authentication API",
        "status": "active",
        "endpoints": {
            "login": "/api/auth/login/",
            "register": "/api/auth/register/",
            "token_refresh": "/api/token/refresh/"
        }
    })

urlpatterns = [
    path('', auth_overview, name='auth_api_overview'),  # ← ADD THIS LINE (Root endpoint)
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),  # Keep your custom login view
]