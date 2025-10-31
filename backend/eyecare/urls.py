from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from django.http import JsonResponse

# Add this root view function
def api_root(request):
    return JsonResponse({
        "message": "EyeCare API is running successfully! 🎉",
        "status": "active", 
        "version": "1.0",
        "endpoints": {
            "admin": "/admin/",
            "api_auth": "/api/auth/",
            "api_scans": "/api/scans/",
            "api_articles": "/api/articles/", 
            "api_consultations": "/api/consultations/",
            "api_contact": "/api/contact/",
            "token_obtain": "/api/auth/login/",
            "token_refresh": "/api/token/refresh/"
        }
    })

def health_check(request):
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user_count = User.objects.count()
        return JsonResponse({
            "status": "healthy", 
            "database": "working",
            "user_count": user_count
        })
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "database": "broken", 
            "error": str(e)
        }, status=500)

urlpatterns = [
    path('', api_root, name='api-root'),
    path('health/', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('users.urls')),
    path('api/scans/', include('scans.urls')),
    path('api/articles/', include('articles.urls')),
    path('api/consultations/', include('consultations.urls')),
    path('api/contact/', include('contact.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)