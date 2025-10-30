from django.db import models
from users.models import CustomUser

class Article(models.Model):
    CATEGORY_CHOICES = (
        ('prevention', 'Prevention Tips'),
        ('symptoms', 'Early Symptoms'),
        ('treatment', 'Treatment Options'),
        ('general', 'General Eye Care'),
    )
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='articles/', blank=True, null=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
