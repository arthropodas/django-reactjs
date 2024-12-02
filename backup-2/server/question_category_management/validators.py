from django.core.exceptions import ValidationError
from server.utils.messages.error_messages import (
    error_code_e1000,
    error_code_e1002,
    error_code_e1004,
    error_code_e1003,
    error_code_e1005,
    error_code_e1082
)
from question_category_management.models import QuestionCategory


def validate_question_category_name(value):

    if not value or value == "":
        data = error_code_e1002()
        raise ValidationError(data)
    if not isinstance(value, str):
        data = error_code_e1000()
        raise ValidationError(data)
    if len(value) < 2:      
        data = error_code_e1004()
        raise ValidationError(data)
    if len(value) > 100:
        data = error_code_e1003()
        raise ValidationError(data)
    if value[0] == " " or value[-1] == " ":
        data = error_code_e1005()
        raise ValidationError(data)
    return value

def validate_unique_name(value):
    question_category = QuestionCategory.objects.filter(question_category_name=value,status=True)
    if question_category.exists():
        data = error_code_e1082()
        raise ValidationError(data)
    return value
        
