from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from django.db.models import Prefetch
from datetime import datetime
from rest_framework.response import Response
from server.utils.util_functions.functions import remove_square_brackets
from rest_framework.pagination import PageNumberPagination
from server.utils.permissions.permission import CustomIsAuthenticated
from .serializer import ExamSerializer
from django.core.exceptions import ValidationError
from jwt.exceptions import InvalidTokenError
from django.core.exceptions import ValidationError
from django.db.models import Q, Count
from exam_batch_management.models import Batch
from .models import Exam, ExamLocations
from questionnaire_management.models import QuestionnaireQuestions, Questionnaire
from question_category_management.models import QuestionCategory
from question_management.models import (
    QuestionData,
    Options,
    QuestionImage,
)
import random
import pytz
from django.http import HttpResponse
import csv

from server.utils.messages.error_messages import (
    error_code_e1010,
    error_code_e1055,
    error_code_e1062,
    error_code_e1006,
    error_code_e3008,
    error_code_e2076,
    error_code_e2080,
    error_code_e2081,
    error_code_e2241,
    error_code_e2227,
    error_code_e2237,
    error_code_e4303,
    error_code_e4305,
    error_code_e4710,
    error_code_e1123,
    error_code_e4805,
    error_code_e1126,
    error_code_e406,
)
from .validators import (
    validate_exam_name,
    validate_exam_date,
    validate_exam_time,
    validate_exam_duration,
    validate_status_of_exam,
    validate_exam_location,
    validate_questionnaire_id,
    validate_batch_student,
    validate_exam_status,
    validate_year,
    validate_is_pool,
    validate_questionnaire_list,
)

# Create your views here.


