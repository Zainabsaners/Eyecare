from rest_framework import viewsets, permissions
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Article.objects.filter(is_published=True).order_by('-created_at')
