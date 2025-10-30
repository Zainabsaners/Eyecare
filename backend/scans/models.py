from django.db import models
from users.models import CustomUser

class EyeScan(models.Model):
    CONDITION_CHOICES = (
        ('cataract', 'Cataract'),
        ('redness', 'Redness'),
        ('dryness', 'Dryness'),
        ('glaucoma', 'Glaucoma'),
        ('conjunctivitis', 'Conjunctivitis'),
        ('normal', 'Normal'),
    )
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='eye_scans/')
    condition_detected = models.CharField(max_length=50, choices=CONDITION_CHOICES)
    confidence_score = models.FloatField()
    recommendations = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_reviewed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Scan {self.id} - {self.condition_detected}"

class ScanReview(models.Model):
    scan = models.OneToOneField(EyeScan, on_delete=models.CASCADE)
    specialist = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    diagnosis = models.TextField()
    recommendations = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
