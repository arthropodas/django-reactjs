from rest_framework import serializers
from .models import Feedbacks
from student_management.serializers import StudentSerializer

class FeedbacksSerializer(serializers.ModelSerializer):
    student = StudentSerializer()  # Include Student details

    class Meta:
        model = Feedbacks
        fields = ['id', 'rating' ,'comment', 'student', 'status', 'created_at', 'updated_at']