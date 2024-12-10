from django.core.exceptions import ValidationError
from exam_batch_management.models import StudentBatchMapping
from student_management.models import Student
from exam_management.models import Exam
from server import settings
import pytz
from datetime import timedelta
from django.utils import timezone
from datetime import datetime
from questionnaire_management.models import QuestionnaireQuestions
from question_management.models import Options
from server.utils.messages.error_messages import (
    error_code_e2043,
    error_code_e2024,
    error_code_e2030,
    error_code_e2031,
    error_code_e2070,
    error_code_e2071,
    error_code_e2073,
    error_code_e2075,
    error_code_e2076,
    error_code_e2077,
    error_code_e2078,
    error_code_e2049,
    error_code_e2080,
    error_code_e1079,
    error_code_e1080,
    error_code_e2092,
    error_code_e1102,
    error_code_e1103,
    error_code_e2241,
    error_code_e2029,
    error_code_e2242,
    error_code_e2243,
    error_code_e2244,
    error_code_e2245,
    error_code_e2246,
    error_code_e2247,
    error_code_e2248,
    error_code_e2249,
    error_code_e2250,
    error_code_e2093,
    error_code_e2252,
    error_code_e2253,
    error_code_e2254,
    error_code_e2255
)


def validate_question_id(questinnaire_id, question_id):
    if question_id is None or question_id == "":
        raise ValidationError(error_code_e2070())
    if not isinstance(question_id, int):
        raise ValidationError(error_code_e2071())
    try:
        QuestionnaireQuestions.objects.get(
            questionnaire=questinnaire_id, question=question_id
        )
    except QuestionnaireQuestions.DoesNotExist:
        raise ValidationError(error_code_e2076())


def validate_student_input(student_input, question_id):
    if student_input is None or student_input == "":
        raise ValidationError(error_code_e2078(question_id))
    if not isinstance(student_input, list):
        raise ValidationError(error_code_e2077(question_id))
    for input in student_input:
        if not isinstance(input, int):
            raise ValidationError(error_code_e2252(question_id))
        option = (
            Options.objects.filter(
                id=input, question_id_id=question_id, is_correct=1
            ).count()
            + Options.objects.filter(
                id=input, question_id_id=question_id, is_correct=0
            ).count()
        )
        if option == 0:
            raise ValidationError(error_code_e2253(question_id))




def validate_minimum_mark(value):
    if value == None or value == "" or value == " ":
        raise ValidationError(error_code_e1079())
    try:
        float(value)
    except ValueError:
        raise ValidationError(error_code_e1080())
    if float(value) <= 0 or value[0] == " " or value[-1] == " ":
        raise ValidationError(error_code_e1079())


####################################

# def validate_student_exam_ids(student_id, exam_id):


#     try:
#         student= Student.objects.get(id=student_id , status = True)
#         response =StudentBatchMapping.objects.get(student_id=student_id, exam_id=exam_id)
#         exam = Exam.objects.get(id=exam_id, status =True)
#         return response, exam
#     except StudentBatchMapping.DoesNotExist:
#         raise ValidationError(error_code_e2241())
#     except Student.DoesNotExist:
#         raise ValidationError(error_code_e2029())


def validate_exam_status(exam):
    if exam.status_of_exam < 1:
        raise ValidationError(error_code_e2073())
    if exam.status_of_exam == 2:
        raise ValidationError(error_code_e2242())
    if exam.status_of_exam == 3:
        raise ValidationError(error_code_e2243())


def validate_batch_student(response):
    print("tesponse", response)
    if response.student_status < 1:
        raise ValidationError(error_code_e2244())
    if response.student_status == 2:
        raise ValidationError(error_code_e2245())
    if response.student_status == 3:
        raise ValidationError(error_code_e2246())
    if response.student_status == 4:
        raise ValidationError(error_code_e2247())
    if response.student_status == 6:
        raise ValidationError(error_code_e2255())

def validate_action(action, student_responses):
    if action is None or action == "":
        raise ValidationError(error_code_e2248())
    if action not in ["terminate", "submit"]:
        raise ValidationError(error_code_e2249())
    if action == "terminate" and student_responses:
        raise ValidationError(error_code_e2254())


def validate_response_array(response):
    
    if not isinstance(response, list):
        raise ValidationError(error_code_e2250())


####################################

from server.utils.messages.error_messages import (
    error_code_e3800,
    error_code_e3801,
    error_code_e3802,
    error_code_e3803,
    error_code_e4020,
    error_code_e4021,
    error_code_e4022,
)
from django.core.exceptions import ValidationError


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


def validate_institute_id(institute_id):

    if institute_id is None:
        raise ValidationError(error_code_e4020())
    if institute_id == "":
        raise ValidationError(error_code_e4021())
    if isinstance(institute_id, str):
        raise ValidationError(error_code_e4022())
