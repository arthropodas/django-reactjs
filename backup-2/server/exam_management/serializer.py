from rest_framework import serializers
from .models import Exam, ExamLocations
from questionnaire_management.models import Questionnaire
from exam_batch_management.serializer import BatchSerializer
from question_management.models import QuestionCategory, QuestionData





class ExamLocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamLocations
        fields = ["id", "location_name"]  # Include location_name field


# Serializer for Questionnaire
class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ["id", "questionnaire_name"]  # Include questionnaire_name field


class ExamSerializer(serializers.ModelSerializer):
    exam_location = ExamLocationsSerializer()
    questionnaire = QuestionnaireSerializer()
    batches = BatchSerializer(many=True, source="filtered_batches")

    class Meta:
        model = Exam
        fields = "__all__"




class QuestionCategoryListView(serializers.ModelSerializer):
    class Meta:
        model = QuestionCategory
        fields = "__all__"


class QuestionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionData
        fields = "__all__"
