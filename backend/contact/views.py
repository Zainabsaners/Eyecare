import logging
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import ContactMessage
from .serializers import ContactMessageSerializer, ContactMessageCreateSerializer

# Get a logger instance
logger = logging.getLogger(__name__)

User = get_user_model()

class IsAdminOrSpecialist(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type in ['admin', 'specialist'] or 
            request.user.is_staff
        )

class ContactMessageViewSet(viewsets.ModelViewSet):
    
    def get_permissions(self):
        logger.info(f"🔐 get_permissions called for action: {self.action}")
        if self.action == 'create':
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        logger.info(f"📄 get_serializer_class called for action: {self.action}")
        if self.action == 'create':
            return ContactMessageCreateSerializer
        return ContactMessageSerializer
    
    def get_queryset(self):
        logger.info(f"📋 get_queryset called")
        user = self.request.user
        if user.is_authenticated:
            if user.user_type in ['admin', 'specialist'] or user.is_staff:
                return ContactMessage.objects.all()
        return ContactMessage.objects.none()
    
    def create(self, request, *args, **kwargs):
        logger.info("🎯🎯🎯 ContactMessageViewSet.create() method CALLED 🎯🎯🎯")
        logger.info(f"📦 Request data: {request.data}")
        
        try:
            # Step 1: Create serializer
            serializer = self.get_serializer(data=request.data)
            logger.info("✅ Serializer created successfully")
            
            # Step 2: Validate data
            serializer.is_valid(raise_exception=True)
            logger.info("✅ Serializer validation passed")
            
            # Step 3: Save to database
            contact_message = serializer.save()
            logger.info(f"✅ Contact message saved to database - ID: {contact_message.id}")
            logger.info(f"📝 Message details - From: {contact_message.name}, Email: {contact_message.email}, Subject: {contact_message.subject}")
            
            # Step 4: Send email notifications
            logger.info("📧 About to call send_notification_emails...")
            email_success = self.send_notification_emails(contact_message)
            
            if email_success:
                logger.info("✅ Email sending process completed successfully")
            else:
                logger.warning("⚠️ Email sending process completed with warnings")
            
            # Step 5: Return response
            headers = self.get_success_headers(serializer.data)
            logger.info("✅ Returning success response to client")
            
            return Response(
                {
                    'message': 'Thank you for your message! Our team will get back to you soon.',
                    'data': serializer.data,
                    'email_sent': email_success
                },
                status=status.HTTP_201_CREATED,
                headers=headers
            )
            
        except Exception as e:
            logger.error(f"💥💥💥 CRITICAL ERROR in create method: {str(e)}")
            import traceback
            logger.error(f"💥💥💥 Full traceback: {traceback.format_exc()}")
            # Re-raise to see the error in response
            raise
    
    def send_notification_emails(self, contact_message):
        """Send email notifications to admins and specialists"""
        logger.info("🎯 send_notification_emails method CALLED")
        
        try:
            logger.info("=== 📧 EMAIL SENDING PROCESS STARTED ===")
            import resend
            # Set API key
            resend.api_key = settings.RESEND_API_KEY
            logger.info("✅ Resend API key configured")

            
            # Step 1: Prepare recipient list
            recipient_list = list(settings.ADMIN_EMAILS)
            logger.info(f"📧 Initial recipients from settings: {recipient_list}")

            if not recipient_list:
               logger.error("❌ No valid email addresses found for notifications")
               return False
            
            # Step 2: Add admins and specialists from database
            users = User.objects.filter(
                user_type__in=['admin', 'specialist'],
                is_active=True
            ).exclude(email__isnull=True).exclude(email='')
            
            user_emails = [user.email for user in users if user.email]
            recipient_list.extend(user_emails)
            
            # Remove duplicates
            recipient_list = list(set(recipient_list))
            logger.info(f"📧 Final recipient list: {recipient_list}")
            
            if not recipient_list:
                logger.error("❌ No valid email addresses found for notifications")
                return False
            
            # Step 3: Prepare email content
            subject = f"New Contact Message: {contact_message.subject}"
            message = f"""
New contact message received from EyeCare Vision AI:

From: {contact_message.name}
Email: {contact_message.email}
Subject: {contact_message.subject}

Message:
{contact_message.message}

---
Please log in to the admin panel to respond to this message.

Best regards,
EyeCare Vision AI Team
            """.strip()
            
            logger.info(f"📧 Email details:")
            logger.info(f"   From: {settings.DEFAULT_FROM_EMAIL}")
            logger.info(f"   To: {recipient_list}")
            logger.info(f"   Subject: {subject}")
            
            # Step 4: Send email
            logger.info("🔄 Attempting to send email via SMTP...")
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=recipient_list,
                fail_silently=False,  # This will raise an exception if sending fails
            )
            
            logger.info(f"✅ SUCCESS: Notification emails sent to {len(recipient_list)} recipients")
            logger.info(f"✅ Recipients: {recipient_list}")
            return True
            
        except Exception as e:
            logger.error(f"💥 ERROR in send_notification_emails: {str(e)}")
            import traceback
            logger.error(f"💥 Full error details: {traceback.format_exc()}")
            return False
        
        finally:
            logger.info("🎯 send_notification_emails method COMPLETED")
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrSpecialist])
    def assign_to_me(self, request, pk=None):
        logger.info(f"👤 assign_to_me action called for message {pk}")
        contact_message = self.get_object()
        contact_message.assigned_to = request.user
        contact_message.status = 'in_progress'
        contact_message.save()
        
        serializer = self.get_serializer(contact_message)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrSpecialist])
    def mark_resolved(self, request, pk=None):
        logger.info(f"✅ mark_resolved action called for message {pk}")
        contact_message = self.get_object()
        contact_message.status = 'resolved'
        contact_message.save()
        
        serializer = self.get_serializer(contact_message)
        return Response(serializer.data)


