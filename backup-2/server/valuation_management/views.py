from django.conf import settings
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import ast
from datetime import datetime
from rest_framework.exceptions import ParseError
from django.core.exceptions import ValidationError
from exam_batch_management.models import StudentBatchMapping
from jwt.exceptions import InvalidTokenError
import jwt
from django.db.models import Sum
from .validators import (
    validate_question_id,
    validate_student_input,
    validate_batch_student,
    validate_action,
    validate_response_array,
    validate_minimum_mark,
    validate_exam_status,
)
from questionnaire_management.models import QuestionnaireQuestions
from exam_management.models import Exam
from question_category_management.models import QuestionCategory
from question_management.models import QuestionData, Options
from server.utils.util_functions.functions import remove_square_brackets
from .models import QuestionCategoryResponse
from server.utils.messages.error_messages import (
    error_code_e2025,
    error_code_e2029,
    error_code_e3008,
    error_code_e2072,
    error_code_e1010,
    error_code_e1055,
    error_code_e1077,
    error_code_e2079,
    error_code_e406,
    error_code_e2082,
    error_code_e1081,
    error_code_e2093,
    error_code_e2241,
    error_code_e2076,
    error_code_e408,
)
from .models import StudentsResponse
from student_management.models import Student
from django.db import transaction
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from server.utils.permissions.permission import CustomIsAuthenticated
from server.utils.decorators.token_decode import decode_token_from_query_params

from django.db import transaction
import logging

logger = logging.getLogger("api_logger")  # Match this with your logger name in settings


