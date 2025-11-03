from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'contact-messages', views.ContactMessageViewSet, basename='contactmessage')
urlpatterns = [
    path('', include(router.urls)),
    path('test-email/', views.test_email_directly, name='test_email'),
]
