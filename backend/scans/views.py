
import random
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import EyeScan, ScanReview
from .serializers import EyeScanSerializer, ScanReviewSerializer, ScanReviewCreateSerializer

class IsOwnerOrSpecialist(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or specialists to view it.
    """
    def has_object_permission(self, request, view, obj):
        # Specialists can access all scans
        if request.user.user_type == 'specialist':
            return True
        # Users can only access their own scans
        return obj.user == request.user

class EyeScanViewSet(viewsets.ModelViewSet):
    serializer_class = EyeScanSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrSpecialist]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'specialist':
            return EyeScan.objects.all().order_by('-created_at')
        return EyeScan.objects.filter(user=user).order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        # Override list to ensure consistent response format
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        # Only patients can create scans
        if self.request.user.user_type != 'user':
            raise permissions.PermissionDenied("Only patients can upload eye scans.")
        
        # Mock AI analysis
        conditions = ['cataract', 'redness', 'dryness', 'glaucoma', 'conjunctivitis', 'normal']
        weights = [0.1, 0.2, 0.25, 0.1, 0.2, 0.15]
        condition = random.choices(conditions, weights=weights, k=1)[0]
        confidence = round(random.uniform(0.7, 0.95), 2)
        
        recommendations = {
            'cataract': "Clouding of the eye's lens detected. Consider consulting an ophthalmologist for further evaluation and potential surgical options.",
            'redness': "Eye redness detected. This may indicate irritation, allergy, or infection. Monitor symptoms and consult if persistent for more than 48 hours.",
            'dryness': "Signs of dry eyes detected. Use lubricating eye drops, avoid prolonged screen time, and consider using a humidifier.",
            'glaucoma': "Potential signs of glaucoma detected. Urgent consultation recommended with an eye specialist for pressure testing and treatment.",
            'conjunctivitis': "Possible conjunctivitis (pink eye) detected. Practice good hygiene, avoid touching eyes, and consult a doctor for antibiotic treatment if bacterial.",
            'normal': "No significant issues detected. Maintain regular eye checkups and practice good eye care habits."
        }
        
        serializer.save(
            user=self.request.user,
            condition_detected=condition,
            confidence_score=confidence,
            recommendations=recommendations[condition]
        )
    
    @action(detail=True, methods=['post'], parser_classes=[JSONParser])
    def review(self, request, pk=None):
        print(f"Review request received for scan {pk}")
        print(f"Request data: {request.data}")
        print(f"Request user: {request.user}")
        print(f"Request user type: {request.user.user_type}")
        
        # Only specialists can review scans
        if request.user.user_type != 'specialist':
            print("User is not a specialist")
            return Response(
                {'error': 'Only specialists can review scans'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            scan = self.get_object()
            print(f"Scan found: {scan}")
        except Exception as e:
            print(f"Error getting scan: {e}")
            return Response(
                {'error': 'Scan not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if scan already has a review
        if scan.is_reviewed:
            print("Scan already reviewed")
            return Response(
                {'error': 'This scan has already been reviewed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use the create serializer which only requires diagnosis and recommendations
        serializer = ScanReviewCreateSerializer(data=request.data)
        print(f"Serializer data: {request.data}")
        print(f"Serializer valid: {serializer.is_valid()}")
        
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create the review with scan and specialist automatically set
            scan_review = ScanReview.objects.create(
                scan=scan,
                specialist=request.user,
                diagnosis=serializer.validated_data['diagnosis'],
                recommendations=serializer.validated_data['recommendations']
            )
            
            # Mark scan as reviewed
            scan.is_reviewed = True
            scan.save()
            
            print(f"Review created successfully: {scan_review.id}")
            
            # Return the full review data
            response_serializer = ScanReviewSerializer(scan_review)
            return Response(response_serializer.data)
            
        except Exception as e:
            print(f"Error saving review: {e}")
            return Response(
                {'error': 'Failed to save review'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ScanReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ScanReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'specialist':
            return ScanReview.objects.filter(specialist=user)
        # Patients can only see reviews of their scans
        return ScanReview.objects.filter(scan__user=user)
