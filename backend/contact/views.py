from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import ContactMessage
from .serializers import ContactMessageSerializer, ContactMessageCreateSerializer

User = get_user_model()

class IsAdminOrSpecialist(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type in ['admin', 'specialist'] or 
            request.user.is_staff
        )

class ContactMessageViewSet(viewsets.ModelViewSet):
    # FIXED: Allow public access for creating contact messages
    def get_permissions(self):
        if self.action == 'create':
            # Allow anyone to create contact messages
            return [permissions.AllowAny()]
        else:
            # Require authentication for other actions (list, retrieve, etc.)
            return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ContactMessageCreateSerializer
        return ContactMessageSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.user_type in ['admin', 'specialist'] or user.is_staff:
                return ContactMessage.objects.all()
        return ContactMessage.objects.none()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        contact_message = serializer.save()
        
        # Send email notifications
        self.send_notification_emails(contact_message)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'message': 'Thank you for your message! Our team will get back to you soon.',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def send_notification_emails(self, contact_message):
        """Send email notifications to admins and specialists"""
        try:
            # Get recipients from settings AND from user database
            recipient_list = list(settings.ADMIN_EMAILS)  # Start with admin emails from settings
            
            # Add admins and specialists from database
            users = User.objects.filter(
                user_type__in=['admin', 'specialist'],
                is_active=True
            ).exclude(email__isnull=True).exclude(email='')
            
            user_emails = [user.email for user in users if user.email]
            recipient_list.extend(user_emails)
            
            # Remove duplicates
            recipient_list = list(set(recipient_list))
            
            if recipient_list:
                subject = f"New Contact Message: {contact_message.subject}"
                message = f"""
New contact message received:

From: {contact_message.name}
Email: {contact_message.email}
Subject: {contact_message.subject}

Message:
{contact_message.message}

Please log in to the admin panel to respond to this message.

Best regards,
EyeCare Vision AI Team
                """
                
                send_mail(
                    subject=subject,
                    message=message.strip(),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=recipient_list,
                    fail_silently=False,
                )
                
                print(f"Notification emails sent to {len(recipient_list)} recipients: {recipient_list}")
            else:
                print("No valid email addresses found for notifications")
                
        except Exception as e:
            print(f"Error sending notification emails: {str(e)}")
            # You might want to log this error for debugging
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrSpecialist])
    def assign_to_me(self, request, pk=None):
        contact_message = self.get_object()
        contact_message.assigned_to = request.user
        contact_message.status = 'in_progress'
        contact_message.save()
        
        serializer = self.get_serializer(contact_message)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrSpecialist])
    def mark_resolved(self, request, pk=None):
        contact_message = self.get_object()
        contact_message.status = 'resolved'
        contact_message.save()
        
        serializer = self.get_serializer(contact_message)
        return Response(serializer.data)