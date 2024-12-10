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
    error_code_e1120,
    error_code_e2227,
    error_code_e1128,
    error_code_e1129,
    error_code_e1130
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from admin_management.models import Admin
from django.conf import settings
import jwt
from decouple import config
from server.utils.permissions.permission import CustomIsAuthenticated
from question_category_management.models import QuestionCategory
from valuation_management.models import QuestionCategoryResponse
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
from django.db.models import Count,F,Avg,Sum,Q,Func,FloatField, ExpressionWrapper, Case, When, IntegerField
from django.utils.timezone import now
import logging
from django.db.models.functions import Round

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
            # Use current year as default if no 'yearforShortlistedStudents' is provided
            year_for_shortlisted_students = request.query_params.get("yearforShortlistedStudents", now().year)

            # Pre-filter for the year as this is used multiple times
            student_batch_filter = Q(created_at__year=year_for_shortlisted_students, student__institution__isnull=False)

            # Fetch all required data in fewer queries
            shortlisted_students_count = StudentBatchMapping.objects.filter(
                student_batch_filter,
                student_status=StudentBatchMapping.SHORTLISTED
            ).count()

            completed_but_not_shortlisted_count = StudentBatchMapping.objects.filter(
                student_batch_filter,
                student_status=StudentBatchMapping.COMPLETED
            ).count()

            terminated_students_count = StudentBatchMapping.objects.filter(
                student_batch_filter,
                student_status=StudentBatchMapping.TERMINATED
            ).count()

            # Donut chart counts
            counts_for_shortlist_not_shortlist = {
                "shortlisted": shortlisted_students_count,
                "completed": completed_but_not_shortlisted_count,
                "terminated": terminated_students_count,
            }

            # Efficiently get total students per course
            total_students_per_course = (
                Student.objects.values("course")
                .annotate(total_students=Count("id"))
            )

            # Query shortlisted students per course
            shortlisted_students_per_course = (
                StudentBatchMapping.objects.filter(student_status=StudentBatchMapping.SHORTLISTED)
                .values("student__course")
                .annotate(shortlisted_students=Count("id"))
            )

            # Map courses to their respective passing rates
            course_passing_data = {}
            course_total_map = {data["course"]: data["total_students"] for data in total_students_per_course}
            for shortlisted_data in shortlisted_students_per_course:
                course_id = shortlisted_data["student__course"]
                shortlisted_count = shortlisted_data["shortlisted_students"]
                total_count = course_total_map.get(course_id, 0)
                if total_count > 0:
                    passing_rate = (shortlisted_count / total_count) * 100
                    course_name = dict(Student.COURSE_CHOICES).get(course_id, "Unknown Course")
                    course_passing_data[course_name] = f"{passing_rate:.2f}%"

            # Basic counts
            counts = {
                "shortlisted_student_count": shortlisted_students_count,
                "institution_count": Institution.objects.filter(status=True).count(),
                "total_students": Student.objects.filter(status=True).count(),
                "questionnaire_count": Questionnaire.objects.filter(status=True).count(),
            }

            data = {
                "counts": counts,
                "student_shortlist_donut_chart": counts_for_shortlist_not_shortlist,
                "student_passing_rate": course_passing_data,
            }

            return Response(data, status=status.HTTP_200_OK)
        
        
        except ValueError:
            return Response(error_code_e1129(), status=status.HTTP_400_BAD_REQUEST)
        except Institution.DoesNotExist:
            return Response(error_code_e2028(), status=status.HTTP_400_BAD_REQUEST)
        except StudentBatchMapping.DoesNotExist:
            return Response(error_code_e2029(), status=status.HTTP_400_BAD_REQUEST)
        except Student.DoesNotExist:
            return Response(error_code_e1120(), status=status.HTTP_400_BAD_REQUEST)
        except Questionnaire.DoesNotExist:
            return Response(error_code_e2227(), status=status.HTTP_400_BAD_REQUEST)
            
            
        
