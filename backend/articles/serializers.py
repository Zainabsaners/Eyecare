from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = Article
        fields = '__all__'
