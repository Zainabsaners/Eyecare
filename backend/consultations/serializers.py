from rest_framework import serializers
from .models import Consultation
from users.serializers import UserSerializer

class ConsultationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    specialist_name = serializers.CharField(source='specialist.get_full_name', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    specialist_details = UserSerializer(source='specialist', read_only=True)
    
    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ('created_at', 'user')

class ConsultationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = ('specialist', 'scan', 'description', 'scheduled_date')
    
    def validate_specialist(self, value):
        # Ensure the selected user is actually a specialist
        if value.user_type != 'specialist':
            raise serializers.ValidationError("Selected user is not a specialist")
        return value