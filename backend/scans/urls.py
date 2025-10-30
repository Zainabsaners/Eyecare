from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'scans', views.EyeScanViewSet, basename='scan')
router.register(r'scan-reviews', views.ScanReviewViewSet, basename='scanreview')

urlpatterns = [
    path('', include(router.urls)),
]
