import re
from datetime import datetime, time
from django.utils.dateparse import parse_time
import pytz
from server.utils.messages.error_messages import (
    error_code_e1029,
    error_code_e1030,
    error_code_e1031,
    error_code_e1032,
    error_code_e1033,
    error_code_e1040,
    error_code_e1034,
    error_code_e1041,
    error_code_e1042,
    error_code_e1045,
    error_code_e1046,
    error_code_e1050,
    error_code_e2024,
    error_code_e2025,
    error_code_e2043,
    error_code_e1060,
    error_code_e1061,
    error_code_e2045,
    error_code_e4300,
    error_code_e4301,
    error_code_e4302,
    error_code_e4306,
    error_code_e4400,
    error_code_e4401,
    error_code_e4402,
    error_code_e2073,
    error_code_e2242,
    error_code_e2243,
    error_code_e2245,
    error_code_e2246,
    error_code_e2247,
    error_code_e4705,
    error_code_e4706,
    error_code_e4708,
    error_code_e4709,
    error_code_e4711,
    error_code_e4714,
    error_code_e4716,
    error_code_e4717,
    error_code_e2226
)
from django.core.exceptions import ValidationError
from decouple import config
from .models import Exam


exam_date_regex = config("EXAM_DATE_REGEX")
exam_time_regex = config("EXAM_TIME_REGEX")
EXAM_DATE_REGEX = rf"{exam_date_regex}"
EXAM_TIME_REGEX = rf"{exam_time_regex}"
EXAM_NAME_REGEX = r"^(?=.*[a-zA-Z]).*$"


def validate_exam_name(value):

    if not value or value == "":
        raise ValidationError(error_code_e1029())

    if not isinstance(value, str):
        raise ValidationError(error_code_e1030())

    if not re.match(EXAM_NAME_REGEX, value):
        raise ValidationError(error_code_e1030())

    if len(value) < 3:
        raise ValidationError(error_code_e1031())

    if len(value) > 100:
        raise ValidationError(error_code_e1032())

    if value[0] == " " or value[-1] == " ":
        raise ValidationError(error_code_e1033())


def validate_exam_date(value):
    if not value or value == "":
        raise ValidationError(error_code_e1040())

    if not isinstance(value, str):
        raise ValidationError(error_code_e4705())

    if not re.match(EXAM_DATE_REGEX, value):
        raise ValidationError(error_code_e1034())

    year = int(value[:4])

    current_year = datetime.now().year

    if year < current_year:
        raise ValidationError(error_code_e1050())

    return value


def validate_exam_time(value):
    if not value or value == "":
        raise ValidationError(error_code_e1041())

    if not isinstance(value, str):
        raise ValidationError(error_code_e4706())

    if not re.match(EXAM_TIME_REGEX, value):
        raise ValidationError(error_code_e1042())

    return value


def validate_exam_duration(value):
    if not value or value == "":
        raise ValidationError(error_code_e1045())
    if not isinstance(value, int):
        raise ValidationError(error_code_e1046())
    return value


def validate_exam_id(value):

    if not value or value == "":
        raise ValidationError(error_code_e2043())
    exam = None
    if value:
        if not isinstance(value, int) or value < 1:
            raise ValidationError(error_code_e2024())
        exam = Exam.objects.filter(id=value, status=1).first()
        print("exam", exam)
        if not exam:
            raise ValidationError(error_code_e2025())
    if exam.question_paper_set:
        raise ValidationError(error_code_e2045())
    return exam


def validate_status_of_exam(value):
    """Validates the status of the exam."""
    if not value or value == None or value == "":
        raise ValidationError(error_code_e1060())

    if not isinstance(value, int):
        raise ValidationError(error_code_e4711())

    if value not in [0, 1, 2, 3]:
        raise ValidationError(error_code_e1061())

    return value


########################################################################
# Student Exam Mappping Validations


import json
from server.utils.messages.error_messages import (
    error_code_e3700,
    error_code_e3701,
    error_code_e3702,
    error_code_e3800,
    error_code_e3801,
    error_code_e3802,
    error_code_e3803,
)


def validate_exam_id_field(exam_id):

    if exam_id is None:
        raise ValidationError(error_code_e3700())
    if exam_id == "":
        raise ValidationError(error_code_e3701())
    if isinstance(exam_id, str):
        raise ValidationError(error_code_e3702())


def validate_student_id(student_id):

    if student_id is None:
        raise ValidationError(error_code_e3800())

    if student_id == "":
        raise ValidationError(error_code_e3801())

    if not isinstance(student_id, list):
        raise ValidationError(error_code_e3802())

    if isinstance(student_id, list):
        for id in student_id:
            if not isinstance(id, int):
                raise ValidationError(error_code_e3803())


def validate_exam_location(exam_location):
    if exam_location is None:
        raise ValidationError(error_code_e4300())

    if exam_location == "":
        raise ValidationError(error_code_e4301())

    if len(exam_location) > 100:
        raise ValidationError(error_code_e4302())

    if len(exam_location) < 4:
        raise ValidationError(error_code_e4708())

    if exam_location != exam_location.strip():
        raise ValidationError(error_code_e4709())

    if not re.match(EXAM_NAME_REGEX, exam_location):
        raise ValidationError(error_code_e4306())


def validate_questionnaire_id(questionnaire_id):
    if questionnaire_id is None:
        raise ValidationError(error_code_e4400())

    if questionnaire_id == "":
        raise ValidationError(error_code_e4401())

    if not isinstance(questionnaire_id, int):
        raise ValidationError(error_code_e4402())


def validate_exam_status(exam):
    if exam.status_of_exam < 1:
        raise ValidationError(error_code_e2073())
    if exam.status_of_exam == 2:
        raise ValidationError(error_code_e2242())
    if exam.status_of_exam == 3:
        raise ValidationError(error_code_e2243())


def validate_batch_student(response):
    if response.student_status == 2:
        raise ValidationError(error_code_e2245())
    if response.student_status == 3:
        raise ValidationError(error_code_e2246())
    if response.student_status == 4:
        raise ValidationError(error_code_e2247())


def validate_year(year):
    if len(year) != 4:
        raise ValidationError(error_code_e4714())
    if isinstance(year, str) and not year.isdigit():
        raise ValidationError(error_code_e4714())


def validate_is_pool(is_pool):

    if is_pool is None:
        raise ValidationError(error_code_e4716())

    if not isinstance(is_pool, bool):
        raise ValidationError(error_code_e4717())

def validate_questionnaire_list(questionnaire_id):
    if isinstance(questionnaire_id, str) and not questionnaire_id.isdigit():
        raise ValidationError(error_code_e2226())