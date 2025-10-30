from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ('status', 'assigned_to', 'created_at', 'updated_at')

class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ('name', 'email', 'subject', 'message')
    
    def validate_subject(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Subject must be at least 5 characters long.")
        return value
    
    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        return value
