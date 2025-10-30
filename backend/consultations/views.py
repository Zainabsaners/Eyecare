from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Consultation
from .serializers import ConsultationSerializer, ConsultationCreateSerializer
from users.models import CustomUser  # Import your user model

class ConsultationViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action == 'create':
            return ConsultationCreateSerializer
        return ConsultationSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.user_type == 'specialist':
                # Specialists see consultations assigned to them
                return Consultation.objects.filter(specialist=user).order_by('-created_at')
            elif user.user_type == 'patient':
                # Patients see their own consultations
                return Consultation.objects.filter(user=user).order_by('-created_at')
            elif user.user_type == 'admin' or user.is_staff:
                # Admins see all consultations
                return Consultation.objects.all().order_by('-created_at')
        return Consultation.objects.none()
    
    def perform_create(self, serializer):
        # Automatically set the user to the current patient
        consultation = serializer.save(user=self.request.user)
        
        # Send notification email to specialist
        self.send_consultation_notification(consultation)
    
    def send_consultation_notification(self, consultation):
        """Send email notification to specialist about new consultation request"""
        try:
            if consultation.specialist and consultation.specialist.email:
                subject = f"New Consultation Request from {consultation.user.get_full_name() or consultation.user.email}"
                message = f"""
You have received a new consultation request:

Patient: {consultation.user.get_full_name() or consultation.user.email}
Scan: {consultation.scan}
Description: {consultation.description}
Scheduled Date: {consultation.scheduled_date}

Please log in to the system to review this consultation request.

Best regards,
EyeCare Vision AI Team
                """
                
                send_mail(
                    subject=subject,
                    message=message.strip(),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[consultation.specialist.email],
                    fail_silently=False,
                )
                print(f"Consultation notification sent to {consultation.specialist.email}")
                
        except Exception as e:
            print(f"Error sending consultation notification: {e}")
    
    # Add endpoint to get available specialists
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def available_specialists(self, request):
        """Get list of available specialists for patients to choose from"""
        specialists = CustomUser.objects.filter(
            user_type='specialist',
            is_active=True
        ).values('id', 'first_name', 'last_name', 'email', 'specialization')
        
        return Response(list(specialists))
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        consultation = self.get_object()
        if consultation.specialist != request.user:
            return Response(
                {'error': 'Not authorized to approve this consultation'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        consultation.status = 'approved'
        consultation.save()
        return Response(ConsultationSerializer(consultation).data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        consultation = self.get_object()
        if consultation.specialist != request.user:
            return Response(
                {'error': 'Not authorized to complete this consultation'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        consultation.status = 'completed'
        consultation.save()
        return Response(ConsultationSerializer(consultation).data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        consultation = self.get_object()
        if consultation.user != request.user and consultation.specialist != request.user:
            return Response(
                {'error': 'Not authorized to cancel this consultation'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        consultation.status = 'cancelled'
        consultation.save()
        return Response(ConsultationSerializer(consultation).data)