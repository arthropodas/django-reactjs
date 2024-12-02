from rest_framework.views import APIView
from .validators import (
    validate_email,
    validate_password,
    validate_new_password,
    validate_confirm_password,
    validate_token,
    validate_comment,
    validate_rating,
    validate_institution_id,
)
from jwt.exceptions import InvalidTokenError
from .models import AdminEmails
from django.core.cache import cache
from django.contrib.auth import authenticate
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from exam_management.serializer import ExamSerializer
from institution_management.serializer import InstitutionSerializer
from question_category_management.serializer import QuestionCategoryManagementSerializer
from django.core.exceptions import ValidationError
from server.utils.util_functions.functions import (
    remove_square_brackets,
    send_email,
    generate_reset_token,
)
from server.utils.messages.error_messages import (
    error_code_e2004,
    error_code_e2015,
    error_code_e404,
    error_code_e405,
    error_code_e406,
    error_code_e407,
    error_code_e409,
    error_code_e1006,
    error_code_e3008,
    error_code_e2029,
    error_code_e2025,
    error_code_e1067,
    error_code_e2028,
    error_code_e1010,
    error_code_e1055,
    error_code_e1086,
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from admin_management.models import Admin
from django.conf import settings
import jwt
from decouple import config
from server.utils.permissions.permission import CustomIsAuthenticated
from question_category_management.models import QuestionCategory
from question_management.models import QuestionData
from student_management.models import Student
from institution_management.models import Institution
from exam_management.models import Exam
from .models import Feedbacks
from .serializer import FeedbacksSerializer
from questionnaire_management.models import Questionnaire
from questionnaire_management.serializers import QuestionnaireSerializer
from exam_batch_management.models import StudentBatchMapping
from django.db import transaction
import logging


logger = logging.getLogger("api_logger")


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            if request.data.get("refresh") is None or request.data.get("refresh") == "":
                data = error_code_e404()
                return Response(data, status=status.HTTP_401_UNAUTHORIZED)
            response = super().post(request, *args, **kwargs)
            return response

        except InvalidToken:
            data = error_code_e405()
            return Response(data, status=status.HTTP_401_UNAUTHORIZED)


class AdminDashboardData(APIView):

    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request):
        try:
            question_category_count = QuestionCategory.objects.filter(
                status=True
            ).count()
            question_count = QuestionData.objects.filter(status=True).count()
            shortlisted_student_count = StudentBatchMapping.objects.filter(
                student_status=StudentBatchMapping.SHORTLISTED
            ).count()
            exam_count = Exam.objects.filter(status=True, status_of_exam=2)
            institution_count = Institution.objects.filter(status=True)
            feedback_count = Feedbacks.objects.filter(status=True)
            data = {
                "question_category_count": question_category_count,
                "question_count": question_count,
                "student_count": shortlisted_student_count,
                "exam_count": exam_count.count(),
                "institution_count": institution_count.count(),
                "feedback_count": feedback_count.count(),
            }

            return Response(data, status=status.HTTP_200_OK)

        except QuestionCategory.DoesNotExist:
            return Response(error_code_e1006(), status=status.HTTP_400_BAD_REQUEST)
        except Institution.DoesNotExist:
            return Response(error_code_e2028(), status=status.HTTP_400_BAD_REQUEST)
        except QuestionData.DoesNotExist:
            return Response(error_code_e3008(), status=status.HTTP_400_BAD_REQUEST)
        except StudentBatchMapping.DoesNotExist:
            return Response(error_code_e2029(), status=status.HTTP_400_BAD_REQUEST)
        except Exam.DoesNotExist:
            return Response(error_code_e2025(), status=status.HTTP_400_BAD_REQUEST)
        except Feedbacks.DoesNotExist:
            return Response(error_code_e1067(), status=status.HTTP_400_BAD_REQUEST)


