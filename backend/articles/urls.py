from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ArticleViewSet, basename='articles')  # Remove 'articles' here

urlpatterns = [
    path('', include(router.urls)),
]