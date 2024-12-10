from django.core.exceptions import ValidationError
from server.utils.messages.error_messages import (
    error_code_e1097,
    error_code_e1098,
    error_code_e1099,
    error_code_e1100,
    error_code_e1101,
    error_code_e1102,
    error_code_e1103,
    error_code_e1104,
    error_code_e4800,
    error_code_e4801,
    error_code_e4802,
)
from exam_management.models import Exam


def validate_batch_name(value):
    if not value or value == "":
        raise ValidationError(error_code_e1097())
    if not isinstance(value, str):
        raise ValidationError(error_code_e1098())
    if len(value) < 3:
        raise ValidationError(error_code_e1099())
    if len(value) > 100:
        raise ValidationError(error_code_e1100())
    if value[0] == " " or value[-1] == " ":
        raise ValidationError(error_code_e1101())


def validate_exam_id(value):
    if not value or value == "":
        raise ValidationError(error_code_e1102())
    try:
        exam_id = int(value)
        exam = Exam.objects.filter(
            id=exam_id, status_of_exam__in=[Exam.SCHEDULED, Exam.STARTED]
        ).first()
        if exam:
            return exam
        else:
            raise ValidationError(error_code_e1104())
    except Exception:
        raise ValidationError(error_code_e1103())


def validate_batch_status(value):
    if not value or value == "":
        raise ValidationError(error_code_e4800())

    if not isinstance(value, int):
        raise ValidationError(error_code_e4801())

    if value not in [1, 2]:
        raise ValidationError(error_code_e4802())
