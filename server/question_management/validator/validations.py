from rest_framework.exceptions import ValidationError
import json
from question_category_management.models import QuestionCategory
from server.utils.messages.error_messages import (
    error_code_e3000,
    error_code_e3001,
    error_code_e3002,
    error_code_e3003,
    error_code_e3004,
    error_code_e3010,
    error_code_e3100,
    error_code_e3101,
    error_code_e3102,
    error_code_e3104,
    error_code_e3200,
    error_code_e3201,
    error_code_e3202,
    error_code_e3203,
    error_code_e3204,
    error_code_e3205,
    error_code_e3206,
    error_code_e3207,
    error_code_e3208,
    error_code_e3300,
    error_code_e3301,
    error_code_e3302,
    error_code_e3303,
    error_code_e3304,
    error_code_e3305,
    error_code_e3400,
    error_code_e3401,
    error_code_e3500,
    error_code_e3501,
    error_code_e3502,
    error_code_e3503,
    error_code_e3504,
    error_code_e4100,
    error_code_e4101,
    error_code_e4102,
    error_code_e4103,
    error_code_e4104,
    error_code_e4200,
    error_code_e4201,
    error_code_e4202,
    error_code_e4203,
    error_code_e4212,
    error_code_e4213,
)
import re


def validate_input_question(question):

    if question is None:
        raise ValidationError(error_code_e3000())

    if question.strip() == "":
        raise ValidationError(error_code_e3001())

    if question != question.strip():
        raise ValidationError(error_code_e3002())

    if len(question) < 10:
        raise ValidationError(error_code_e3003())

    if len(question) > 1000:
        raise ValidationError(error_code_e3004())

    return question


def validate_question_type(question_type):
    if question_type is None:

        raise ValidationError(error_code_e3500())

    if question_type.strip() == "":
        raise ValidationError(error_code_e3501())

    if isinstance(question_type, str):

        if question_type.isdigit():

            question_type = int(question_type)

            if question_type not in [1, 2]:
                raise ValidationError(error_code_e3503())

            return question_type

        else:
            raise ValidationError(error_code_e3502())


def validate_question_category(category):

    if category is None:
        raise ValidationError(error_code_e3100())

    if category.strip() == "":
        raise ValidationError(error_code_e3101())


def validate_question_category_type(category_id):

    if isinstance(category_id, str):

        if category_id.isdigit():

            category_id = int(category_id)

            return category_id

        else:
            raise ValidationError(error_code_e3102())


def validate_options(options, question_type):

    if options is None:
        raise ValidationError(error_code_e3200())

    if options.strip() == "":
        raise ValidationError(error_code_e3201())

    validate_option_type(options)

    options = json.loads(options)

    if len(options) == 0:
        raise ValidationError(error_code_e3206())

    if question_type == 1 and len(options) != 2:
        raise ValidationError(error_code_e3207())

    if question_type == 2 and len(options) < 4:
        raise ValidationError(error_code_e3202())

    if len(options) != 3 and question_type == 0:
        raise ValidationError(error_code_e3202())

    validate_options_size(options)

    validate_option_duplicates(options)


def validate_option_type(options):
    if isinstance(options, str):
        try:
            parsed_options = json.loads(options)
            for item in parsed_options:
                if not isinstance(item, (str, int)):
                    raise ValidationError(
                        "Each item in the list must be either a string or a number."
                    )

        except json.JSONDecodeError:
            raise ValidationError(error_code_e3205())


def validate_multiple_answer_option_question(question_type, options, correct_answer):

    options = json.loads(options)
    correct_answer = json.loads(correct_answer)

    invlaid_answer = []

    for answer in correct_answer:
        if answer not in options:
            invlaid_answer.append(answer)

    if invlaid_answer:
        raise ValidationError(error_code_e3208(invlaid_answer))

    if question_type == 2 and len(options) < 4:
        raise ValidationError(error_code_e3202())


def validate_options_size(options):

    invalid_options = []
    for option in options:
        if isinstance(option, str) and len(option) > 1000:
            invalid_options.append(option)

    if invalid_options:
        raise ValidationError(error_code_e3203(invalid_options))


def validate_option_duplicates(options):

    if len(options) != len(set(options)):
        raise ValidationError(error_code_e3204())


def validate_correct_answer(correct_answer, question_type):

    if correct_answer is None:
        raise ValidationError(error_code_e3300())

    if correct_answer.strip() == "":
        raise ValidationError(error_code_e3301())

    if isinstance(correct_answer, str):
        try:
            parsed_options = json.loads(correct_answer)
            for item in parsed_options:
                if not isinstance(item, (str, int)):
                    raise ValidationError(
                        "Each item in the list must be either a string or a number."
                    )

        except json.JSONDecodeError:
            raise ValidationError(error_code_e3303())

    correct_answer = json.loads(correct_answer)

    validate_correct_answer_size(correct_answer)

    if len(correct_answer) < 1:
        raise ValidationError(error_code_e3304())

    if len(correct_answer) != len(set(correct_answer)):
        raise ValidationError(error_code_e3504())
    if question_type == 1 and len(correct_answer) != 1:
        raise ValidationError(error_code_e3305())

    validate_question_type_answer_length(question_type, correct_answer)


