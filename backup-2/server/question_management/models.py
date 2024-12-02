from django.db import models
from question_category_management.models import QuestionCategory


def upload_path(instance, filename):
    return "/".join(["question-image", filename])


class QuestionData(models.Model):

    MCQ = 0
    TRUEORFALSE = 1
    MCS = 2

    QUESTION_TYPE_CHOICES = (
        (MCQ, "multiple choice question"),
        (TRUEORFALSE, "trueorfalse"),
        (MCS, "multiple choice selection"),
    )

    EASY = 1
    MEDIUM = 2
    HARD = 3

    QUESTION_DIFFICULTY_CHOICES = (
        (EASY, "Easy"),
        (MEDIUM, "Medium"),
        (HARD, "Hard"),
    )

    question = models.CharField(max_length=1000)
    question_category_id = models.ForeignKey(
        QuestionCategory, on_delete=models.CASCADE, null=True, blank=True
    )
    question_type = models.IntegerField(choices=QUESTION_TYPE_CHOICES, default=MCQ)
    question_difficulty_level = models.IntegerField(
        choices=QUESTION_DIFFICULTY_CHOICES, default=EASY
    )
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "question"


class Options(models.Model):
    option = models.CharField(max_length=1000)
    question_id = models.ForeignKey(
        QuestionData, on_delete=models.CASCADE, null=True, blank=True
    )
    is_correct = models.BooleanField(default=False)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "options"


class QuestionImage(models.Model):
    question_id = models.ForeignKey(
        QuestionData, on_delete=models.CASCADE, null=True, blank=True
    )
    question_image = models.ImageField(
        blank=True, null=True, upload_to=upload_path, max_length=255
    )
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "question_image"
