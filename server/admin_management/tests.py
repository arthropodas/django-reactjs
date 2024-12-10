from datetime import timedelta, datetime, timezone
from unittest.mock import patch
from django.urls import reverse
from rest_framework.test import APIClient
from django.conf import settings
from django.core.cache import cache
from rest_framework import status
from rest_framework.test import APITestCase
import jwt
from jwt import decode as jwt_decode
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from django.test import TestCase
from admin_management.models import Admin, Feedbacks, AdminEmails
from rest_framework_simplejwt.tokens import RefreshToken
from server.utils.util_functions.functions import generate_reset_token, send_email
from django.conf import settings
from institution_management.models import Institution
from exam_management.models import Exam, ExamLocations
from exam_batch_management.models import StudentBatchMapping, Batch
from question_category_management.models import QuestionCategory
from student_management.models import Student
from question_management.models import QuestionData
from questionnaire_management.models import Questionnaire
from server.utils.generate_student_token import generate_token


class DashboardDataTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create_user(
            email="testuser@example.com", password="TestPassword123"
        )

        self.institution_active = Institution.objects.create(
            id=1,
            institution_name="Active Institution",
            institution_code="Active123",
            status=True,
        )
        self.category1 = QuestionCategory.objects.create(
            id=1, question_category_name="Original Name", status=True
        )
        self.category2 = QuestionCategory.objects.create(
            id=2, question_category_name="Original Name 2", status=True
        )

        self.valid_student = Student.objects.create(
            id=1,
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_active,
            status=1,
            cgpa=3,
            course=1,
            no_of_backlogs=1,
        )

        self.exam_location = ExamLocations.objects.create(location_name="Test Location")
        self.questionnaire = Questionnaire.objects.create(
            questionnaire_name="Test Questionnaire"
        )
        self.institution = Institution.objects.create(
            institution_name="Test Institution",
            institution_code="ABC",
            institution_phone="1234567890",
            institution_email="test@example.com",
        )

        self.exam = Exam.objects.create(
            exam_name="Test Exam",
            exam_location=self.exam_location,
            exam_date="2024-01-01",
            exam_time="12:00:00",
            exam_duration=60,
            questionnaire=self.questionnaire,
            is_pool=True,
            status_of_exam=2,
        )

        self.question_data = QuestionData.objects.create(
            question="What is the capital of France?",
            question_category_id=self.category1,
            status=1,
        )

        self.feedback = Feedbacks.objects.create(
            rating=4, comment="test comment", student=self.valid_student, status=1
        )

        self.url = reverse("dashboard")

    def test_200_success(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("admin_management.views.QuestionCategory.objects.filter")
    def test_question_category_does_not_exist(self, mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = QuestionCategory.DoesNotExist
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.Institution.objects.filter")
    def test_institution_does_not_exist(self, mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = Institution.DoesNotExist
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.QuestionData.objects.filter")
    def test_question_does_not_exist(self, mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = QuestionData.DoesNotExist
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.StudentBatchMapping.objects.filter")
    def test_student_does_not_exist(self, mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = StudentBatchMapping.DoesNotExist
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.Exam.objects.filter")
    def test_exam_does_not_exist(self, mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = Exam.DoesNotExist
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.Feedbacks.objects.filter")
    def test_feedbacks_does_not_exist(self, mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = Feedbacks.DoesNotExist
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AddFeedbackTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.invalid_token_no_such_student = generate_token(self, 119, 1)
        self.invalid_token_no_such_exam = generate_token(self, 1, 2345)
        self.institution_active = Institution.objects.create(
            id=1,
            institution_name="Active Institution",
            institution_code="Active123",
            status=True,
        )
        self.student1 = Student.objects.create(
            id=1,
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_active,
            status=1,
            cgpa=3,
            no_of_backlogs=1,
            course=1,
        )

        self.student2 = Student.objects.create(
            id=2,
            name="John Doe",
            email="johndoe2@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_active,
            status=1,
            cgpa=3,
            no_of_backlogs=1,
            course=1,
        )
        self.exam_location = ExamLocations.objects.create(location_name="Test Location")
        self.questionnaire = Questionnaire.objects.create(
            questionnaire_name="Test Questionnaire"
        )

        self.category1 = QuestionCategory.objects.create(
            id=1, question_category_name="Original Name", status=True
        )
        self.category2 = QuestionCategory.objects.create(
            id=2, question_category_name="Original Name 2", status=True
        )
        self.exam = Exam.objects.create(
            exam_name="Test Exam",
            exam_location=self.exam_location,
            exam_date="2024-01-01",
            exam_time="12:00:00",
            exam_duration=60,
            questionnaire=self.questionnaire,
            is_pool=True,
            status_of_exam=2,
        )
        self.batch = Batch.objects.create(
            batch_name="Test Batch",
            uuid="XXXXXX",
            count_of_students="0",
            batch_status=1,
            exam=self.exam,
        )

        self.batch = Batch.objects.create(
            batch_name="Test Batch",
            uuid="Test10",
            count_of_students="0",
            batch_status=1,
            exam=self.exam,
        )
        self.exam_student1 = StudentBatchMapping.objects.create(
            student=self.student1,
            exam=self.exam,
            batch=self.batch,
            student_status=2,
            correct_count=2,
        )
        self.exam_student2 = StudentBatchMapping.objects.create(
            student=self.student2,
            exam=self.exam,
            batch=self.batch,
            student_status=2,
            correct_count=2,
        )
        self.valid_payload = {
            "student_id": self.student1.id,
            "batch_id": self.batch.id,
            "batch_uuid": self.batch.uuid,
        }

        self.valid_token = jwt.encode(
            self.valid_payload, settings.SECRET_KEY, algorithm="HS256"
        )

        self.valid_url = reverse("add_list_feedback")

    def test_200_ok(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.valid_token,
            {"rating": 4, "comment": "Nice"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_400_invalid_token(self):
        response = self.client.post(
            f"{self.valid_url}?token=invalid_token", {"rating": 5, "comment": "Nice"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_invalid_token_no_student(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.invalid_token_no_such_student,
            {"rating": 5, "comment": "Nice"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_exception(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.valid_token, {"dsc"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_200_no_comment(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.valid_token, {"rating": 5}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_400_comment_is_not_string(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.valid_token,
            {"comment": 1234},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_comment_is_too_small(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.valid_token, {"comment": "1"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_comment_is_too_large(self):
        large_comment = "a" * 2000
        response = self.client.post(
            f"{self.valid_url}?token=" + self.valid_token, {"comment": large_comment}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_comment_has_blank_space(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.valid_token, {"comment": " dfgh"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_no_token(self):
        response = self.client.post(f"{self.valid_url}?token=", {"comment": " dfgh"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_no_exam(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.invalid_token_no_such_exam,
            {"comment": "dsasdc"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_no_rating(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.valid_token, {"comment": "Nice"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_invalid_rating(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.valid_token,
            {"rating": "dsd", "comment": "Nice"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_rating_not_in_1_2_3_4_5(self):
        response = self.client.post(
            f"{self.valid_url}?token=" + self.valid_token,
            {"rating": 12, "comment": "Nice"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ListFeedbacksTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.institution_active = Institution.objects.create(
            id=1,
            institution_name="Active Institution",
            institution_code="Active123",
            status=True,
        )
        self.valid_student = Student.objects.create(
            id=1,
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_active,
            status=1,
            cgpa=3,
            course=1,
            no_of_backlogs=1,
        )
        self.valid_student2 = Student.objects.create(
            id=2,
            name="John Doe",
            email="johndoe2@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_active,
            status=1,
            cgpa=3,
            course=1,
            no_of_backlogs=1,
        )
        self.feedback = Feedbacks.objects.create(
            rating=5, comment="test comment", student=self.valid_student, status=1
        )
        self.feedback2 = Feedbacks.objects.create(
            rating=1, comment="test comment", student=self.valid_student, status=1
        )

        self.url = reverse("admin_view_feedbacks")

    def test_200_ok(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_200_filter_feedback_by_institution(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(
            f"{self.url}?institutionId={self.institution_active.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("admin_management.views.Feedbacks.objects.filter")
    def test_feedbacks_does_not_exist(self, mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Feedbacks.DoesNotExist
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.Feedbacks.objects.filter")
    def test_exam_does_not_exist(self, mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Exception("Forced Exception")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_200_filter_is_given(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"rating": 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_400_filter_is_invalid(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"rating": "a"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_filter_is_not_between_1_and_5(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"rating": 6})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DropDownTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.institution_active = Institution.objects.create(
            id=1,
            institution_name="Active Institution",
            institution_code="Active123",
            status=True,
        )
        self.category1 = QuestionCategory.objects.create(
            id=1, question_category_name="Original Name", status=True
        )
        self.exam_location = ExamLocations.objects.create(location_name="Test Location")
        self.questionnaire = Questionnaire.objects.create(
            questionnaire_name="Test Questionnaire"
        )

        self.exam = Exam.objects.create(
            exam_name="Test Exam",
            exam_location=self.exam_location,
            exam_date="2024-01-01",
            exam_time="12:00:00",
            exam_duration=60,
            questionnaire=self.questionnaire,
            is_pool=True,
            status_of_exam=2,
        )

        self.valid_url_exam = reverse(
            "dropdown_list", kwargs={"required_dropdown": "exam"}
        )
        self.valid_url_institution = reverse(
            "dropdown_list", kwargs={"required_dropdown": "institution"}
        )
        self.valid_url_question_category = reverse(
            "dropdown_list", kwargs={"required_dropdown": "question_category"}
        )

        self.valid_url_questionnaire = reverse(
            "dropdown_list", kwargs={"required_dropdown": "questionnaire"}
        )
        self.invalid_url = reverse("dropdown_list", kwargs={"required_dropdown": "12"})

    def test_200_questionnaire_ok(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.valid_url_questionnaire, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_200_institution_ok(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.valid_url_institution, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_200_question_category_ok(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.valid_url_question_category, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("admin_management.views.Exam.objects.filter")
    def test_exam_does_not_exist(self, mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Exam.DoesNotExist
        response = self.client.get(self.valid_url_exam, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.Institution.objects.filter")
    def test_institution_does_not_exist(self, mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Institution.DoesNotExist
        response = self.client.get(self.valid_url_institution, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.QuestionCategory.objects.filter")
    def test_question_category_does_not_exist(self, mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = QuestionCategory.DoesNotExist
        response = self.client.get(self.valid_url_question_category, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.QuestionCategory.objects.filter")
    def test_exception(self, mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Exception("forced Exception")
        response = self.client.get(self.valid_url_question_category, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_path_param(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.invalid_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DropDownListStudentTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.institution_active = Institution.objects.create(
            id=1,
            institution_name="Active Institution",
            institution_code="Active123",
            status=True,
        )
        self.category1 = QuestionCategory.objects.create(
            id=1, question_category_name="Original Name", status=True
        )
        self.exam_location = ExamLocations.objects.create(location_name="Test Location")
        self.questionnaire = Questionnaire.objects.create(
            questionnaire_name="Test Questionnaire"
        )

        self.exam = Exam.objects.create(
            exam_name="Test Exam",
            exam_location=self.exam_location,
            exam_date="2024-01-01",
            exam_time="12:00:00",
            exam_duration=60,
            questionnaire=self.questionnaire,
            is_pool=True,
            status_of_exam=2,
        )

        self.valid_url_exam = reverse(
            "dropdown_list_student", kwargs={"required_dropdown": "exam"}
        )
        self.valid_url_institution = reverse(
            "dropdown_list_student", kwargs={"required_dropdown": "institution"}
        )

        self.valid_url_question_category = reverse(
            "dropdown_list_student", kwargs={"required_dropdown": "question_category"}
        )

        self.valid_url_questionnaire = reverse(
            "dropdown_list_student", kwargs={"required_dropdown": "questionnaire"}
        )
        self.inavlid_url = reverse(
            "dropdown_list_student", kwargs={"required_dropdown": "demo"}
        )

    def test_200_institution_ok(self):
        response = self.client.get(self.valid_url_institution, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_200_question_category_ok(self):
        response = self.client.get(self.valid_url_question_category, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_200_questionnaire_ok(self):
        response = self.client.get(self.valid_url_questionnaire, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_400_no_filter(self):
        response = self.client.get(self.inavlid_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1086")

    @patch("admin_management.views.Exam.objects.filter")
    def test_exam_does_not_exist(self, mock_filter):
        mock_filter.side_effect = Exam.DoesNotExist
        response = self.client.get(self.valid_url_exam, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.Institution.objects.filter")
    def test_institution_does_not_exist(self, mock_filter):
        mock_filter.side_effect = Institution.DoesNotExist
        response = self.client.get(self.valid_url_institution, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.QuestionCategory.objects.filter")
    def test_question_category_does_not_exist(self, mock_filter):
        mock_filter.side_effect = QuestionCategory.DoesNotExist
        response = self.client.get(self.valid_url_question_category, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("admin_management.views.QuestionCategory.objects.filter")
    def test_exception(self, mock_filter):
        mock_filter.side_effect = Exception("forced Exception")
        response = self.client.get(self.valid_url_question_category, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AdminLoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = AdminEmails.objects.create(id=1, email="test@gmail.com")

        self.url = reverse("admin_login")

    def generate_google_token(self, email):
        """Generate a mock Google JWT token."""
        payload = {
            "email": email,
            "name": "Test User",
            "given_name": "Test",
            "iss": "accounts.google.com",
            "aud": settings.CLIENT_ID,
        }
        token = jwt.encode(payload, "mock-secret-key", algorithm="HS256")
        return token

    @patch("admin_management.views.id_token.verify_oauth2_token")
    def test_google_login_success(self, mock_verify_token):
        # Generate a mock token
        token = self.generate_google_token(self.admin.email)

        # Mock the payload verification
        mock_verify_token.return_value = {
            "email": self.admin.email,
            "name": "Test User",
            "given_name": "Test",
            "picture": "http://example.com/test_picture.jpg",
        }
        response = self.client.post(self.url, {"token": token})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("admin_management.views.AdminEmails.objects.get")
    def test_i(self, mock_filter):
        mock_filter.side_effect = AdminEmails.DoesNotExist
        response = self.client.post(self.url, {"token": "invalid token"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["errorCode"], "e406")

    @patch("admin_management.views.id_token.verify_oauth2_token")
    def test_400_login_fails(self, mock_verify_token):
        # Generate a mock token
        token = self.generate_google_token("testemail@gmail.com")

        # Mock the payload verification
        mock_verify_token.return_value = {
            "email": "testemail@gmail.com",
            "name": "Test User",
            "given_name": "Test",
            "picture": "http://example.com/test_picture.jpg",
        }
        response = self.client.post(self.url, {"token": token})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data["errorCode"], "e409")

    def test_400_token_required(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Token is required.")


class CustomTokenRefreshViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = AdminEmails.objects.create(email="sampleemail@gmail.com")
        refresh = RefreshToken.for_user(self.admin_user)
        self.valid_refresh_token = str(refresh)
        self.url = reverse("token_refresh")

    def test_200_refresh_with_valid_token(self):

        response = self.client.post(self.url, {"refresh": self.valid_refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_400_token_empty(self):

        response = self.client.post(self.url, {"refresh": ""})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["errorCode"], "e404")

    def test_400_invalid_token(self):

        response = self.client.post(self.url, {"refresh": "invalid_token"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["errorCode"], "e405")
