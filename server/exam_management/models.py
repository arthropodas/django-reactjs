from django.db import models
from institution_management.models import Institution
from question_category_management.models import QuestionCategory
from question_management.models import QuestionData, Options
from questionnaire_management.models import Questionnaire


class ExamLocations(models.Model):
    location_name = models.CharField(max_length=255)
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)  # Exam details created time
    updated_at = models.DateTimeField(auto_now=True)  # Exam updated time
    
    class Meta:
        db_table = 'exam_location'

class Exam(models.Model):

    SCHEDULED = 0
    STARTED = 1
    COMPLETED = 2
    CANCELLED = 3
    EXAM_STATUS = (
        (SCHEDULED, "exam scheduled"),
        (STARTED, "exam started"),
        (COMPLETED, "exam completed"),
        (CANCELLED, "exam cancelled"),
    )

    exam_name = models.CharField(max_length=100)  # Exam name
    exam_date = models.DateField()
    exam_time = models.TimeField()  # Exam scheduled time
    exam_duration = models.IntegerField(default=60)
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)  # Exam details created time
    updated_at = models.DateTimeField(auto_now=True)  # Exam updated time
    exam_location = models.ForeignKey(
        ExamLocations,
        on_delete=models.CASCADE,
    )  # Institution
    status_of_exam = models.IntegerField(choices=EXAM_STATUS, default=SCHEDULED)
    questionnaire = models.ForeignKey(
        Questionnaire, on_delete=models.CASCADE, null=True, blank=True
    )
    cut_of_mark = models.FloatField(null=True)
    is_pool = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'exam'




class ExamCriteria(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    category = models.ForeignKey(QuestionCategory, on_delete=models.CASCADE)
    question_difficulty_level = models.IntegerField()
    cut_off = models.IntegerField()
    
    class Meta:
        db_table = 'exam_criteria'
