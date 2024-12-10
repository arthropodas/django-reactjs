import csv
from re import match
from django.core.exceptions import ValidationError
from decouple import config
from .models import Student
from .models import Exam
from datetime import datetime
from exam_batch_management.models import Batch
import re

# from rest_framework.exceptions import ValidationError
from institution_management.models import Institution
import pandas as pd
from io import StringIO
from server.utils.messages.error_messages import (
    error_code_e2000,
    error_code_e2001,
    error_code_e2002,
    error_code_e2003,
    error_code_e2016,
    error_code_e2017,
    error_code_e2018,
    error_code_e2019,
    error_code_e2020,
    error_code_e2021,
    error_code_e2022,
    error_code_e2024,
    error_code_e2025,
    error_code_2026,
    error_code_e2027,
    error_code_e2028,
    error_code_e2029,
    error_code_e2030,
    error_code_e2031,
    error_code_e2032,
    error_code_e2034,
    error_code_e2035,
    error_code_e2036,
    error_code_e2037,
    error_code_e2038,
    error_code_e2039,
    error_code_e2040,
    error_code_e2041,
    error_code_e2042,
    error_code_e2090,
    error_code_e2091,
    error_code_e2043,
    error_code_e2101,
    error_code_e2102,
    error_code_e2103,
    error_code_e2104,
    error_code_e2094,
    # error_code_e2105,
    # error_code_e2106,
    # error_code_e2107,
    error_code_e1111,
    error_code_e1113,
    error_code_e1115,
    error_code_e1116,
    error_code_e2300,
    error_code_e2301,
    error_code_e2302,
)
import re

error_messages = {
    "email": error_code_e2000,
    "password": error_code_e2001,
    "name": error_code_e2016,
    "phone_number": error_code_e2018,
    "year_of_passout": error_code_e2020,
    "institution_id": error_code_2026,
    "student_id": error_code_e2030,
    "cgpa": error_code_e2101,
    "noOfBacklogs": error_code_e2102,
    "course": error_code_e2300,
}
domain_pattern = config("DOMAIN_PATTERN")
email_regex = config("EMAIL_REGEX")
password_regex = config("PASSWORD_REGEX")
name_regex = config("NAME_REGEX")
phone_regex = config("PHONE_REGEX")
EMAIL_REGEX = config("EMAIL_REGEX")
PASSWORD_REGEX = rf"{password_regex}$"
NAME_REGEX = "^(?=.*[a-zA-Z])[a-zA-Z\s.]+$"
PHONE_REGEX = rf"{phone_regex}"
CSV_MAX_SIZE_MB = config("CSV_MAX_SIZE_MB")
max_size = int(CSV_MAX_SIZE_MB) * 1024 * 1024
CGPA_REGEX = r"^(10(?:\.00)?|[0-9](?:\.\d{2})?)$"

PAGE_SIZE = int(config("ADMIN_DATA_PER_PAGE_PAGINATION"))

current_year = datetime.now().year

CSV_HEADERS = ["name", "email", "phone", "pass_out_year"]
valid_courses = [
    "BTECH_CSE",
    "BTECH_IT",
    "BE_CSE",
    "BE_IT",
    "BCA",
    "MCA",
    "MCS_CS",
    "BSC_CS",
    "BTECH_AI_DS",
]


def validate_is_required(value, field_name):
    if not value:
        raise ValidationError(error_messages[field_name]())


def validate_name(value):
    print("name", value)
    value = re.sub(
        r"\s+", " ", value.strip()
    )  # Replace multiple spaces with a single space
    print("after stripping value", value)

    validate_is_required(value, "name")

    if len(value) < 2:
        raise ValidationError(error_code_e2040())  # Error for length less than 3
    elif len(value) > 100:
        raise ValidationError(error_code_e2041())  # Error for length greater than 100
    elif not re.match(NAME_REGEX, value):
        raise ValidationError(error_code_e2017())

    return value


def validate_email(value):
    validate_is_required(value, "email")
    if len(value) > 255:
        raise ValidationError(error_code_e2094())
    if not match(EMAIL_REGEX, value):
        raise ValidationError(error_code_e2002())
    email = Student.objects.filter(email=value, status=1).exists()
    if email:
        raise ValidationError(error_code_e2022())


def validate_phone_number(value):
    validate_is_required(value, "phone_number")

    if not match(PHONE_REGEX, value) or not isinstance(value, str):
        raise ValidationError(error_code_e2019())
    return value


def validate_year_of_passout(value):
    validate_is_required(value, "year_of_passout")
    try:
        value = int(value)

        if (
            not isinstance(value, int)
            or value < current_year - 1
            or value > current_year + 1
        ):
            raise ValidationError(error_code_e2021())
    except ValueError:
        raise ValidationError(error_code_e2021())


def validate_exam_id(value):
    if value is None or value == "":
        raise ValidationError(error_code_e2043())
    if not isinstance(value, int) or value < 1:
        raise ValidationError(error_code_e2024())

    exam = Exam.objects.filter(id=value, status=1).first()

    if not exam:
        raise ValidationError(error_code_e2025())

    return exam


def validate_institution_id(value):
    validate_is_required(
        value, "institution_id"
    )  # Ensure the institution ID is provided
    try:
        value = int(value)
        if not isinstance(value, int) or value < 1:
            raise ValidationError(error_code_e2027())

        # Check if the institution with the given ID exists
        institution = Institution.objects.filter(id=value).exists()

        # If the institution does not exist, raise a validation error
        if not institution:
            raise ValidationError(error_code_e2028())
    except ValueError:
        raise ValidationError(error_code_e2031())


