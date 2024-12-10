from rest_framework import serializers
from .models import Questionnaire

class QuestionnaireSerializer(serializers.ModelSerializer):
    total_questions = serializers.SerializerMethodField()

    class Meta:
        model = Questionnaire
        fields = ['id', 'questionnaire_name', 'status', 'created_at', 'updated_at', 'total_questions']

    def get_total_questions(self, obj):
        # Count related questions
        return obj.questions.count() 
