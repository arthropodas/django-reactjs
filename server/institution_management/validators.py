import re
from django.core.exceptions import ValidationError
from decouple import config
from .models import Institution
from server.utils.messages.error_messages import (
    error_code_e1011,
    error_code_e1012,
    error_code_e1013,
    error_code_e1014,
    error_code_e1019,
    error_code_e1015,
    error_code_e1016,
    error_code_e1017,
    error_code_e1018,
    error_code_e1020,
    error_code_e1021,
    error_code_e1036,
    error_code_e1037,
    error_code_e1038,
    error_code_e1039,
    error_code_e1058,
    error_code_e1087,
    error_code_e1088,
    error_code_e1089,
    error_code_e1090,
    error_code_e1091,
    error_code_e1092,
    error_code_e1093,
    error_code_e1094,
    error_code_e1095,
    error_code_e1096,
    error_code_e4804,
)


domain_pattern = config("DOMAIN_PATTERN")
email_regex = config("EMAIL_REGEX")
phone_regex = config("PHONE_REGEX")
EMAIL_REGEX = config("EMAIL_REGEX")
PHONE_REGEX = rf"{phone_regex}"
NAME_REGEX = "^(?=.*[a-zA-Z]).*$"
INSTITUTION_CODE_REGEX = config("INSTITUTION_CODE_REGEX")


def validate_institution_name(value):
    if not value or value == "":
        raise ValidationError(error_code_e1011())

    if not isinstance(value, str):
        raise ValidationError(error_code_e1014())
    if not re.match(NAME_REGEX, value):
        raise ValidationError(error_code_e1014())

    if len(value) < 3:
        raise ValidationError(error_code_e1013())

    if len(value) > 100:
        raise ValidationError(error_code_e1012())

    if value[0] == " " or value[-1] == " ":
        raise ValidationError(error_code_e1019())

    return value


def validate_institution_code(value):

    if not value or value == "":
        raise ValidationError(error_code_e1015())

    if not isinstance(value, str):
        raise ValidationError(error_code_e1018())

    if len(value) < 3:
        raise ValidationError(error_code_e1016())

    if len(value) > 10:
        raise ValidationError(error_code_e1017())

    if value[0] == " " or value[-1] == " ":
        raise ValidationError(error_code_e1020())

    if isinstance(value, str) and not re.match(INSTITUTION_CODE_REGEX, value):
        raise ValidationError(error_code_e4804())

    return value


def validate_institution_email(value):
    if not value or value == "":
        raise ValidationError(error_code_e1038())
    if not re.match(EMAIL_REGEX, value):
        raise ValidationError(error_code_e1036())


def validate_institution_phone(value):
    if not value or value == "":
        raise ValidationError(error_code_e1039())
    if not re.match(PHONE_REGEX, value):
        raise ValidationError(error_code_e1058())


def validate_unique_code(value):
    institution = Institution.objects.filter(institution_code=value, status=True)
    if institution.count() > 0:
        raise ValidationError(error_code_e1021())
    return value


def validate_unique_email(value):
    institution = Institution.objects.filter(institution_email=value, status=True)
    if institution.count() > 0:
        raise ValidationError(error_code_e1037())
    return value


# def validate_coordinator_name(value):
#     if not value or value == "":
#         raise ValidationError(error_code_e1087())
#     if not isinstance(value, str):
#         raise ValidationError(error_code_e1088())
#     if len(value) < 3:
#         raise ValidationError(error_code_e1089())
#     if len(value) > 100:
#         raise ValidationError(error_code_e1090())
#     if value[0] == " " or value[-1] == " ":
#         raise ValidationError(error_code_e1091())


# def validate_coordinator_email(value):
#     if not value or value == "":
#         raise ValidationError(error_code_e1092())
#     if not re.match(EMAIL_REGEX, value):
#         raise ValidationError(error_code_e1093())


# def validate_coordinator_phone(value):
#     if not value or value == "":
#         raise ValidationError(error_code_e1094())
#     if not re.match(PHONE_REGEX, value):
#         raise ValidationError(error_code_e1095())


# def validate_unique_validate_coordinator_email(value):
#     institution = Institution.objects.filter(coordinator_email=value, status=True)
#     if institution.count() > 0:
#         raise ValidationError(error_code_e1096())
#     return value
