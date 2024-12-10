from io import StringIO
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import csv
from django.core.exceptions import ValidationError
from .serializers import StudentSerializer, ExamSerializer
from .models import Student, Exam
from server.utils.permissions.permission import CustomIsAuthenticated
from django.core.exceptions import ValidationError
from institution_management.models import Institution
from django.db import IntegrityError, transaction
from server.utils.util_functions.functions import generate_student_exam_token
from server.utils.messages.error_messages import error_code_2026, error_code_e1117
from django.conf import settings
from valuation_management.models import StudentsResponse
from institution_management.validators import validate_institution_name
import jwt
from server.utils.maps.mapping import course_mapping
from .validators import (
    validate_name,
    validate_email,
    validate_phone_number,
    validate_year_of_passout,
    validate_institution_id,
    validate_student_id,
    validate_search_passout_year,
    validate_search_institution_id,
    validate_page_size,
    validate_email_update,
    validate_institution_id_csv,
    validate_csv_file,
    validate_csv_file,
    validate_ids,
    validate_row_count,
    validate_csv_passout_year,
    validate_cgpa,
    validate_no_of_backlogs,
    validate_batch_id,
    validate_email_verification,
    validate_batch_id_response,
    validate_course,
    validate_course_csv,
)
from server.utils.util_functions.functions import remove_square_brackets, convert_error
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from server.utils.messages.error_messages import (
    error_code_e2029,
    error_code_e2020,
    error_code_e2030,
    error_code_e2034,
    error_code_e2037,
    error_code_e2028,
    error_code_e1010,
    error_code_e1110,
    error_code_e1112,
    error_code_e1114,
    error_code_e1118,
)
from exam_batch_management.models import Batch, StudentBatchMapping
from question_management.models import (
    QuestionData,
    Options,
    QuestionImage,
    QuestionCategory,
)
from questionnaire_management.models import QuestionnaireQuestions
from django.db.models import F, Sum
import logging
from valuation_management.models import QuestionCategoryResponse

logger = logging.getLogger("api_logger")


class StudentAPIView(APIView):
    authentication_classes = (CustomIsAuthenticated,)
    pagination_class = PageNumberPagination

    def post(self, request):
        try:
            name = request.data.get("name")
            email = request.data.get("email")
            phone = request.data.get("phone")
            pass_out_year = request.data.get("passOutYear")
            institution_id = request.data.get("institutionId")
            cgpa = request.data.get("cgpa")
            no_of_backlogs = request.data.get("noOfBacklogs")
            course = request.data.get("course")
            print(":numebr of backo", no_of_backlogs)
            name = validate_name(name)
            validate_email(email)
            validate_phone_number(phone)
            validate_year_of_passout(pass_out_year)
            validate_cgpa(cgpa)
            validate_no_of_backlogs(no_of_backlogs)
            validate_institution_id(institution_id)
            validate_course(course)

            institution = Institution.objects.filter(
                id=institution_id, status=True
            ).first()
            student = Student.objects.create(
                name=name,
                email=email,
                phone=phone,
                pass_out_year=pass_out_year,
                institution=institution,
                cgpa=cgpa,
                no_of_backlogs=no_of_backlogs,
                course=course,
            )
            student = Student.objects.get(id=student.id, status=1)

            # ExamStudents.objects.create(
            #     exam_id=exam,
            #     student_id=student,
            # )

            # token = generate_student_exam_token(
            #     exam_id=exam.id, student_id=student.id
            # )
            # Student.objects.filter(id=student.id, status=1).update(token=token)

            response_data = {
                "id": student.id,
                "email": student.email,
                "cgpa": student.cgpa,
                "no_of_backlogs": student.no_of_backlogs,
                "course": student.get_course_display(),
                "name": student.name,
                "phone": student.phone,
                "institution_id": student.institution_id,
                "created_at": student.created_at,
                "updated_at": student.updated_at,
            }
            return Response(
                response_data,
                status=status.HTTP_200_OK,
            )
        except Institution.DoesNotExist:
            return Response(error_code_e2028(), status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                str(e),
                status=status.HTTP_400_BAD_REQUEST,
            )

    def get(self, request):
        institution_id = request.query_params.get("institutionId")
        pass_out_year = request.query_params.get("passOutYear")
        search_term = request.query_params.get("searchTerm")
        # import pdb;pdb.set_trace()
        

        try:
            students = Student.objects.filter(status=1).distinct()

            # Filter by institution_id if provided
            if institution_id:
                validate_search_institution_id(institution_id)
                students = students.filter(institution_id=institution_id)

            # Filter by pass_out_year if provided
            if pass_out_year:
                validate_search_passout_year(pass_out_year)
                students = students.filter(pass_out_year=pass_out_year)

            # Filter by search term if provided
            if search_term:
                students = students.filter(name__icontains=search_term)

            # Order by primary key in descending order
            students = students.order_by("-id")

            # Validate page size if page is provided

            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(students, request)
            serializer = StudentSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)

        except ValidationError as e:
            data = remove_square_brackets(e.message_dict)
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):

        data = request.data

        try:
            student_ids = data.get("student_ids", [])
            print("stude tids", student_ids)
            if len(student_ids) == 0:
                data = error_code_e2030()
                return Response(
                    data=data,
                    status=status.HTTP_400_BAD_REQUEST,
                )
            students = Student.objects.filter(id__in=student_ids, status=1)
            if len(students) != len(student_ids):
                raise Student.DoesNotExist

            students.update(status=0)
            return Response(
                {"success": "student deleted successfully"},
                status=status.HTTP_200_OK,
            )

        except (ValueError, Student.DoesNotExist):
            data = error_code_e2029()
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)


