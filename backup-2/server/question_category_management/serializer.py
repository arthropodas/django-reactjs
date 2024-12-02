from rest_framework import serializers
from .models import QuestionCategory

class QuestionCategoryManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionCategory
        fields = "__all__"