@api_view(['POST'])
def test_email_directly(request):
    """Test email sending directly - no database involved"""
    logger.info("🧪🧪🧪 TEST EMAIL ENDPOINT CALLED 🧪🧪🧪")
    
    try:
        import resend
        # Set API key
        resend.api_key = settings.RESEND_API_KEY
        logger.info("✅ Resend API key configured")

        subject = 'TEST: Direct Email from EyeCare Vision AI'
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }}
                .header {{ background-color: #4CAF50; color: white; padding: 10px 0; text-align: center; border-radius: 5px 5px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; }}
                </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>EyeCare Vision AI - Test Email Successful</h1>
                </div>
                <div class="content">
                    <p>Dear Admin,</p>
                    <p>This is a <strong>test email</strong> sent directly from the EyeCare Vision AI application to verify that the email sending functionality is working correctly.</p>
                    <p>If you have received this email, it means that the email configuration is set up properly.</p>
                    </div>
                    </div>
        </body>
        </html>
        """

        text_content = "This is a test email sent directly from the EyeCare Vision AI application to verify that the email sending functionality is working correctly."


        
        subject = 'TEST: Direct Email from EyeCare Vision AI'
        message = 'This is a direct test email from the EyeCare Vision AI application to verify that email sending is working correctly.'
        
        logger.info(f"📧 Sending test email:")
        logger.info(f"   From: {settings.DEFAULT_FROM_EMAIL}")
        logger.info(f"   To: {settings.ADMIN_EMAILS}")
        logger.info(f"   Subject: {subject}")

        params = {
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": settings.ADMIN_EMAILS,
            "subject": subject,
            "html": html_content,
            "text": text_content,
        }
        response = resend.emails.send(params)
        
        logger.info("✅✅✅ TEST EMAIL SENT SUCCESSFULLY ✅✅✅")
        return Response({
            'status': 'success', 
            'message': 'Test email sent successfully! Check your inbox.'
        })
        
    except Exception as e:
        logger.error(f"💥💥💥 TEST EMAIL FAILED: {str(e)}")
        import traceback
        logger.error(f"💥💥💥 Full error details: {traceback.format_exc()}")
        return Response({
            'status': 'error', 
            'message': f'Failed to send test email: {str(e)}'
        }, status=500)