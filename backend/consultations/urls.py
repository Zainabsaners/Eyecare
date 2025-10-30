from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'consultations', views.ConsultationViewSet, basename='consultation')

urlpatterns = [
    path('', include(router.urls)),
]
