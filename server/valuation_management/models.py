from django.db import models
from exam_management.models import Exam
from student_management.models import Student
from question_management.models import QuestionData, QuestionCategory
from exam_batch_management.models import StudentBatchMapping


class StudentsResponse(models.Model):
    response = models.ForeignKey(
        StudentBatchMapping, on_delete=models.CASCADE, null=True, blank=True
    )
    question = models.ForeignKey(QuestionData, on_delete=models.CASCADE)
    student_input = models.IntegerField()
    
    class Meta:
        db_table = 'students_responses'


class QuestionCategoryResponse(models.Model):
    response = models.ForeignKey(
        StudentBatchMapping, on_delete=models.CASCADE, null=True, blank=True
    )
    category = models.ForeignKey(QuestionCategory, on_delete=models.CASCADE)
    question_difficulty_level = models.IntegerField()
    correct_answer_count = models.IntegerField()

    class Meta:
        db_table = 'student_responses_category_wise'