class StudentGetUpdateAPIView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request, pk):
        course = {}
        try:
            student = validate_student_id(
                pk
            )  # Ensure this returns a single Student instance
            if isinstance(student, Student):
                serializer = StudentSerializer(student)

                # Convert cgpa and no_of_backlogs to strings
                response_data = serializer.data
                response_data["cgpa"] = str(response_data["cgpa"])
                response_data["no_of_backlogs"] = str(response_data["no_of_backlogs"])
                course["name"] = student.get_course_display()
                course["value"] = student.course
                response_data["course"] = course

                # response_data[]

                return Response(response_data)

            else:
                return Response(
                    data=error_code_e2029(),
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):

        try:
            # Extract data from the request
            name = request.data.get("name")
            email = request.data.get("email")
            phone = request.data.get("phone")
            pass_out_year = request.data.get("passOutYear")
            cgpa = request.data.get("cgpa")
            no_of_backlogs = request.data.get("noOfBacklogs")
            course = request.data.get("course")
            student = validate_student_id(pk)
            validate_name(name)
            validate_email_update(email, pk)
            validate_phone_number(phone)
            validate_year_of_passout(pass_out_year)
            validate_cgpa(cgpa)
            validate_no_of_backlogs(no_of_backlogs)
            validate_course(course)

            # Update the student record with validated data
            student.name = name
            student.email = email
            student.phone = phone
            student.pass_out_year = pass_out_year
            student.cgpa = cgpa
            student.no_of_backlogs = no_of_backlogs
            student.course = course
            # Save changes to the database
            student.save()
            response_data = {
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "status": student.status,
                "cgpa": student.cgpa,
                "course": student.course,
                "no_of_backlogs": student.no_of_backlogs,
                "institution_id": student.institution_id,
                "created_at": student.created_at,
                "updated_at": student.updated_at,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except ValidationError as e:
            # Handle validation errors
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Handle other exceptions
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CsvUploadView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def post(self, request):
        try:
            csv_file = request.FILES.get("studentsList")
            validate_csv_file(csv_file)
            institution_id = request.data.get("institutionId")
            validate_institution_id_csv(institution_id)
            if not csv_file or not csv_file.name.endswith(".csv"):
                return Response({"error": error_code_e2034()}, status=400)

            data, headers, rows = self.extract_csv_content(csv_file)
            validate_row_count(rows)

            expected_headers = [
                "name",
                "email",
                "phone",
                "pass_out_year",
                "cgpa",
                "no_of_backlogs",
                "course",
            ]
            if headers != expected_headers:
                return Response(error_code_e2037(), status=400)

            row_errors, valid_rows = self.process_csv_data(data)

            # If there are any row errors, return them without uploading
            if row_errors:
                return Response(
                    {
                        "errorCode": "e2050",
                        "errorMsg": {
                            "errors": row_errors,
                            "invalidCount": len(row_errors),
                        },
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Proceed with bulk upload if no errors
            with transaction.atomic():
                self.process_word_data(valid_rows, institution_id=institution_id)

            return Response(
                {"message": "Students uploaded successfully"}, status=status.HTTP_200_OK
            )

        except ValidationError as e:
            print("e..............", e)
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )

    def process_csv_data(self, data):
        row_errors = {}
        valid_rows = []
        email_set = ()

        for row_number, row in enumerate(data[1:], start=1):
            email = row[1].strip()
            if email in email_set:
                continue
            row_error = self.validate_row(row, row_number)
            if row_error:
                row_errors[row_number] = row_error
            else:
                valid_rows.append(row)  # Append only valid rows

        return row_errors, valid_rows

    def validate_row(self, row, row_number):
        name = row[0].strip()
        email = row[1].strip()
        phone_number = row[2].strip()
        pass_out_year = row[3].strip()
        cgpa = row[4].strip()
        no_of_backlogs = row[5].strip()
        course = row[6].strip()

        field_errors = {}

        try:
            validate_name(name)
        except ValidationError as e:
            field_errors["name"] = remove_square_brackets(e.message_dict)

        try:
            validate_email(email)
        except ValidationError as e:
            field_errors["email"] = remove_square_brackets(e.message_dict)

        try:
            validate_phone_number(phone_number)
        except ValidationError as e:
            field_errors["phone"] = remove_square_brackets(e.message_dict)

        try:
            validate_csv_passout_year(pass_out_year)
        except ValidationError as e:
            field_errors["pass_out_year"] = remove_square_brackets(e.message_dict)
        try:
            validate_cgpa(cgpa)
            print("cgpa: " + cgpa)
            print("no_of_backlogs: ", type(cgpa))
        except ValidationError as e:
            field_errors["cgpa"] = remove_square_brackets(e.message_dict)
        try:
            validate_no_of_backlogs(no_of_backlogs)
            print("no_of_backlogs: ", type(no_of_backlogs))
        except ValidationError as e:
            field_errors["no_of_backlogs"] = remove_square_brackets(e.message_dict)

        try:
            validate_course_csv(course)
        except ValidationError as e:
            field_errors["course"] = remove_square_brackets(e.message_dict)

        return field_errors if field_errors else None

    def process_word_data(self, valid_rows, institution_id):
        print("Valid rows: %d" % len(valid_rows), valid_rows)

        # Iterate over the valid rows and create Student objects in memory
        try:
            if len(valid_rows) > 0:
                for row in valid_rows:
                    name = row[0].strip()
                    email = row[1].strip()
                    phone = row[2].strip()
                    pass_out_year = int(row[3].strip())
                    cgpa = float(row[4].strip())
                    no_of_backlogs = int(row[5].strip())
                    course = row[6].strip()
                    print(f"name: {name}, email: {email}, phone: {phone}")
                    course = course_mapping.get(course)
                    # Create Student object without saving it yet
                    student_obj = Student.objects.create(
                        name=name,
                        email=email,
                        phone=phone,
                        pass_out_year=pass_out_year,
                        course=course,
                        cgpa=cgpa,
                        no_of_backlogs=no_of_backlogs,  # Assuming no_of_backlogs is a field in the model
                        institution_id=institution_id,  # Assuming institution_id is part of the model
                        # exam=exam  # Assuming exam is a ForeignKey or related field
                    )
                    # token = generate_student_exam_token(exam_id=exam.id, student_id=student_obj.id)

                    print("student_obj", student_obj)
                    student_obj.save()
        except Exception as e:
            print("Error while creating students: ", e)
            return 0, [str(e)]

    def extract_csv_content(self, csv_file):
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
        data = [row for row in reader]
        headers = data[0] if data else []
        rows = data[1:] if data else []
        return data, headers, rows


class SelfRegistration(APIView):
    def post(self, request):
        try:
            logger.info("Self-registration request received for email")

            # Extracting data from request
            name = request.data.get("name")
            email = request.data.get("email")
            phone = request.data.get("phone")
            pass_out_year = request.data.get("passOutYear")
            institution_id = request.data.get("institutionId")
            cgpa = request.data.get("cgpa")
            no_of_backlogs = request.data.get("noOfBacklogs")
            course = request.data.get("course")

            # Input validation
            validate_name(name)
            validate_email(email)
            validate_phone_number(phone)
            validate_year_of_passout(pass_out_year)
            validate_cgpa(cgpa)
            validate_no_of_backlogs(no_of_backlogs)
            validate_course(course)

            with transaction.atomic():
                # If institution_id is provided
                if institution_id:
                    validate_institution_id(institution_id)
                    institution = Institution.objects.filter(
                        id=institution_id, status=True
                    ).first()
                    if not institution:
                        logger.warning(
                            "Institution with ID %s not found or inactive",
                            institution_id,
                        )
                        return Response(
                            error_code_e2028(), status=status.HTTP_400_BAD_REQUEST
                        )

                    # Create student linked to institution
                    student = Student.objects.create(
                        name=name,
                        email=email,
                        phone=phone,
                        pass_out_year=pass_out_year,
                        institution=institution,
                        cgpa=cgpa,
                        no_of_backlogs=no_of_backlogs,
                        course=course,
                    )
                    logger.info(
                        "Created student linked to institution ID: %s", institution_id
                    )
                else:
                    logger.info("Inside else for institution id not requried")
                    # If institution_name is provided (for self-registration)
                    institution_name = request.data.get("institutionName")
                    validate_institution_name(institution_name)

                    # Create new institution
                    institution = Institution.objects.create(
                        institution_name=institution_name,
                        institution_email="",
                        institution_phone="",
                        coordinator_name="",
                        coordinator_email="",
                        coordinator_phone="",
                    )
                    logger.info("Created new institution")

                    # Create student linked to the new institution
                    student = Student.objects.create(
                        name=name,
                        email=email,
                        phone=phone,
                        pass_out_year=pass_out_year,
                        institution=institution,
                        cgpa=cgpa,
                        no_of_backlogs=no_of_backlogs,
                        course=course,
                    )
                    logger.info("Created student linked to new institution")

                # Retrieve created student with status check
                student = Student.objects.get(id=student.id, status=True)

                # Prepare response data
                response_data = {
                    "id": student.id,
                    "email": student.email,
                    "cgpa": student.cgpa,
                    "no_of_backlogs": student.no_of_backlogs,
                    "name": student.name,
                    "phone": student.phone,
                    "institution_id": student.institution_id,
                    "created_at": student.created_at,
                    "updated_at": student.updated_at,
                }

                return Response(response_data, status=status.HTTP_200_OK)

        except Institution.DoesNotExist:
            return Response(error_code_e2028(), status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error("unexpected error occurred: %s", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class StudentVerification(APIView):
    def post(self, request):
        try:
            logger.info("Received request to verify student")
            # Fetch data from request
            email = request.data.get("studentEmail")
            batch_uuid = request.data.get("batchId")

            # Validate inputs
            validate_email_verification(email)
            validate_batch_id(batch_uuid)

            # Check exam status within an atomic transaction
            with transaction.atomic():
                # Use select_for_update to lock the batch
                batch = Batch.objects.select_for_update().get(uuid=batch_uuid)
                exam = Exam.objects.filter(id=batch.exam.id, status_of_exam=1).first()
                if not exam:
                    logger.warning("No active exam found for batch")
                    return Response(
                        error_code_e1117(), status=status.HTTP_400_BAD_REQUEST
                    )

                # Get the student
                student = Student.objects.filter(email=email, status=True).first()
                if not student:
                    logger.warning("Student not found with email")
                    return Response(
                        error_code_e1112(exam.is_pool),
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Check if student is already mapped to a batch
                batch_mapping = StudentBatchMapping.objects.filter(
                    student=student
                ).exists()
                if batch_mapping:
                    logger.warning("Student is already mapped to a batch")
                    return Response(
                        error_code_e1114(), status=status.HTTP_400_BAD_REQUEST
                    )

                # Creating batch mapping and updating count of students
                logger.info("Creating batch mapping for student")
                StudentBatchMapping.objects.create(
                    student=student,
                    exam=batch.exam,
                    batch=batch,
                    exam_start_time=None,
                    exam_end_time=None,
                )
                batch.count_of_students = F("count_of_students") + 1
                batch.save()
                logger.info("Updated count of students for batch")

                # Generate JWT token
                payload = {
                    "student_id": student.id,
                    "batch_id": batch.id,
                    "batch_uuid": batch.uuid,
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
                logger.info("Generated JWT token for student")
                return Response({"token": token}, status=status.HTTP_200_OK)

        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            logger.error("Validation error occurred: %s", error_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error("An unexpected error occurred: %s", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MarkListOfStudent(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request):
        try:
            student_id = request.query_params.get("studentId")
            batch_id = request.query_params.get("batchId")
            student = validate_student_id(student_id)
            batch = validate_batch_id_response(batch_id)
            response = StudentBatchMapping.objects.get(
                student_id=student_id, batch_id=batch_id
            )
            exam = Exam.objects.get(id=response.exam_id)
            if exam.status_of_exam == Exam.CANCELLED:
                return Response(error_code_e1118(), status=status.HTTP_400_BAD_REQUEST)
            if (
                response.student_status != StudentBatchMapping.COMPLETED
                and response.student_status != StudentBatchMapping.SHORTLISTED
            ):
                return Response(error_code_e1118(), status=status.HTTP_400_BAD_REQUEST)
            questionare_questions = QuestionnaireQuestions.objects.filter(
                questionnaire=exam.questionnaire
            )
            question_details = {}
            question_bank = []
            options = []
            correct_answers_array = []
            student_response_array = []
            student_full_response = {}
            image_for_corresponding_question = None
            for questionare_question in questionare_questions:
                question_object = questionare_question.question
                question_id = question_object.id
                question_image = QuestionImage.objects.filter(
                    question_id=question_id
                ).first()
                options_for_question = Options.objects.filter(
                    question_id=question_id, is_correct=0
                )
                correct_answers = Options.objects.filter(
                    question_id=question_id, is_correct=1
                )
                question_category = QuestionCategory.objects.filter(
                    id=question_object.question_category_id.id
                ).first()
                student_responses = StudentsResponse.objects.filter(
                    response=response.id, question=question_id
                )

                for correct_answer in correct_answers:
                    correct_answers_array.append(correct_answer.option)

                for option_value in options_for_question:
                    options.append(option_value.option)

                # if not student_responses.exists():
                for student_response in student_responses:
                    student_inputed_option = Options.objects.get(
                        id=student_response.student_input
                    )
                    student_response_array.append(student_inputed_option.option)
                # else:
                #     student_response_array=[]

                if question_image:
                    image_for_corresponding_question = f"{settings.BACKEND_BASE_URL}{question_image.question_image.url}"
                else:
                    image_for_corresponding_question = None

                batch_mapping = StudentBatchMapping.objects.filter(
                    student=student
                ).first()
                student_status = batch_mapping.get_student_status_display()

                question_details = {
                    "question_id": question_id,
                    "question": question_object.question,
                    "question_type": question_object.question_type,
                    "question_category": question_category.question_category_name,
                    "difficulty_level": question_object.question_difficulty_level,
                    "question_image": image_for_corresponding_question,
                    "options": options,
                    "correct_answer": correct_answers_array,
                    "student_response": student_response_array,
                }

                question_bank.append(question_details)

                options = []
                correct_answers_array = []
                options = []
                student_response_array = []
                question_details = {}

            category_data = (
            QuestionCategoryResponse.objects.filter(response=response)
            .values('category__id', 'category__question_category_name')  # Get category ID and name
            .annotate(total_correct_answer_count=Sum('correct_answer_count'))  # Sum correct_answer_count
        )
            
            category_wise_answers = [
            {
                "category_id": item["category__id"],
                "category_name": item["category__question_category_name"],
                "total_correct_answer_count": item["total_correct_answer_count"],
            }
            for item in category_data
        ]
            student_full_response = {
                "question_bank": question_bank,
                "student_details": {
                    "student_id": student.id,
                    "student_name": student.name,
                    "student_email": student.email,
                    "student_cgpa": student.cgpa,
                    "student_backlog": student.no_of_backlogs,
                    "student_status": student_status,
                },
                "batch_details": {
                    "batch_id": batch.id,
                    "batch_uuid": batch.uuid,
                    "batch_name": batch.batch_name,
                },
                "exam_details": {
                    "exam_id": exam.id,
                    "exam_name": exam.exam_name,
                    "total_mark": response.correct_count,
                    "category_wise_mark":category_wise_answers
                },
            }
            return Response(student_full_response, status=status.HTTP_200_OK)
        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
