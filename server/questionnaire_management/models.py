from django.db import models
from question_category_management.models import QuestionCategory
from question_management.models import QuestionData, Options, QuestionImage


class Questionnaire(models.Model):
    questionnaire_name = models.CharField(max_length=200)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'questionnaire'


# class QuestionnaireCategories(models.Model):
#     questionnaire = models.ForeignKey(
#         Questionnaire, on_delete=models.CASCADE, related_name="categories"
#     )
#     question_category = models.ForeignKey(
#         QuestionCategory,
#         on_delete=models.CASCADE,
#         related_name="questionnaire_categories",
#     )
#     number_of_questions = models.IntegerField()

    
#     class Meta:
#         db_table = 'questionnaire_categories'


class QuestionnaireQuestions(models.Model):
    questionnaire = models.ForeignKey(
        Questionnaire, on_delete=models.CASCADE, related_name="questions"
    )
    question = models.ForeignKey(
        QuestionData, on_delete=models.CASCADE, related_name="questionnaire_questions"
    )
    
    class Meta:
        db_table = 'questionnaire_questions'