class CreateListExam(APIView):

    authentication_classes = (CustomIsAuthenticated,)

    def post(self, request):
        try:

            exam_name = request.data.get("examName")
            exam_location = request.data.get("examLocation")
            exam_date = request.data.get("examDate")
            exam_time = request.data.get("examTime")

            exam_duration = request.data.get("examDuration")
            questionnaire_id = request.data.get("questionnaireId")
            is_pool = request.data.get("isPool")

            validate_exam_name(exam_name)
            validate_exam_location(exam_location)
            validate_exam_date(exam_date)
            validate_exam_time(exam_time)
            validate_is_pool(is_pool)

            parsed_exam_date, parsed_exam_time = parse_exam_datetime(
                request.data.get("examDate"), request.data.get("examTime")
            )
            validate_exam_date_time(parsed_exam_date, parsed_exam_time)

            validate_exam_duration(exam_duration)
            validate_questionnaire_id(questionnaire_id)
            exam_instance = Exam.objects.filter(exam_name=exam_name, status=1)
            if exam_instance.exists():
                raise ValidationError(error_code_e4303())
            questionnaire_instance = Questionnaire.objects.get(
                id=questionnaire_id, status=1
            )

            with transaction.atomic():

                exam_location_instance = ExamLocations.objects.get_or_create(
                    location_name=exam_location
                )[0]

                Exam.objects.create(
                    exam_name=exam_name,
                    exam_date=exam_date,
                    exam_time=exam_time,
                    exam_duration=exam_duration,
                    exam_location=exam_location_instance,
                    questionnaire=questionnaire_instance,
                    is_pool=is_pool,
                )

            return Response(
                {"msg": "Exam scheduled successfully"}, status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Questionnaire.DoesNotExist:
            return Response(error_code_e2227(), status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        exam_location = request.query_params.get("examLocation")
        year = request.query_params.get("year")
        questionnaire_id = request.query_params.get("questionnaireId")
        search_term = request.query_params.get("searchTerm")
        exam_instance = (
            Exam.objects.filter(status=1)
            .prefetch_related(
                Prefetch(
                    "batch_set",
                    queryset=Batch.objects.filter(status=1),
                    to_attr="filtered_batches",
                ),
                Prefetch(
                    "questionnaire",
                    queryset=Questionnaire.objects.all(),
                    to_attr="questionnaire_details",
                ),
            )
            .order_by("-created_at")
        )

        try:

            if exam_location and year:

                validate_year(year)

                exam_instance = exam_instance.filter(
                    exam_date__year=year, exam_location=exam_location
                )

            elif exam_location:
                exam_instance = exam_instance.filter(exam_location=exam_location)

            elif year:
                validate_year(year)
                exam_instance = exam_instance.filter(exam_date__year=year)
            if questionnaire_id:
                validate_questionnaire_list(questionnaire_id)
                exam_instance = exam_instance.filter(questionnaire=questionnaire_id)

            if search_term:
                exam_instance = exam_instance.filter(exam_name__icontains=search_term)

            paginator = PageNumberPagination()
            result_page = paginator.paginate_queryset(exam_instance, request)

            serializer = ExamSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exam.DoesNotExist:
            return Response(error_code_e1055(), status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )


class ExamEditListGetById(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def put(self, request, exam_id):
        try:
            exam_duration = request.data.get("examDuration")
            questionnaire_id = request.data.get("questionnaireId")
            exam_name = request.data.get("examName")
            exam_location = request.data.get("examLocation")
            exam_date = request.data.get("examDate")
            exam_time = request.data.get("examTime")
            is_pool = request.data.get("isPool")

            validate_exam_name(exam_name)
            validate_exam_location(exam_location)

            validate_exam_date(exam_date)

            validate_exam_time(exam_time)
            validate_is_pool(is_pool)

            parsed_exam_date, parsed_exam_time = parse_exam_datetime(
                exam_date, exam_time
            )

            validate_exam_date_time(parsed_exam_date, parsed_exam_time)

            validate_exam_duration(exam_duration)

            validate_questionnaire_id(questionnaire_id)
            exam_instance = Exam.objects.get(id=exam_id, status=1)
            if exam_instance.status_of_exam == 1:
                raise ValidationError(error_code_e4305())

            self.process_exam_update(
                exam_instance,
                exam_location,
                questionnaire_id,
                exam_name,
                exam_duration,
                is_pool,
                parsed_exam_date,
                parsed_exam_time,
            )

            return Response(
                {"msg": "Exam updated successfully"}, status=status.HTTP_200_OK
            )

        except Exam.DoesNotExist:
            return Response(error_code_e3900(), status=status.HTTP_404_NOT_FOUND)

        except Questionnaire.DoesNotExist:
            return Response(error_code_e2227(), status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )

    # update exam

    def process_exam_update(
        self,
        exam_instance,
        exam_location,
        questionnaire_id,
        exam_name,
        exam_duration,
        is_pool,
        parsed_exam_date,
        parsed_exam_time,
    ):
        with transaction.atomic():

            if exam_location:
                if exam_instance.exam_location:
                    exam_location_instance = exam_instance.exam_location
                    exam_location_instance.location_name = exam_location
                    exam_location_instance.save()
                else:
                    exam_location_instance = ExamLocations.objects.create(
                        location_name=exam_location
                    )
                    exam_instance.exam_location = exam_location_instance

            if questionnaire_id:
                questionnaire_instance = Questionnaire.objects.get(
                    id=questionnaire_id, status=1
                )
                exam_instance.questionnaire = questionnaire_instance

            exam_instance.exam_name = exam_name
            exam_instance.exam_duration = exam_duration
            exam_instance.exam_date = parsed_exam_date
            exam_instance.exam_time = parsed_exam_time

            exam_instance.is_pool = is_pool
            exam_instance.save()

    def patch(self, request, exam_id):
        try:
            status_of_exam = request.data.get("examStatus")
            force_delete = request.query_params.get("forceDelete", False)

            exam = self.get_exam_or_error(exam_id)

            # Validate current exam status
            status_check_response = self.check_exam_status(exam, status_of_exam, force_delete)
            if status_check_response:
                return status_check_response

            # Validate the new status value
            validate_status_of_exam(status_of_exam)

            # Apply updates in a transaction
            with transaction.atomic():
                exam.status_of_exam = status_of_exam
                exam.save()

                if status_of_exam == 3:
                    self.delete_exam_related_data(exam)
                elif status_of_exam == 2:
                    self.close_batches(exam)

                return Response(
                    {"msg": "Exam updated successfully"},
                    status=status.HTTP_200_OK
                )

        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exam.DoesNotExist:
            return Response(error_code_e1055(), status=status.HTTP_400_BAD_REQUEST)
        
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)

    def get_exam_or_error(self, exam_id):
        """Fetch the exam or return an error if not found."""
        return Exam.objects.get(id=exam_id, status=True)

    def check_exam_status(self, exam, status_of_exam, force_delete):
        """Check the current status of the exam and return any required error response."""
        if exam.status_of_exam == 2:
            return Response(error_code_e1062(), status=status.HTTP_400_BAD_REQUEST)
        elif exam.status_of_exam == 3:
            return Response(error_code_e4710(), status=status.HTTP_400_BAD_REQUEST)
        elif status_of_exam == 2:
            # If the new status is 'in-progress' and there are open batches, check for force delete
            batches = Batch.objects.filter(batch_status=Batch.OPEN, exam=exam)
            if batches.exists() and not force_delete:
                return Response(error_code_e1126(), status=status.HTTP_400_BAD_REQUEST)

    def close_batches(self, exam):
        """Set all batches to CLOSED status for the given exam."""
        Batch.objects.filter(exam=exam).update(batch_status=Batch.CLOSED)

    def delete_exam_related_data(self, exam):
        """Delete related data for the exam when it's marked as completed."""
        StudentBatchMapping.objects.filter(exam=exam).delete()
        Batch.objects.filter(exam=exam).delete()



    def get(self, request, exam_id):

        try:
            exam = Exam.objects.prefetch_related(
                Prefetch(
                    "batch_set",
                    queryset=Batch.objects.filter(status=1),
                    to_attr="filtered_batches",
                )
            ).get(id=exam_id, status=1)
            serializer = ExamSerializer(exam)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exam.DoesNotExist:

            return Response(error_code_e1055(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


def parse_exam_datetime(exam_date=None, exam_time=None):

    parsed_exam_date, parsed_exam_time = None, None

    if exam_date:
        parsed_exam_date = datetime.strptime(exam_date, "%Y-%m-%d").date()

    if exam_time:
        parsed_exam_time = datetime.strptime(exam_time, "%H:%M:%S").time()

    return parsed_exam_date, parsed_exam_time


def validate_exam_date_time(parsed_exam_date, parsed_exam_time):
    timezone = pytz.timezone("Asia/Kolkata")
    current_datetime = datetime.now(timezone)
    current_date = current_datetime.date()
    current_time = current_datetime.time()
    if parsed_exam_date < current_date:
        raise ValidationError(error_code_e2080())

    if parsed_exam_date == current_date and parsed_exam_time < current_time:
        raise ValidationError(error_code_e2081())


####################################################3

from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from question_management.models import QuestionData, Options
from server.utils.util_functions.functions import remove_square_brackets
import random
from collections import defaultdict
from django.db import transaction


class CountOfQuestions(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request):
        try:
            results = QuestionCategory.objects.annotate(
                hard=Count(
                    "questiondata",
                    filter=Q(
                        questiondata__question_difficulty_level=QuestionData.HARD,
                        questiondata__status=True,
                    ),
                ),
                medium=Count(
                    "questiondata",
                    filter=Q(
                        questiondata__question_difficulty_level=QuestionData.MEDIUM,
                        questiondata__status=True,
                    ),
                ),
                easy=Count(
                    "questiondata",
                    filter=Q(
                        questiondata__question_difficulty_level=QuestionData.EASY,
                        questiondata__status=True,
                    ),
                ),
            ).values("id", "question_category_name", "hard", "medium", "easy")

            formatted_response = [
                {
                    "categoryId": result["id"],
                    "categoryName": result["question_category_name"],
                    "hard": result["hard"],
                    "medium": result["medium"],
                    "easy": result["easy"],
                }
                for result in results
            ]

            return Response(formatted_response, status=status.HTTP_200_OK)
        except QuestionCategory.DoesNotExist:
            return Response(error_code_e1006(), status=status.HTTP_400_BAD_REQUEST)
        except QuestionData.DoesNotExist:
            return Response(error_code_e3008(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


############################################################################

from rest_framework.response import Response

from rest_framework.pagination import PageNumberPagination
from server.utils.permissions.permission import CustomIsAuthenticated
from institution_management.models import Institution
from question_category_management.models import QuestionCategory

from student_management.models import Student
from question_management.models import QuestionData, Options
from exam_batch_management.models import StudentBatchMapping

from server.utils.messages.error_messages import (
    error_code_e3900,
)

from .utils.generate_exam_link import send_exam_link
from .utils.generate_student_token import generate_token
from django.conf import settings
from django.utils import timezone
import random
import jwt
from server.utils.decorators.token_decode import decode_token_from_query_params
import logging

logger = logging.getLogger("api_logger")


class QuestionPaperSendView(APIView):
    @decode_token_from_query_params
    def get(self, request):
        try:

            decoded_token = request.decoded_token
            response = decoded_token.get("response")
            exam = decoded_token.get("exam")
            validate_exam_status(exam)

            validate_batch_student(response)
            if exam.questionnaire_id is None:
                logger.warning("No questionnaire associated with exam")
                return Response(error_code_e2227(), status=status.HTTP_400_BAD_REQUEST)

            # Fetch the questions associated with the questionnaire

            questions = QuestionnaireQuestions.objects.filter(
                questionnaire_id=exam.questionnaire_id
            )

            if not questions.exists():
                logger.warning("No questions found for questionnaire")
                return Response(
                    {"error": "No questions found for the questionnaire"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Create a response list for all questions
            question_list = []
            for question_data in questions:
                question = QuestionData.objects.get(id=question_data.question_id)
                question_details = get_question_with_options_and_answers(
                    question, request
                )

                question_list.append(question_details)

            response.student_status = 1
            if response.exam_start_time is None:
                response.exam_start_time = datetime.now()
            response.save()
            logger.info("Exam started for student")
            return Response(
                {
                    "examName": exam.exam_name,
                    "examDuration": exam.exam_duration,
                    "questionsCount": len(question_list),
                    "questions": question_list,
                },
                status=status.HTTP_200_OK,
            )

        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except InvalidTokenError as e:
            return Response(error_code_e406(), status=status.HTTP_400_BAD_REQUEST)
        except StudentBatchMapping.DoesNotExist:
            return Response(error_code_e2241(), status=status.HTTP_400_BAD_REQUEST)
        except Exam.DoesNotExist:
            return Response(error_code_e1055(), status=status.HTTP_400_BAD_REQUEST)
        except QuestionnaireQuestions.DoesNotExist:
            return Response(error_code_e2076(), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception("An unexpected error occurred: %s", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def get_question_with_options_and_answers(question, request):
    question_type = question.question_type
    options_data = []

    question_image = QuestionImage.objects.filter(question_id_id=question.id)
    question_image_url = None
    if len(question_image) > 0:
        question_image_url = question_image[0].question_image.url

    if question_type == 0:  # Multiple choice with one correct answer
        try:
            # Fetch incorrect options
            options = Options.objects.filter(
                question_id=question.id, status=True, is_correct=0
            ).order_by("?")[:3]

            # Fetch correct answer
            correct_answer = Options.objects.get(
                question_id=question.id, status=True, is_correct=1
            )

            # Add incorrect options to options_data
            options_data = [
                {"id": option.id, "value": option.option} for option in options
            ]

            # Add the correct answer to the options_data
            options_data.append(
                {"id": correct_answer.id, "value": correct_answer.option}
            )

        except Options.DoesNotExist:
            raise ValidationError(error_code_e2237(question.id))

    elif question_type == 1:  # True or False (Single Option)
        # Fetch one random option
        options = Options.objects.filter(
            question_id=question.id, status=True, is_correct=0
        ).order_by("?")[:1]
        correct_answer = Options.objects.get(
            question_id=question.id, status=True, is_correct=1
        )

        if options:
            # Add the fetched option
            options_data.append({"id": options[0].id, "value": options[0].option})

            # Add the correct answer if it's different from the fetched option
            options_data.append(
                {"id": correct_answer.id, "value": correct_answer.option}
            )

    elif question_type == 2:  # Multiple correct answers
        # Fetch correct answers
        correct_answers_list = Options.objects.filter(
            question_id=question.id, status=True, is_correct=1
        )
        correct_answers = [
            {"id": answer.id, "value": answer.option} for answer in correct_answers_list
        ]

        # Add correct answers to options_data
        options_data.extend(correct_answers)

        # Fetch additional incorrect options and add them
        additional_options = (
            Options.objects.filter(question_id=question.id, status=True, is_correct=0)
            .exclude(id__in=[answer.id for answer in correct_answers_list])
            .order_by("?")[: (4 - len(correct_answers))]
        )
        options_data.extend(
            [{"id": option.id, "value": option.option} for option in additional_options]
        )

    random.shuffle(options_data)

    return {
        "id": question.id,
        "value": question.question,
        "type": question.question_type,
        "questionImage": (
            request.build_absolute_uri(question_image_url)
            if question_image_url is not None
            else None
        ),
        "options": options_data,
    }


class CountOfStudentsInExam(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request, pk):
        try:
            total_students_in_exam = StudentBatchMapping.objects.filter(
                exam_id=pk
            ).count()
            total_students_completed = StudentBatchMapping.objects.filter(
                exam_id=pk, student_status__in=[2, 5]
            ).count()
            total_students_remaining = StudentBatchMapping.objects.filter(
                exam_id=pk, student_status__in=[0, 1]
            ).count()
            if total_students_in_exam > 0:
                completion_percentage = round(
                    (total_students_completed / total_students_in_exam) * 100
                )
            else:
                completion_percentage = 0
            return Response(
                {
                    "total_students_in_exam": total_students_in_exam,
                    "total_students_completed": total_students_completed,
                    "total_students_remaining": total_students_remaining,
                    "percentage_of_completion": completion_percentage,
                },
                status=status.HTTP_200_OK,
            )
        except StudentBatchMapping.DoesNotExist:
            return Response(error_code_e1123(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


class ExamReportView(APIView):
    authentication_classes = (CustomIsAuthenticated,)
    STUDENT_STATUS = {
        0: "SCHEDULED",
        1: "STARTED",
        2: "COMPLETED",
        3: "TERMINATED",
        4: "REJECTED",
        5: "SHORTLISTED",
    }

    def get(self, request, pk):
        try:
            exam = Exam.objects.get(id=pk)
            if exam.status_of_exam != 2:
                return Response(error_code_e4805(), status=status.HTTP_400_BAD_REQUEST)

            exam_report = self.get_student_data(pk)
            category_names = {
                record["questioncategoryresponse__category__question_category_name"]
                for record in exam_report
                if record["questioncategoryresponse__category__question_category_name"]
            }
            grouped_data = self.group_student_data(exam_report, category_names)
            return self.write_csv_response(grouped_data, category_names)

        except Exam.DoesNotExist:
            return Response(error_code_e3900(), status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(
                {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )

    def get_student_data(self, pk):
        return (
            StudentBatchMapping.objects.filter(exam_id=pk)
            .prefetch_related("questioncategoryresponse")
            .values(
                "student__id",
                "student_status",
                "student__name",
                "student__email",
                "student__phone",
                "student__pass_out_year",
                "student__cgpa",
                "student__no_of_backlogs",
                "student__institution__institution_name",
                "questioncategoryresponse__question_difficulty_level",
                "questioncategoryresponse__correct_answer_count",
                "questioncategoryresponse__category__question_category_name",
                "correct_count",
            )
            .distinct()
        )

    def group_student_data(self, exam_report, category_names):
        print("Exam Report:", exam_report)
        grouped_data = {}

        for record in exam_report:
            response_id = record["student__id"]

            # Handle None values for missing student responses
            correct_answer_count = record.get(
                "questioncategoryresponse__correct_answer_count", 0
            )
            category_name = record.get(
                "questioncategoryresponse__category__question_category_name", None
            )

            # Initialize student data
            if response_id not in grouped_data:
                student_info = {
                    "student_name": record["student__name"],
                    "student_email": record["student__email"],
                    "student_phone": record["student__phone"],
                    "student_pass_out_year": record["student__pass_out_year"],
                    "student_cgpa": record["student__cgpa"],
                    "student_no_of_backlogs": record["student__no_of_backlogs"],
                    "institution_name": record[
                        "student__institution__institution_name"
                    ],
                    "student_status": self.STUDENT_STATUS.get(
                        record["student_status"], "UNKNOWN"
                    ),
                    "responses": {},
                    "total_mark": record.get("correct_count", 0),
                }
                grouped_data[response_id] = student_info

            if category_name:

                if category_name not in grouped_data[response_id]["responses"]:
                    grouped_data[response_id]["responses"][category_name] = 0

                grouped_data[response_id]["responses"][
                    category_name
                ] += correct_answer_count

        return grouped_data

    def write_csv_response(self, grouped_data, category_names):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="ExamReport.csv"'
        response.write("\ufeff".encode("utf8"))
        writer = csv.writer(response)
        header = [
            "Student ID",
            "Student Name",
            "Email",
            "Phone",
            "Pass Out Year",
            "CGPA",
            "No of Backlogs",
            "Institution Name",
            "Student Status",
            "Total Mark",
        ] + list(category_names)
        writer.writerow(header)

        for response_id, student_data in grouped_data.items():
            row = [
                response_id,
                student_data["student_name"],
                student_data["student_email"],
                student_data["student_phone"],
                student_data["student_pass_out_year"],
                student_data["student_cgpa"],
                student_data["student_no_of_backlogs"],
                student_data["institution_name"],
                student_data["student_status"],
                student_data["total_mark"],
            ]
            row.extend(
                student_data["responses"].get(category, 0)
                for category in category_names
            )
            writer.writerow(row)

        return response
