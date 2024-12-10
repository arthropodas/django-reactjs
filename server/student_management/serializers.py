from rest_framework import serializers
from .models import Student
from institution_management.models import Institution
from exam_management.models import Exam

class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ["id", "institution_name", "institution_code"]


from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    institution = InstitutionSerializer()  # Nested serializer for institution
    course = serializers.SerializerMethodField()  # Use a custom method to format course

    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "cgpa",
            "no_of_backlogs",
            "institution",
            "course",  # This will call the method defined below
            "pass_out_year",
        ]

    def get_course(self, obj):
        # Map the course integer to the desired format
        course_mapping = dict(self.Meta.model.COURSE_CHOICES)
        return {
            "id": obj.course,
            "value": course_mapping.get(obj.course)
        }




class ExamSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Exam
        fields = "__all__"  # or specify fields individually