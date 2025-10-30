from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from django.http import JsonResponse

# Add this root view function
def api_root(request):
    return JsonResponse({
        "message": "EyeCare API is running!",
        "status": "active",
        "endpoints": {
            "admin": "/admin/",
            "auth": "/api/auth/",
            "scans": "/api/scans/",
            "articles": "/api/articles/",
            "consultations": "/api/consultations/",
            "contact": "/api/contact/",
            "token_refresh": "/api/token/refresh/"
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),  # Add this root endpoint
    path('admin/', admin.site.urls),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('users.urls')),
    path('api/scans/', include('scans.urls')),  # Fixed: added 'scans/' 
    path('api/articles/', include('articles.urls')),  # Fixed: added 'articles/'
    path('api/consultations/', include('consultations.urls')),  # Fixed: added 'consultations/'
    path('api/contact/', include('contact.urls')),  # Fixed: added 'contact/'
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)