class AddListFeedback(APIView):
    def post(self, request):
        try:
            logger.info("Start feedback post")
            token = request.query_params.get("token")
            comment = request.data.get("comment")
            rating = request.data.get("rating")

            # Validate inputs
            student_id = validate_token(token)
            validate_comment(comment)
            validate_rating(rating)

            # Use manual transaction management
            with transaction.atomic():
                # Fetch student
                student = Student.objects.get(id=student_id)

                # Create feedback
                feedback = Feedbacks.objects.create(
                    rating=rating, comment=comment, student=student
                )
                logger.info(
                    "Feedback created for student: %s, Rating: %d", student.name, rating
                )

            response_data = {
                "rating": feedback.rating,
                "comment": feedback.comment,
                "student_name": student.name,
                "status": feedback.status,
                "created_at": feedback.created_at,
                "updated_at": feedback.updated_at,
            }
            logger.info("Feedback response prepared: %s", response_data)
            return Response(response_data, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            logger.error("An unexpected error occurred: %s", str(e))
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class AdminViewFeedback(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request):
        try:
            filter_rating = request.query_params.get("rating")
            institution_id = request.query_params.get("institutionId")
            feedbacks = Feedbacks.objects.filter(status=True)

            # Filter by rating if provided
            if filter_rating:
                validate_rating(filter_rating)
                feedbacks = feedbacks.filter(rating=filter_rating)

            if institution_id:
                validate_institution_id(institution_id)
                feedbacks = feedbacks.filter(student__institution_id=institution_id)

            # Serialize and paginate feedbacks
            paginator = PageNumberPagination()
            paginator.page_size = config("ADMIN_DATA_PER_PAGE_PAGINATION")
            result_page = paginator.paginate_queryset(feedbacks, request)
            serializer = FeedbacksSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Feedbacks.DoesNotExist:
            return Response(error_code_e1067(), status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(
                remove_square_brackets(e.message_dict),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


class DropDownLists(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request, required_dropdown):

        try:
            if (
                required_dropdown != "exam"
                and required_dropdown != "institution"
                and required_dropdown != "question_category"
                and required_dropdown != "questionnaire"
            ):
                return Response(error_code_e1086(), status=status.HTTP_400_BAD_REQUEST)

            if required_dropdown == "exam":
                exams = Exam.objects.filter(status=True).exclude(
                    status_of_exam__in=[2, 3]
                )
                serializer = ExamSerializer(exams, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            if required_dropdown == "institution":
                institutions = Institution.objects.filter(status=True)
                serializer = InstitutionSerializer(institutions, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            if required_dropdown == "question_category":
                question_categories = QuestionCategory.objects.filter(status=True)
                serializer = QuestionCategoryManagementSerializer(
                    question_categories, many=True
                )
                return Response(serializer.data, status=status.HTTP_200_OK)

            if required_dropdown == "questionnaire":
                questionnaires = Questionnaire.objects.filter(status=True)
                serializer = QuestionnaireSerializer(questionnaires, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

        except Exam.DoesNotExist:
            return Response(error_code_e1055(), status=status.HTTP_400_BAD_REQUEST)
        except Institution.DoesNotExist:
            return Response(error_code_e2028(), status=status.HTTP_400_BAD_REQUEST)
        except QuestionCategory.DoesNotExist:
            return Response(error_code_e1006(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


class DropDownListsStudent(APIView):
    def get(self, request, required_dropdown):

        try:
            if (
                required_dropdown != "exam"
                and required_dropdown != "institution"
                and required_dropdown != "question_category"
                and required_dropdown != "questionnaire"
            ):
                return Response(error_code_e1086(), status=status.HTTP_400_BAD_REQUEST)

            if required_dropdown == "exam":
                exams = Exam.objects.filter(status=True).exclude(
                    status_of_exam__in=[2, 3]
                )
                serializer = ExamSerializer(exams, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            if required_dropdown == "institution":
                institutions = Institution.objects.filter(status=True)
                serializer = InstitutionSerializer(institutions, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            if required_dropdown == "question_category":
                question_categories = QuestionCategory.objects.filter(status=True)
                serializer = QuestionCategoryManagementSerializer(
                    question_categories, many=True
                )
                return Response(serializer.data, status=status.HTTP_200_OK)

            if required_dropdown == "questionnaire":
                questionnaires = Questionnaire.objects.filter(status=True)
                serializer = QuestionnaireSerializer(questionnaires, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

        except Exam.DoesNotExist:
            return Response(error_code_e1055(), status=status.HTTP_400_BAD_REQUEST)
        except Institution.DoesNotExist:
            return Response(error_code_e2028(), status=status.HTTP_400_BAD_REQUEST)
        except QuestionCategory.DoesNotExist:
            return Response(error_code_e1006(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


import uuid
import jwt
from datetime import datetime, timedelta, timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
from google.auth.exceptions import GoogleAuthError
from .models import AdminEmails


class AdminLoginAPIView(APIView):
    def post(self, request):
        try:
            # Get the token from the request
            token = request.data.get("token")
            print("token: ", token)

            if not token:
                return Response(
                    {"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST
                )

            # Verify the Google token and retrieve the user ID
            client_id = settings.CLIENT_ID  # Your Google Client ID
            payload = id_token.verify_oauth2_token(token, requests.Request(), client_id)
            print("payload: .......", payload)
            email = payload.get("email")
            name = payload.get("name")  # Name
            given_name = payload.get("given_name")
            picture = payload.get("picture")

            # Fetch admin details based on user_id
            admin = AdminEmails.objects.get(email=email)

            current_time = datetime.now(timezone.utc)
            access_expiration_time = current_time + timedelta(
                days=int(config("ACCESS_TOKEN_EXPIRY"))
            )
            refresh_expiration_time = current_time + timedelta(
                days=int(config("REFRESH_TOKEN_EXPIRY"))
            )

            access_payload = {
                "token_type": "access",
                "exp": int(
                    access_expiration_time.timestamp()
                ),  # Expiration time in seconds since epoch
                "iat": int(
                    current_time.timestamp()
                ),  # Issued at time in seconds since epoch
                "jti": str(uuid.uuid4()),  # Generate a unique identifier for the token
                "user_id": admin.id,  # The user ID from the admin model
            }

            refresh_payload = {
                "token_type": "refresh",
                "exp": int(refresh_expiration_time.timestamp()),
                "iat": int(current_time.timestamp()),
                "jti": str(uuid.uuid4()),
                "user_id": admin.id,
            }

            access_token = jwt.encode(
                access_payload, settings.SECRET_KEY, algorithm="HS256"
            )
            refresh_token = jwt.encode(
                refresh_payload, settings.SECRET_KEY, algorithm="HS256"
            )

            print("Access Token: ", access_token)
            print("Refresh Token: ", refresh_token)

            return Response(
                {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "name": name,
                    "givenName": given_name,
                    "profile": picture,
                },
                status=status.HTTP_200_OK,
            )

        except ValueError as e:
            print("Token verification error: ", str(e))
            return Response(error_code_e406(), status=status.HTTP_401_UNAUTHORIZED)

        except GoogleAuthError as e:

            return Response(error_code_e406(), status=status.HTTP_401_UNAUTHORIZED)

        except AdminEmails.DoesNotExist:
            return Response(error_code_e409(), status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
