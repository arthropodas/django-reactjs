from django.core.exceptions import ValidationError
import jwt
import re
from server.utils.messages.error_messages import (
    error_code_e2000,
    error_code_e2001,
    error_code_e2002,
    error_code_e2003,
    error_code_e2010,
    error_code_e2011,
    error_code_e2012,
    error_code_e2013,
    error_code_e2014,
    error_code_e1068,
    error_code_e1069,
    error_code_e1075,
    error_code_e1055,
    error_code_e1073,
    error_code_e1071,
    error_code_e1072,
    error_code_e1074,
    error_code_e1076,
    error_code_e1083,
    error_code_e1084,
    error_code_e1085,
    error_code_e1120,
    error_code_e1121,
    error_code_e1122,
    error_code_e2027,
    error_code_e1122,
    error_code_e2027,
)
from decouple import config
from exam_management.models import Exam
from student_management.models import Student
from exam_batch_management.models import Batch, StudentBatchMapping

# Centralized error messages based on field name
error_messages = {
    "email": error_code_e2000,
    "password": error_code_e2001,
    "new-password": error_code_e2011,
    "confirm-password": error_code_e2012,
}


domain_pattern = config("DOMAIN_PATTERN")
EMAIL_REGEX = config("EMAIL_REGEX")
password_regex = config("PASSWORD_REGEX")
PASSWORD_REGEX = rf"{password_regex}$"


def validate_is_required(value, field_name):
    if not value:
        raise ValidationError(error_messages[field_name]())


def validate_pattern(value, pattern, error_message_func):
    if not re.match(pattern, value):
        raise ValidationError(error_message_func())


def validate_email(value):
    validate_is_required(value, "email")
    validate_pattern(value, EMAIL_REGEX, error_code_e2002)


def validate_password(
    value, field_name="password", error_message_func=error_code_e2003
):
    validate_is_required(value, field_name)
    validate_pattern(value, PASSWORD_REGEX, error_message_func)


def validate_new_password(value):
    validate_password(
        value, field_name="new-password", error_message_func=error_code_e2013
    )


def validate_confirm_password(password, confirm_password):
    validate_password(
        confirm_password,
        field_name="confirm-password",
        error_message_func=error_code_e2014,
    )
    if password != confirm_password:
        raise ValidationError(error_code_e2010())
    return password


def validate_token(value):
    if not value:
        raise ValidationError(error_code_e1068())

    try:
        decoded_token = jwt.decode(value, config("SECRET_KEY"), algorithms=["HS256"])
        student_id = decoded_token.get("student_id")
        batch_id = decoded_token.get("batch_id")
        student = Student.objects.get(id=student_id)
        batch = Batch.objects.get(id=batch_id)
        student_batch_map = StudentBatchMapping.objects.filter(
            batch=batch, student=student, student_status=StudentBatchMapping.COMPLETED
        ).first()

        if not student_id or not batch_id:
            raise ValidationError(error_code_e1069())

        if not student:
            raise ValidationError(error_code_e1120())
        if not batch:
            raise ValidationError(error_code_e1121())

        if not student_batch_map:
            raise ValidationError(error_code_e1122())

        return student_id

    except jwt.ExpiredSignatureError:
        raise ValidationError(error_code_e1069())
    except jwt.InvalidTokenError:
        raise ValidationError(error_code_e1069())
    except Student.DoesNotExist:
        raise ValidationError(error_code_e1120())
    except Batch.DoesNotExist:
        raise ValidationError(error_code_e1121())
    except StudentBatchMapping.DoesNotExist:
        raise ValidationError(error_code_e1122())


def validate_comment(value):

    if value != None:
        if not isinstance(value, str):
            raise ValidationError(error_code_e1071())
        if len(value) > 1000:
            raise ValidationError(error_code_e1073())
        if len(value) < 3:
            raise ValidationError(error_code_e1072())
        if value[0] == " " or value[-1] == " ":
            raise ValidationError(error_code_e1074())
        return value


def validate_rating(value):
    if not value or value == "" or value == None:
        raise ValidationError(error_code_e1083())
    try:
        rating = int(value)
        if rating < 1 or rating > 5:
            raise ValidationError(error_code_e1085())
        return rating
    except ValueError:
        raise ValidationError(error_code_e1084())


def validate_institution_id(value):

    try:
        value = int(value)
    except ValueError:
        raise ValidationError(error_code_e2027())
