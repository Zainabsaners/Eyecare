
from rest_framework import serializers
from .models import EyeScan, ScanReview

class ScanReviewSerializer(serializers.ModelSerializer):
    specialist_name = serializers.CharField(source='specialist.get_full_name', read_only=True)
    
    class Meta:
        model = ScanReview
        fields = '__all__'
        read_only_fields = ('scan', 'specialist', 'created_at')

class ScanReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanReview
        fields = ('diagnosis', 'recommendations')
        
    def validate_diagnosis(self, value):
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Diagnosis must be at least 10 characters long.")
        return value
        
    def validate_recommendations(self, value):
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Recommendations must be at least 10 characters long.")
        return value

class EyeScanSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    scanreview = ScanReviewSerializer(read_only=True)
    
    class Meta:
        model = EyeScan
        fields = '__all__'
        read_only_fields = ('user', 'condition_detected', 'confidence_score', 'recommendations', 'created_at')
