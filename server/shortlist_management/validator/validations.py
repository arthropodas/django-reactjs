from rest_framework.exceptions import ValidationError
from server.utils.messages.error_messages import (
    error_code_e3100,
    error_code_e3102,
    error_code_e3105,
    error_code_e3106,
    error_code_e4100,
    error_code_e4102,
    error_code_e4103,
    error_code_e4603,
    error_code_e4604,
    error_code_e4605,
    error_code_e4606,
    error_code_e4700,
    error_code_e4701,
    error_code_e4715,
)


def validate_categories(categories):

    if not isinstance(categories, list):
        raise ValidationError(error_code_e3105())

    if len(categories) == 0:
        raise ValidationError(error_code_e3106())

    errors = {"errorCode": "e2050", "errorMsg": {"errors": {}}}

    validate_category_values(categories, errors)


def validate_category_values(categories, errors):
    for index, category in enumerate(categories):
        field_errors = {}

        if "category_id" not in category:
            field_errors["category_id"] = error_code_e3100()
        elif not isinstance(category["category_id"], int):
            field_errors["category_id"] = error_code_e3102()

        if "cut_off" not in category:
            field_errors["cut_off"] = error_code_e4700()
        elif not isinstance(category["cut_off"], int):
            field_errors["cut_off"] = error_code_e4701()

        if "question_level" not in category:
            field_errors["question_level"] = error_code_e4100()
        elif not isinstance(category["question_level"], int):
            field_errors["question_level"] = error_code_e4103()
        elif category["question_level"] not in [1, 2, 3]:
            field_errors["question_level"] = error_code_e4102()
        if field_errors:
            errors["errorMsg"]["errors"][index] = field_errors

    if errors["errorMsg"]["errors"]:
        raise ValidationError(errors)


def validate_category_ids(category_ids, categories):
    wrong_ids = []

    print(category_ids, categories)

    for category in categories:
        category_id = category["category_id"]
        if category_id not in category_ids and category_id not in wrong_ids:
            wrong_ids.append(category_id)

    if wrong_ids:
        raise ValidationError(error_code_e4715(wrong_ids))


def validate_action_value(action_value):
    if action_value is None:
        raise ValidationError(error_code_e4605())
    if action_value == "":
        raise ValidationError(error_code_e4606())
    if not isinstance(action_value, int):
        raise ValidationError(error_code_e4604())
    if action_value not in [0, 1]:
        raise ValidationError(error_code_e4603())


def validate_cut_off(cut_off_mark):
    if not isinstance(cut_off_mark, int):
        raise ValidationError(error_code_e4701())
