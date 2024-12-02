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
from admin_management.models import Admin,Feedbacks
from rest_framework_simplejwt.tokens import RefreshToken
from server.utils.util_functions.functions import generate_reset_token, send_email
from django.conf import settings
from institution_management.models import Institution
from exam_management.models import Exam,ExamQuestionCategory
from student_management.models import Student,ExamStudents
from question_category_management.models import QuestionCategory
from question_management.models import QuestionData
from server.utils.generate_student_token import generate_token


User = get_user_model()
current_date = datetime.now()  # This is a datetime object
valid_current_year = current_date.strftime("%Y-%m-%d")

class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.email = "testuser@example.com"
        self.password = "SecurePassword123!"
        self.user = User.objects.create_user(email=self.email, password=self.password)

    def authenticate(self, url, data):
        return self.client.post(url, data, format="json")


class UserLoginAPIViewTest(BaseAPITestCase):

    def test_login_successful(self):
        response = self.authenticate(
            reverse("user_login"), {"email": self.email, "password": self.password}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertIn("refresh_token", response.data)

    def test_login_invalid_credentials(self):
        response = self.authenticate(
            reverse("user_login"),
            {"email": self.email, "password": "WrongPassword123!"},
        )
        self.assertEqual("e2004", response.data["errorCode"])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_invalid_email_format(self):
        response = self.authenticate(
            reverse("user_login"),
            {"email": "invalid-email", "password": self.password},
        )
        self.assertEqual("e2002", response.data["errorCode"])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_invalid_password_format(self):
        response = self.authenticate(
            reverse("user_login"), {"email": self.email, "password": "short"}
        )
        self.assertEqual("e2003", response.data["errorCode"])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_missing_fields(self):
        response = self.authenticate(reverse("user_login"), {"email": self.email})
        self.assertEqual("e2001", response.data["errorCode"])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_missing_fields(self):
        response = self.authenticate(reverse("user_login"), {"password": self.password})
        self.assertEqual("e2000", response.data["errorCode"])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AdminModelTest(TestCase):

    def setUp(self):
        self.email = "admin@example.com"
        self.password = "AdminPassword123"
        self.admin_user = Admin.objects.create_user(
            email=self.email, password=self.password
        )

    def test_admin_model(self):
        admin = Admin.objects.get(email=self.email)
        self.assertEqual(admin.email, self.email)
        self.assertTrue(admin.check_password(self.password))
        self.assertTrue(admin.status)
        self.assertIsNotNone(admin.created_at)
        self.assertIsNotNone(admin.updated_at)
        self.assertIsNone(admin.username)


class CustomTokenRefreshViewTestCase(BaseAPITestCase):

    def setUp(self):
        super().setUp()
        self.refresh = RefreshToken.for_user(self.user)
        self.valid_refresh_token = str(self.refresh)
        self.invalid_refresh_token = "invalidtoken"
        self.expired_refresh_token = str(self.create_expired_refresh_token())
        self.url = reverse("token_refresh")

    def create_expired_refresh_token(self):

        expired_token = RefreshToken.for_user(self.user)
        expired_token.set_exp(lifetime=timedelta(seconds=-1))
        return expired_token

    def test_refresh_token_required(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["errorCode"], "e404")
        self.assertEqual(response.data["errorMsg"], "refresh-token is required")

    def test_invalid_refresh_token(self):
        response = self.client.post(
            self.url, {"refresh": self.invalid_refresh_token}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["errorCode"], "e405")
        self.assertEqual(
            response.data["errorMsg"], "refresh-token is invalid or expired"
        )

    def test_expired_refresh_token(self):
        response = self.client.post(
            self.url, {"refresh": self.expired_refresh_token}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["errorCode"], "e405")
        self.assertEqual(
            response.data["errorMsg"], "refresh-token is invalid or expired"
        )

    def test_valid_refresh_token(self):
        response = self.client.post(
            self.url, {"refresh": self.valid_refresh_token}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)


class ForgotPasswordAPIViewTest(APITestCase):
    def setUp(self):
        self.url = reverse("forgot_password")
        self.user = Admin.objects.create_user(
            email="test@example.com",
            password="password123",
        )

    @patch("admin_management.views.generate_reset_token")
    @patch("admin_management.views.send_email")
    def test_forgot_password_success(self, mock_send_email, mock_generate_reset_token):
        mock_generate_reset_token.return_value = "dummy_token"
        response = self.client.post(self.url, {"email": self.user.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"], "Password reset link sent successfully"
        )
        mock_send_email.assert_called_once()

    def test_forgot_password_user_not_found(self):
        self.user.delete()
        response = self.client.post(self.url, {"email": "nonexistent@example.com"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2015")


class SendEmailTest(TestCase):
    @patch("server.utils.util_functions.functions.get_template")
    @patch("django.core.mail.EmailMultiAlternatives.send")
    def test_send_email_with_data(self, mock_send, mock_get_template):
        mock_template = mock_get_template.return_value
        mock_template.render.return_value = "Rendered HTML content"

        send_email(
            mail="test@example.com",
            subject="Test Subject",
            template="test_template.html",
            url="/test-url",
            data={"username": "testuser"},
        )

        mock_get_template.assert_called_once_with("test_template.html")
        mock_template.render.assert_called_once_with(
            {
                "url": settings.BASE_URL + "/test-url",
                "username": "testuser",
                "app_name": settings.APP_NAME,
                "token_expiry": settings.RESET_TOKEN_EXPIRY,
            }
        )
        mock_send.assert_called_once()

    @patch("server.utils.util_functions.functions.get_template")
    @patch("django.core.mail.EmailMultiAlternatives.send")
    def test_send_email_without_data(self, mock_send, mock_get_template):
        mock_template = mock_get_template.return_value
        mock_template.render.return_value = "Rendered HTML content"

        send_email(
            mail="test@example.com",
            subject="Test Subject",
            template="template.html",
            url="/test-url",
        )

        mock_get_template.assert_called_once_with("template.html")
        mock_template.render.assert_called_once_with(
            {"url": settings.BASE_URL + "/test-url", "app_name": settings.APP_NAME}
        )
        mock_send.assert_called_once()


class GenerateResetTokenTest(TestCase):

    def assert_token(self, token, email, user_id, expiry_minutes):
        decoded_payload = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        self.assertEqual(decoded_payload["email"], email)
        self.assertEqual(decoded_payload["user_id"], user_id)
        self.assertEqual(decoded_payload["token_type"], "reset_password")
        self.assertEqual(decoded_payload["jti"], "123e4567-e89b-12d3-a456-426614174000")

        expected_exp = datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes)
        actual_exp = datetime.fromtimestamp(decoded_payload["exp"], timezone.utc)
        self.assertAlmostEqual(expected_exp, actual_exp, delta=timedelta(seconds=10))

    @patch("server.utils.util_functions.functions.uuid.uuid4")
    @patch("server.utils.util_functions.functions.config")
    def test_generate_reset_token(self, mock_config, mock_uuid):
        mock_uuid.return_value = "123e4567-e89b-12d3-a456-426614174000"
        email, user_id = "test@example.com", 1

        mock_config.return_value = "10"
        token = generate_reset_token(email, user_id)
        self.assert_token(token, email, user_id, 10)

        mock_config.return_value = "1"
        token = generate_reset_token(email, user_id)
        self.assert_token(token, email, user_id, 1)



class ResetPasswordAPITestCase(APITestCase):
    def setUp(self):
        self.user = Admin.objects.create_user(
            email="testuser@example.com", password="TestPassword123"
        )
        self.url = reverse("reset_password")
        self.token = self.generate_reset_token(self.user.email, self.user.id)
        self.valid_payload = {
            "newPassword": "NewPassword@123",
            "confirmPassword": "NewPassword@123",
        }
        self.invalid_payload = {
            "newPassword": "NewPassword123",
            "confirmPassword": "DifferentPassword123",
        }
        self.null_password_payload = {
            "newPassword": "Password@123",
            "confirmPassword": "",
        }
        self.valid_password = "Password@123"
        self.invalid_password = "invalid-password"

    def generate_reset_token(self, email, user_id):
        refresh = RefreshToken.for_user(self.user)
        payload = {
            "user_id": user_id,
            "email": email,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
            "jti": refresh["jti"],
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

    def test_reset_password_success(self):
        response = self.client.post(
            f"{self.url}?token={self.token}", self.valid_payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Password reset successfully")

    def test_reset_password_invalid_token(self):
        invalid_token = "invalidtoken"
        response = self.client.post(
            f"{self.url}?token={invalid_token}", self.valid_payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data.get("errorCode"), "e406")

    def test_reset_password_expired_token(self):
        expired_token = self.generate_reset_token(self.user.email, self.user.id)
        payload = jwt.decode(expired_token, settings.SECRET_KEY, algorithms=["HS256"])
        payload["exp"] = datetime.now(timezone.utc) - timedelta(minutes=1)
        expired_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        response = self.client.post(
            f"{self.url}?token={expired_token}", self.valid_payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data.get("errorCode"), "e407")

    def test_reset_password_invalid_password_confirmation(self):
        response = self.client.post(
            f"{self.url}?token={self.token}", self.invalid_payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_token_already_used(self):
        jti = jwt.decode(self.token, settings.SECRET_KEY, algorithms=["HS256"])["jti"]
        cache.set(jti, True, timeout=None)
        response = self.client.post(
            f"{self.url}?token={self.token}", self.valid_payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data.get("errorCode"), "e407")

    def test_reset_password_null_password(self):
        response = self.client.post(
            f"{self.url}?token={self.token}", {"newPassword": ""}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("errorCode"), "e2011")

    def test_reset_password_null_confirmpassword(self):
        response = self.client.post(
            f"{self.url}?token={self.token}",
            self.null_password_payload,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("errorCode"), "e2012")

    def test_reset_password_invalid_confirmpassword(self):
        response = self.client.post(
            f"{self.url}?token={self.token}",
            {"newPassword": "Password@122", "confirmPassword": self.invalid_password},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("errorCode"), "e2014")

    def test_reset_password_not_match(self):
        response = self.client.post(
            f"{self.url}?token={self.token}",
            {"newPassword": "Password@1234", "confirmPassword": self.valid_password},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("errorCode"), "e2010")


class DashboardDataTest(TestCase):
    def setUp(self):
        self.client=APIClient()
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
            id=1,
            question_category_name='Original Name',
            status=True
        )
        self.category2 = QuestionCategory.objects.create(
            id=2,
            question_category_name='Original Name 2',
            status=True
        )

        self.valid_student = Student.objects.create(
            id=1,
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_active,
            status=1,
            cgpa = 3,
            no_of_backlogs = 1
        )

        self.exam = Exam.objects.create(
            id = 1,
            exam_name="Valid name",
            exam_date=valid_current_year,
            exam_time="12:00:00",
            exam_duration=60,
            total_questions=50,
            institution=self.institution_active,
        )

        self.question_data = QuestionData.objects.create(
            question="What is the capital of France?",
            question_category_id=self.category1,
            status=1,
        )

        self.feedback = Feedbacks.objects.create(
            rating=4,
            comment='test comment',
            student = self.valid_student,
            status=1
        )

        self.url = reverse('dashboard')

    def test_200_success(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code,status.HTTP_200_OK)

    @patch('admin_management.views.QuestionCategory.objects.filter')
    def test_question_category_does_not_exist(self,mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = QuestionCategory.DoesNotExist
        response = self.client.get(self.url,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    
    @patch('admin_management.views.Institution.objects.filter')
    def test_institution_does_not_exist(self,mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = Institution.DoesNotExist
        response = self.client.get(self.url,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    
    @patch('admin_management.views.QuestionData.objects.filter')
    def test_question_does_not_exist(self,mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = QuestionData.DoesNotExist
        response = self.client.get(self.url,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('admin_management.views.QuestionData.objects.filter')
    def test_student_does_not_exist(self,mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = Student.DoesNotExist
        response = self.client.get(self.url,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    

     
    @patch('admin_management.views.Exam.objects.filter')
    def test_exam_does_not_exist(self,mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = Exam.DoesNotExist
        response = self.client.get(self.url,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('admin_management.views.Feedbacks.objects.filter')
    def test_feedbacks_does_not_exist(self,mock_select_related):
        self.client.force_authenticate(user=self.admin)
        mock_select_related.side_effect = Feedbacks.DoesNotExist
        response = self.client.get(self.url,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)





class AddFeedbackTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_token = generate_token(self,1,1)
        self.invalid_token_no_such_student = generate_token(self,119,1)
        self.invalid_token_no_such_exam = generate_token(self,1,2345)
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
            token = self.valid_token,
            status=1,
            cgpa = 3,
            no_of_backlogs = 1
        )
   
        self.student2 = Student.objects.create(
            id=2,
            name="John Doe",
            email="johndoe2@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_active,
            status=1,
             cgpa = 3,
            no_of_backlogs = 1
        )
        
        self.category1 = QuestionCategory.objects.create(
            id=1,
            question_category_name='Original Name',
            status=True
        )
        self.category2 = QuestionCategory.objects.create(
            id=2,
            question_category_name='Original Name 2',
            status=True
        )
        self.exam = Exam.objects.create(
            id = 1,
            exam_name="Valid name",
            exam_date=valid_current_year,
            exam_time="12:00:00",
            exam_duration=60,
            total_questions=50,
            institution=self.institution_active,
        )
        self.exam_question_category_valid = ExamQuestionCategory.objects.create(
            id=1,
            exam_id=self.exam,
            question_category_id=self.category1,
            number_of_question = 25,
            weightage=50.0
        )
        self.exam_question_category_valid = ExamQuestionCategory.objects.create(
            id=2,
            exam_id=self.exam,
            question_category_id=self.category1,
            number_of_question = 25,
            weightage=50.0
        )

        self.exam_student1 = ExamStudents.objects.create(
            exam_id=self.exam, student_id=self.student1, status_exam_student=2
        )
        self.exam_student2 = ExamStudents.objects.create(
            exam_id=self.exam, student_id=self.student2, status_exam_student=0
        )

        self.valid_url = reverse('add_list_feedback')

    def test_200_ok(self):
        response = self.client.post(f'{self.valid_url}?token='+self.valid_token,{"rating":4,"comment":"Nice"})
        self.assertEqual(response.status_code,status.HTTP_200_OK)
       

    def test_400_invalid_token(self):
        response = self.client.post(f'{self.valid_url}?token=invalid_token',{"rating":5,"comment":"Nice"})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    def test_400_invalid_token_no_student(self):
        response = self.client.post(f'{self.valid_url}?token='+self.invalid_token_no_such_student,{"rating":5,"comment":"Nice"})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    def test_400_exception(self):
        response = self.client.post(f'{self.valid_url}?token='+self.valid_token,{"dsc"},format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)


    def test_200_no_comment(self):
        response = self.client.post(f'{self.valid_url}?token='+self.valid_token,{"rating":5},format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
   

    def test_400_comment_is_not_string(self):
        response = self.client.post(f'{self.valid_url}?token='+self.valid_token,{"comment":1234},format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    def test_400_comment_is_too_small(self):
        response = self.client.post(f'{self.valid_url}?token='+self.valid_token,{"comment":"1"})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    def test_400_comment_is_too_large(self):
        large_comment = 'a' * 2000
        response = self.client.post(f'{self.valid_url}?token='+self.valid_token,{"comment":large_comment})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)


    def test_400_comment_has_blank_space(self):
        response = self.client.post(f'{self.valid_url}?token='+self.valid_token,{"comment":" dfgh"})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    def test_400_no_token(self):
        response = self.client.post(f'{self.valid_url}?token=',{"comment":" dfgh"})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    def test_400_no_exam(self):  
        response = self.client.post(f'{self.valid_url}?token='+self.invalid_token_no_such_exam,{'comment':'dsasdc'})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    def test_400_no_rating(self):
        response = self.client.post(f'{self.valid_url}?token='+self.valid_token,{"comment":"Nice"})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    def test_400_invalid_rating(self):
        response = self.client.post(f'{self.valid_url}?token='+self.valid_token,{"rating":"dsd","comment":"Nice"})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    def test_400_rating_not_in_1_2_3_4_5(self):
        response = self.client.post(f'{self.valid_url}?token='+self.valid_token,{"rating":12,"comment":"Nice"})
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)


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
             cgpa = 3,
            no_of_backlogs = 1
        )
        self.valid_student2 = Student.objects.create(
            id=2,
            name="John Doe",
            email="johndoe2@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_active,
            status=1,
             cgpa = 3,
            no_of_backlogs = 1
        )
        self.feedback = Feedbacks.objects.create(
            rating=5,
            comment='test comment',
            student = self.valid_student,
            status=1
        )
        self.feedback2 = Feedbacks.objects.create(
            rating=1,
            comment='test comment',
            student = self.valid_student,
            status=1
        )

        self.url = reverse('add_list_feedback')

    def test_200_ok(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

     
    @patch('admin_management.views.Feedbacks.objects.filter')
    def test_feedbacks_does_not_exist(self,mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Feedbacks.DoesNotExist
        response = self.client.get(self.url,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('admin_management.views.Feedbacks.objects.filter')
    def test_exam_does_not_exist(self,mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Exception('Forced Exception')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_200_filter_is_given(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url,{'rating':1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_400_filter_is_invalid(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url,{'rating':'a'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_filter_is_not_between_1_and_5(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url,{'rating':6})
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
            id=1,
            question_category_name='Original Name',
            status=True
        )
        self.exam = Exam.objects.create(
            id = 1,
            exam_name="Valid name",
            exam_date=valid_current_year,
            exam_time="12:00:00",
            exam_duration=60,
            total_questions=50,
            institution=self.institution_active,
        )

        self.valid_url_exam = reverse('dropdown_list',kwargs={"required_dropdown": 'exam'})
        self.valid_url_institution = reverse('dropdown_list',kwargs={"required_dropdown": 'institution'})
        self.valid_url_question_category = reverse('dropdown_list',kwargs={"required_dropdown": 'question_category'})
        self.invalid_url = reverse('dropdown_list',kwargs={"required_dropdown": '12'})


    def test_200_exam_ok(self):
        
        response = self.client.get(self.valid_url_exam,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_200_institution_ok(self):
       
        response = self.client.get(self.valid_url_institution,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_200_question_category_ok(self):
        
        response = self.client.get(self.valid_url_question_category,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('admin_management.views.Exam.objects.filter')
    def test_exam_does_not_exist(self,mock_filter):
        
        mock_filter.side_effect = Exam.DoesNotExist
        response = self.client.get(self.valid_url_exam,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('admin_management.views.Institution.objects.filter')
    def test_institution_does_not_exist(self,mock_filter):
       
        mock_filter.side_effect = Institution.DoesNotExist
        response = self.client.get(self.valid_url_institution,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('admin_management.views.QuestionCategory.objects.filter')
    def test_question_category_does_not_exist(self,mock_filter):
        
        mock_filter.side_effect = QuestionCategory.DoesNotExist
        response = self.client.get(self.valid_url_question_category,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    @patch('admin_management.views.QuestionCategory.objects.filter')
    def test_exception(self,mock_filter):
       
        mock_filter.side_effect = Exception('forced Exception')
        response = self.client.get(self.valid_url_question_category,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    
    def test_invalid_path_param(self):
        
        response = self.client.get(self.invalid_url,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



        




        