class ExamValuation(APIView):
    @decode_token_from_query_params
    def post(self, request):
        try:
            decoded_token = request.decoded_token
            response = decoded_token.get("response")
            exam = decoded_token.get("exam")
            print("request body....................", request.data)

            # logger.info("Starting exam valuation for exam. Response: " + str(response) + "student name"+str(response.student.name))

            validate_exam_status(exam)
            validate_batch_student(response)

            action = request.data.get("action")
            student_response = request.data.get("response")
            validate_action(action, student_response)

            if action == "terminate":
                response.student_status = 3
                response.save()
                logger.info("Student marked as terminated.")
                return Response(
                    {"message": "Student marked as terminated"},
                    status=status.HTTP_200_OK,
                )

            validate_response_array(student_response)

            questionnaire_id = exam.questionnaire_id
            category_response_summary = {}
            bulk_student_responses = []
            total_correct_answers = 0
            question_data = self.fetch_questions_data(
                student_response, questionnaire_id
            )

            with transaction.atomic():
                response.student_status = 6
                response.save()
                for response_data in student_response:
                    question_id = response_data.get("questionId")
                    student_inputs = response_data.get("studentInput", [])

                    validate_question_id(questionnaire_id, question_id)
                    validate_student_input(student_inputs, question_id)

                    question = question_data[question_id]["question"]
                    correct_answer_list = question_data[question_id]["correct_answers"]

                    # Prepare student responses for bulk creation
                    bulk_student_responses.extend(
                        [
                            StudentsResponse(
                                response_id=response.id,
                                question_id=question_id,
                                student_input=input_value,
                            )
                            for input_value in student_inputs
                        ]
                    )

                    question_category_id = question.question_category_id.id
                    difficulty_level = question.question_difficulty_level
                    key = (question_category_id, difficulty_level)

                    # Update the summary
                    if key not in category_response_summary:
                        category_response_summary[key] = {
                            "category": question.question_category_id,
                            "difficulty_level": difficulty_level,
                            "correct_answer_count": 0,
                        }

                    # Check for correct answers
                    if sorted(correct_answer_list) == sorted(student_inputs):
                        category_response_summary[key]["correct_answer_count"] += 1
                        total_correct_answers += 1

                # Bulk create student responses
                StudentsResponse.objects.bulk_create(bulk_student_responses)
                logger.info("Successfully bulk created student responses.")

                # Bulk create category responses
                self.save_category_responses(category_response_summary, response)

            # Final updates to the response
                response.student_status = 2
                response.correct_count = total_correct_answers
                response.exam_end_time = datetime.now()
                response.save()

            # logger.info(
            #     f"Valuation completed successfully. Total correct answers : ",
            #     total_correct_answers ," Response : ", str(response), "student name : ", str(response.student.name)
            # )
            return Response(
                {"message": "Valuation completed successfully"},
                status=status.HTTP_200_OK,
            )
        except QuestionnaireQuestions.DoesNotExist:
            logger.error("QuestionnaireQuestions.DoesNotExist exception raised.")
            return Response(error_code_e2076(), status=status.HTTP_400_BAD_REQUEST)
        except StudentBatchMapping.DoesNotExist:
            logger.error("StudentBatchMapping.DoesNotExist exception raised.")
            return Response(error_code_e2241(), status=status.HTTP_400_BAD_REQUEST)
        except Exam.DoesNotExist:
            logger.error("Exam.DoesNotExist exception raised.")
            return Response(error_code_e2025(), status=status.HTTP_400_BAD_REQUEST)

        except Student.DoesNotExist:
            logger.error("Student.DoesNotExist exception raised.")
            return Response(error_code_e2029(), status=status.HTTP_400_BAD_REQUEST)
        except QuestionData.DoesNotExist:
            return Response(error_code_e3008(), status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except InvalidTokenError as e:
            logger.error("InvalidTokenError: %s", str(e))
            return Response(error_code_e406(), status=status.HTTP_400_BAD_REQUEST)
        except ParseError:
            return Response(error_code_e408(), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception("An unexpected error occurred: %s", str(e))
            return Response(error_code_e2082(), status=status.HTTP_400_BAD_REQUEST)

    def fetch_questions_data(self, student_response, questionnaire_id):
        question_ids = {data.get("questionId") for data in student_response}

        # Fetch all questions at once
        question_questionnaires = QuestionnaireQuestions.objects.filter(
            question_id__in=question_ids, questionnaire_id=questionnaire_id
        )

        question_map = {}
        for question_questionnaire in question_questionnaires:
            question = QuestionData.objects.get(id=question_questionnaire.question_id)
            correct_answers = get_correct_answers_for_question(question.id)
            question_map[question.id] = {
                "question": question,
                "correct_answers": [obj.id for obj in correct_answers],
            }

        return question_map

    def save_category_responses(self, category_response_summary, response):
        bulk_create_list = [
            QuestionCategoryResponse(
                response=response,
                category=summary["category"],
                question_difficulty_level=summary["difficulty_level"],
                correct_answer_count=summary["correct_answer_count"],
            )
            for summary in category_response_summary.values()
        ]
        QuestionCategoryResponse.objects.bulk_create(bulk_create_list)


def get_correct_answers_for_question(question_id):
    # Retrieve the question object
    question = QuestionData.objects.get(id=question_id)
    correct_answers = Options.objects.filter(
        question_id_id=question.id, status=1, is_correct=1
    )

    if not correct_answers:
        raise ValidationError(f"No correct answers found for question {question_id}")

    return correct_answers


# ----------------Shortlist---------------#


# class FetchShortListedCandidates(APIView):
#     authentication_classes = (CustomIsAuthenticated,)

#     def get(self, request, pk):
#         try:
#             exam = Exam.objects.get(id=pk)
#             if exam.status_of_exam == Exam.COMPLETED:
#                 min_marks = request.query_params.get("marks", None)
#                 completed_students = ExamStudents.objects.filter(
#                     status_exam_student=ExamStudents.COMPLETED, exam_id=pk
#                 )

#                 if min_marks:
#                     validate_minimum_mark(min_marks)
#                     completed_students = completed_students.filter(
#                         student_id__marksofstudents__mark__gte=min_marks
#                     )

#                     exam.cut_of_mark = min_marks
#                     exam.save()

#                 completed_students = (
#                     completed_students.select_related("student_id__institution")
#                     .prefetch_related("student_id")
#                     .values(
#                         "student_id__id",
#                         "student_id__name",
#                         "student_id__email",
#                         "student_id__phone",
#                         "student_id__pass_out_year",
#                         "student_id__institution",
#                         "student_id__institution__institution_name",
#                         "student_id__institution__institution_code",
#                         "student_id__institution__institution_email",
#                         "student_id__institution__institution_phone",
#                         "student_id__examstudents__is_shortlisted",
#                         "student_id__marksofstudents__mark",
#                     )
#                 )

#                 paginator = PageNumberPagination()
#                 paginated_data = paginator.paginate_queryset(
#                     completed_students, request
#                 )

#                 return paginator.get_paginated_response(paginated_data)

#             else:
#                 return Response(error_code_e1081(), status=status.HTTP_400_BAD_REQUEST)
#         except ValidationError as e:
#             return Response(
#                 remove_square_brackets(e.message_dict),
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         except MarksOfStudents.DoesNotExist:
#             return Response(error_code_e1077(), status=status.HTTP_400_BAD_REQUEST)

#         except Exam.DoesNotExist:
#             return Response(error_code_e1055(), status=status.HTTP_400_BAD_REQUEST)

#         except Exception:
#             return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


#######################################################

# Email send view for students and institution