class BarGraphInstitutionStudent(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self,request):
        try:
            start_date = request.query_params.get("startDate")
            end_date = request.query_params.get("endDate")

            # Handle default date logic
            current_date = datetime.now()
            if start_date is None and end_date is None:
                start_date = (current_date - timedelta(days=365)).strftime('%Y-%m-%d')  # 1 year ago
                end_date = current_date.strftime('%Y-%m-%d')
            elif start_date is None:
                start_date = end_date  # Use the provided end_date as the single date filter
            elif end_date is None:
                end_date = start_date  # Use the provided start_date as the single date filter

            # Parse dates into datetime objects
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d")
            
            if start_date > end_date:
                return Response(
                    error_code_e1130(),
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Query data filtered by date range
            shortlisted_data = (
                StudentBatchMapping.objects.filter(
                    student_status=StudentBatchMapping.SHORTLISTED,
                    student__institution__isnull=False,
                    created_at__date__range=(start_date, end_date),
                )
                .values("student__institution__institution_name")
                .annotate(shortlisted_count=Count("id"))
                .order_by("student__institution__institution_name")
            )

            # Format the response
            formatted_response_bar_graph = [
                {"collegeName": data["student__institution__institution_name"], 
                "numberOfShortlistedStudents": data["shortlisted_count"]}
                for data in shortlisted_data
            ]
            
            data = {"student_institution_graph":formatted_response_bar_graph,}
            
            return Response(data,status=status.HTTP_200_OK)
        except ValueError:
            return Response(error_code_e1128(), status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(error_code_e1010(), status=status.HTTP_400_BAD_REQUEST)


class ExamAndQuestionnaireAnalysis(APIView):
    authentication_classes = (CustomIsAuthenticated,)
    def get(self,request):
        try:
            latest_questionnaire = Questionnaire.objects.order_by('-created_at').first()
            questionnaire_id = request.query_params.get("questionnaireId",latest_questionnaire.id)
            exams = (
                Exam.objects.filter(status=1)  # Consider only active exams
                .annotate(
                    location_name=F('exam_location__location_name'),
                    number_of_shortlisted_students=Count(
                        'studentbatchmapping__id',
                        filter=F('studentbatchmapping__student_status') == StudentBatchMapping.SHORTLISTED
                    )
                )
                .order_by('-created_at')[:5]
            )
            
            # Prepare the response
            latest_exam_details = [
                {
                    "exam_id": exam.id,
                    "exam_name": exam.exam_name,
                    "exam_location": exam.exam_location.location_name,
                    "number_of_shortlisted_students": exam.number_of_shortlisted_students,
                    "status_of_exam": exam.get_status_of_exam_display(),
                }
                for exam in exams
            ]
            
            #exam analytics

                
            #questionnaire analytics
            success_rate_data = (
                QuestionCategoryResponse.objects.filter(
                    response__exam__questionnaire_id=questionnaire_id
                )
                .values('category__question_category_name')
                .annotate(
                    total_correct=Count(
                        Case(
                            When(correct_answer_count__gt=0, then=1),
                            output_field=FloatField()
                        )
                    ),
                    total_questions=Count('category'),
                )
                .annotate(
                    success_rate=ExpressionWrapper(
                        F('total_correct') * 100.0 / F('total_questions'),
                        output_field=FloatField()
                    )
                )
                .annotate(
                    rounded_success_rate=Round(F('success_rate'), precision=2)
                )
                .order_by('-success_rate')
            )

        # Format the response
            questionnaire_analytics = [
                {
                    "category_name": data['category__question_category_name'],
                    "success_rate": round(data['success_rate'], 2),
                }
                for data in success_rate_data
            ]# Convert the queryset to a list of dictionaries
            data = {
                
                "latest_exam_details": latest_exam_details,
                "questionnaire_analytics": questionnaire_analytics,
            }
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

            
class ExamAnalytics(APIView):
    authentication_classes = (CustomIsAuthenticated,)
    def get(self, request):
        try:
            year_filter = request.query_params.get("yearFilter")
            search = request.query_params.get("search")

            # Filter completed exams
            completed_exams = Exam.objects.filter(status_of_exam=Exam.COMPLETED).order_by("-created_at")
            if year_filter:
                completed_exams = completed_exams.filter(created_at__year=year_filter)
            if search:
                completed_exams = Exam.objects.filter(status_of_exam=Exam.COMPLETED,cut_of_mark__isnull=False)

            # Prefetch related data
            student_data = StudentBatchMapping.objects.filter(
                exam__in=completed_exams
            ).values(
                "exam_id"
            ).annotate(
                total_students=Count("id"),
                avg_score=Avg("correct_count"),
                success_count=Count("id", filter=Q(student_status=StudentBatchMapping.SHORTLISTED)),
                failure_count=Count("id", filter=Q(student_status=StudentBatchMapping.COMPLETED)),
                termination_count=Count("id", filter=Q(student_status=StudentBatchMapping.TERMINATED)),
            )

            feedback_data = Feedbacks.objects.filter(
                student__studentbatchmapping__exam__in=completed_exams
            ).values(
                "student__studentbatchmapping__exam_id"
            ).annotate(
                avg_rating=Avg("rating")
            )

            # Map feedback averages by exam
            feedback_avg_map = {
                feedback["student__studentbatchmapping__exam_id"]: feedback["avg_rating"] or 0
                for feedback in feedback_data
            }

            # Prepare analytics
            exam_analytics = []
            for exam in completed_exams:
                exam_students = next(
                    (data for data in student_data if data["exam_id"] == exam.id), None
                )

                if exam_students and exam_students["total_students"] > 0:
                    total_students = exam_students["total_students"]
                    success_rate = (exam_students["success_count"] / total_students) * 100
                    failure_rate = (exam_students["failure_count"] / total_students) * 100
                    termination_rate = (exam_students["termination_count"] / total_students) * 100
                    average_score = exam_students["avg_score"] or 0
                else:
                    total_students = 0
                    success_rate = failure_rate = termination_rate = average_score = 0

                average_rating = feedback_avg_map.get(exam.id, 0)

                # Append analytics
                exam_analytics.append({
                    "exam_id": exam.id,
                    "exam_name": exam.exam_name,
                    "average_score": round(average_score, 2),
                    "average_rating": round(average_rating, 2),
                    "success_rate": f"{round(success_rate, 2)}%",
                    "failure_rate": f"{round(failure_rate, 2)}%",
                    "termination_rate": f"{round(termination_rate, 2)}%",
                    "total_students": total_students,
                })

            # Paginate response
            paginator = PageNumberPagination()
            paginator.page_size = config("ADMIN_DATA_PER_PAGE_PAGINATION", cast=int, default=10)
            result_page = paginator.paginate_queryset(exam_analytics, request)
            return paginator.get_paginated_response(result_page)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
        
    

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
