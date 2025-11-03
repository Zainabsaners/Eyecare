from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

# FIXED: Import your models and serializers correctly
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
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        else:
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
        print("🎯 ContactMessageViewSet.create() method CALLED")

        try:
            serializer = self.get_serializer(data=request.data)
            print("🎯 Serializer created")

            serializer.is_valid(raise_exception=True)
            print("🎯 Serializer validation passed")
            
            contact_message = serializer.save()
            print(f"🎯 Contact message saved to database - ID: {contact_message.id}")
            print(f"=== CONTACT MESSAGE CREATED ===")
            print(f"Message ID: {contact_message.id}")
            print(f"From: {contact_message.name} ({contact_message.email})")
            print(f"Subject: {contact_message.subject}")

            print("🎯 About to call send_notification_emails...")
            # Send email notifications
            self.send_notification_emails(contact_message)
            print("🎯 send_notification_emails completed")
            
            headers = self.get_success_headers(serializer.data)
            return Response(
                {
                    'message': 'Thank you for your message! Our team will get back to you soon.',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            print(f"💥 ERROR in create method: {e}")
            # Re-raise the exception to see it in logs
            raise
    
    def send_notification_emails(self, contact_message):
        """Send email notifications to admins and specialists"""
        print("🎯 send_notification_emails method CALLED")
        try:
            print("=== EMAIL SENDING PROCESS STARTED ===")
            print(f"Contact Message: {contact_message.name} - {contact_message.subject}")
            
            # Get recipients from settings AND from user database
            recipient_list = list(settings.ADMIN_EMAILS)
            print(f"📧 Initial recipients: {recipient_list}")
            
            # Add admins and specialists from database
            users = User.objects.filter(
                user_type__in=['admin', 'specialist'],
                is_active=True
            ).exclude(email__isnull=True).exclude(email='')
            
            user_emails = [user.email for user in users if user.email]
            recipient_list.extend(user_emails)
            
            # Remove duplicates
            recipient_list = list(set(recipient_list))
            print(f"📧 Final recipient list: {recipient_list}")
            
            if not recipient_list:
                print("❌ No valid email addresses found for notifications")
                return
            
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
            
            print(f"📧 Sending email from: {settings.DEFAULT_FROM_EMAIL}")
            print(f"📧 Sending email to: {recipient_list}")
            print(f"📧 Email subject: {subject}")
            
            # Test if we can actually send email
            send_mail(
                subject=subject,
                message=message.strip(),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=recipient_list,
                fail_silently=False,
            )
            
            print(f"✅ SUCCESS: Notification emails sent to {len(recipient_list)} recipients: {recipient_list}")
            
        except Exception as e:
            print(f"💥 ERROR sending notification emails: {str(e)}")
            import traceback
            print(f"💥 Full error details: {traceback.format_exc()}")
        
        print("🎯 send_notification_emails method COMPLETED")
    
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

# Add the test email function at the bottom
@api_view(['POST'])
def test_email_directly(request):
    """Test email sending directly - no database involved"""
    try:
        print("🧪 TEST EMAIL ENDPOINT CALLED")
        
        send_mail(
            subject='TEST: Direct Email from EyeCare',
            message='This is a direct test email from the EyeCare application.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=settings.ADMIN_EMAILS,
            fail_silently=False,
        )
        
        print("✅ TEST EMAIL SENT SUCCESSFULLY")
        return Response({'status': 'success', 'message': 'Test email sent successfully!'})
        
    except Exception as e:
        print(f"💥 TEST EMAIL FAILED: {str(e)}")
        import traceback
        print(f"💥 Full error: {traceback.format_exc()}")
        return Response({'status': 'error', 'message': str(e)}, status=500)