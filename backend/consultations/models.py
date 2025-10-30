from django.db import models
from users.models import CustomUser

class Consultation(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_consultations')
    specialist = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='specialist_consultations')
    scan = models.ForeignKey('scans.EyeScan', on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    scheduled_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Consultation {self.id} - {self.user.username} with {self.specialist.username}"