def validate_question_type_answer_length(question_type, correct_answer):
    if question_type in [0, 1] and len(correct_answer) > 1:

        raise ValidationError(error_code_e3503())


def validate_correct_answer_size(correct_answer):

    invalid_answers = []

    for answer in correct_answer:
        if isinstance(answer, str) and len(answer) > 1000:
            invalid_answers.append(answer)

    if invalid_answers:
        raise ValidationError(error_code_e3302(invalid_answers))


def validate_question_image(question_image):

    allowed_content_types = ["jpeg", "jpg", "png"]

    if question_image.content_type.split("/")[1].lower() not in allowed_content_types:
        raise ValidationError(error_code_e3400())

    max_file_size = 2 * 1024 * 1024

    if question_image.size > max_file_size:
        raise ValidationError(error_code_e3401())

    return None


def validate_question_difficulty_level(difficulty_level):

    if difficulty_level is None:
        raise ValidationError(error_code_e4100())

    if difficulty_level.strip() == "":
        raise ValidationError(error_code_e4101())

    if isinstance(difficulty_level, str):

        if difficulty_level.isdigit():

            difficulty_level = int(difficulty_level)

            if difficulty_level not in [1, 2, 3]:
                raise ValidationError(error_code_e4102())

            return difficulty_level

        else:
            raise ValidationError(error_code_e4103())


from decouple import config


def validate_csv_file(csv_file):

    CSV_MAX_SIZE_MB = config("CSV_MAX_SIZE_MB")
    max_size = int(CSV_MAX_SIZE_MB) * 1024 * 1024

    if csv_file is None:
        raise ValidationError(error_code_e4200())

    if not csv_file.name.endswith(".csv"):
        raise ValidationError(error_code_e4201())

    if csv_file.size > max_size:
        raise ValidationError(error_code_e4202())


def validate_csv_headers(headers):

    expected_headers = [
        "Question",
        "Question_type",
        "Category",
        "Difficulty_level",
        "Option_1",
        "Option_2",
        "Option_3",
        "Option_4",
        "Answer_1",
        "Answer_2",
        "Answer_3",
        "Answer_4",
    ]

    invalid_headers = [header for header in headers if header not in expected_headers]

    missing_headers = [header for header in expected_headers if header not in headers]

    error_messages = {
        "invalid_headers": ", ".join(invalid_headers) if invalid_headers else "",
        "missing_headers": ", ".join(missing_headers) if missing_headers else "",
    }

    if invalid_headers or missing_headers:
        raise ValidationError(error_code_e4203(error_messages))


import csv


def extract_csv_content(csv_file):
    try:
        csv_text = csv_file.read().decode("utf-8-sig").splitlines()
    except UnicodeDecodeError as e:
        raise UnicodeDecodeError(
            "utf-8",
            e.object,
            e.start,
            e.end,
            "Invalid CSV file encoding. Only UTF-8 is supported.",
        )

    reader = csv.reader(csv_text)
    headers = next(reader, None)
    data = [row for row in reader]

    return data, headers


def validate_question_type_field(question_type):
    if not question_type:
        raise ValidationError(error_code_e3501())

    question_type_mapping = {
        "true/false": 1,
        "multiple answer": 2,
    }

    question_type = question_type.lower()

    if question_type not in question_type_mapping:
        raise ValidationError(error_code_e3104(question_type, question_type_mapping))

    return question_type_mapping[question_type]


# validate question difficulty level


def validate_difficulty_level(difficulty_level):
    if not difficulty_level:
        raise ValidationError(error_code_e4101())

    difficulty_level_mapping = {
        "easy": 1,
        "medium": 2,
        "hard": 3,
    }
    difficulty_level = difficulty_level.lower()

    if difficulty_level not in difficulty_level_mapping:

        raise ValidationError(
            error_code_e4104(difficulty_level, difficulty_level_mapping)
        )

    return difficulty_level_mapping[difficulty_level]


def validate_duplicate_question(question, seen_questions):
    if question == None:
        return
    if question in seen_questions:
        raise ValidationError(error_code_e3010(question))
    else:
        seen_questions.append(question)


def validate_questionanire(questionnaire):
    if questionnaire == "":
        raise ValidationError(error_code_e4212())

    if len(questionnaire) > 200:
        raise ValidationError(error_code_e4213())