def validate_student_id(value):

    validate_is_required(value, "student_id")  # Ensure the student ID is provided
    try:
        pk = int(value)

        student = Student.objects.get(id=pk, status=1)  # Check existence
        if not student:
            raise ValidationError(error_code_e2029())
        return student
    except ValueError:
        raise ValidationError(error_code_e2031())
    except Student.DoesNotExist:
        raise ValidationError(error_code_e2029())


def validate_search_passout_year(value):
    try:
        if value == None:
            return
        elif value:
            value = int(value)
    except ValueError:
        raise ValidationError(error_code_e2021())


def validate_search_institution_id(value):

    try:
        value = int(value)
    except ValueError:
        raise ValidationError(error_code_e2027())


import math


def validate_page_size(value, count):
    try:

        if value:
            value = int(value)
            page_nums = math.ceil(count / PAGE_SIZE)

            if (page_nums) < value:
                raise ValidationError(error_code_e2032())

            return value
    except ValueError:
        raise ValidationError(error_code_e2032())


def validate_email_update(value, pk):
    validate_is_required(value, "email")
    if len(value) > 255:
        raise ValidationError(error_code_e2094())
    if not match(EMAIL_REGEX, value):
        raise ValidationError(error_code_e2002())

    value = Student.objects.exclude(id=pk).filter(email=value, status=1).exists()
    if value:
        raise ValidationError(error_code_e2022())


def validate_pass_out_required(value):
    if value is None or value == "":
        raise ValidationError(error_code_e2020())


def validate_ids(exam_id):
    if exam_id and exam_id.isdigit():
        exam_id = int(exam_id)

    return exam_id


def validate_csv_file(file):

    if file is None or file == "":

        raise ValidationError(error_code_e2042())
    if file.size > max_size:  # Assuming CSV_MAX_SIZE_MB is in megabytes
        raise ValidationError(error_code_e2039(CSV_MAX_SIZE_MB))
    if not file.name.endswith(".csv"):
        raise ValidationError(error_code_e2034())


def validate_institution_id_csv(value):
    validate_is_required(value, "institution_id")

    try:

        value = int(value)
        institution = Institution.objects.filter(id=value, status=1).exists()

        # If the institution does not exist, raise a validation error
        if not institution:
            raise ValidationError(error_code_e2028())
    except ValueError as e:
        raise ValidationError(error_code_e2027())


def validate_exam_id_csv(value):
    try:
        if value is None or value == "":
            raise ValidationError(error_code_e2043())
        value = int(value)
        exam = Exam.objects.filter(id=value, status=1).first()
        if not exam:
            raise ValidationError(error_code_e2025())

        return exam
    except ValueError:
        raise ValidationError(error_code_e2034())


def validate_row_count(count):
    print("count", count)
    if len(count) == 0:
        raise ValidationError(error_code_e2035())


def validate_csv_passout_year(value):
    if value == "":
        raise ValidationError(error_code_e2020())
    try:
        if value:
            value = int(value)

        if value < current_year - 1:
            raise ValidationError(error_code_e2090(current_year))
        if value > current_year + 1:
            raise ValidationError(error_code_e2091(current_year))

    except ValueError:
        raise ValidationError(error_code_e2021())


def validate_cgpa(cgpa):
    if cgpa == "" or cgpa == None:
        raise ValidationError(error_code_e2101())
    # validate_is_required(cgpa, "cgpa")
    try:
        value = float(cgpa)
        if value < 0 or value > 10:
            raise ValidationError(error_code_e2103())
        value = round(value, 2)
        return value
    except ValueError:
        raise ValidationError(error_code_e2103())


def validate_no_of_backlogs(no_of_backlogs):

    validate_is_required(no_of_backlogs, "noOfBacklogs")
    try:
        value = int(no_of_backlogs)
        if value < 0:
            raise ValidationError(error_code_e2104())
        return value
    except ValueError:
        raise ValidationError(error_code_e2104())


def validate_batch_id(value):
    if not value:
        raise ValidationError(error_code_e1113())

    batch = Batch.objects.filter(uuid=value, status=1, batch_status=1).first()

    if not batch:
        raise ValidationError(error_code_e1111())
    pass


def validate_batch(value):
    if not value or value == None:
        raise ValidationError(error_code_e1115())
    try:
        pk = int(value)
        batch = Batch.objects.filter(id=pk, status=1, batch_status=1).first()
        if batch:
            return batch
        else:
            raise ValidationError(error_code_e1111())
    except ValueError:
        raise ValidationError(error_code_e1116())
    except Exception:
        raise ValidationError(error_code_e1111())


def validate_email_verification(value):
    validate_is_required(value, "email")
    if not match(EMAIL_REGEX, value):
        raise ValidationError(error_code_e2002())


def validate_batch_id_response(value):
    if not value or value == None:
        raise ValidationError(error_code_e1113())
    print("value", value)
    batch = Batch.objects.filter(id=value, status=1).first()
    if batch:
        return batch
    else:
        raise ValidationError(error_code_e1111())


def validate_course(id):
    validate_is_required(id, "course")
    if not isinstance(id, int):
        raise ValidationError(error_code_e2301())
    if id < 0 or id > 9:
        raise ValidationError(error_code_e2301())


# def validate_course_csv(id):
#     validate_is_required(id,"course")
#     try:
#         id = int(id)
#         if not isinstance(id, int):
#             raise ValidationError(error_code_e2301())
#         if id < 0 or id >9:
#             raise ValidationError(error_code_e2301())
#     except ValueError:
#         raise ValidationError(error_code_e2301())


def validate_course_csv(value):
    validate_is_required(value, "course")

    if value not in valid_courses:
        raise ValidationError(error_code_e2302())
    return value
