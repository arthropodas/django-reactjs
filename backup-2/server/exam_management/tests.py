from django.test import TestCase
from decouple import config
import jwt
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch, MagicMock
from admin_management.models import Admin
from question_category_management.models import QuestionCategory
from institution_management.models import Institution
from student_management.models import Student
from .models import (
    Exam,
    QuestionData,
    ExamLocations,
)
from questionnaire_management.models import Questionnaire
from datetime import datetime
from django.core.exceptions import ValidationError
from django.test import TestCase
from unittest.mock import patch
from .models import Exam
from question_management.models import QuestionData, Options, QuestionImage
from jwt.exceptions import InvalidTokenError
from exam_batch_management.models import StudentBatchMapping, Batch
from questionnaire_management.models import Questionnaire, QuestionnaireQuestions
from datetime import date, time
from django.core.files.uploadedfile import SimpleUploadedFile
import os


import pytz
from django.utils.timezone import datetime, timedelta


class CreateExamTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.url = reverse("exam_create_list")
        self.questionnaire = Questionnaire.objects.create(
            questionnaire_name="Sample Questionnaire", status=1
        )
        self.timezone = pytz.timezone("Asia/Kolkata")
        self.current_date = datetime.now(self.timezone).strftime("%Y-%m-%d")
        self.past_time = (datetime.now(self.timezone) + timedelta(hours=2)).strftime(
            "%H:%M:%S"
        )
        self.questionnaire_instance = Questionnaire.objects.create(
            id=3, questionnaire_name="Test Questionnaire", status=1
        )
        self.exam_location = ExamLocations.objects.create(location_name="kochi", status=1)

        self.exam = Exam.objects.create(
            id=1,
            exam_name="duplicate exam name",
            exam_date=self.current_date,
            exam_time=self.past_time,
            exam_duration=60,
            exam_location=self.exam_location,
            questionnaire=self.questionnaire_instance,
            status=1,
        )

    def test_400_exam_name_is_required(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, {}, format="json")
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1029")

    def test_400_exam_name_is_invalid(self):
        valid_data = {}
        self.client.force_authenticate(user=self.admin)
        valid_data["examName"] = 23234567
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1030")

    def test_400_name_too_small(self):
        valid_data = {}
        self.client.force_authenticate(user=self.admin)
        valid_data["examName"] = "a"
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1031")

    def test_400_name_too_large(self):
        valid_data = {}
        self.client.force_authenticate(user=self.admin)
        valid_data["examName"] = "a" * 200
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1032")

    def test_400_space_handling_in_exam_name(self):
        valid_data = {}
        self.client.force_authenticate(user=self.admin)
        valid_data["examName"] = "abvsf   "
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1033")

    def test_400_exam_location_is_required(self):
        valid_data = {"examName": "valid name"}
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, valid_data, format="json")
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e4300")

    def test_400_exam_location_is_empty(self):
        valid_data = {"examName": "valid name", "examLocation": ""}
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, valid_data, format="json")
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e4301")

    def test_400_invalid_exam_date(self):
        valid_data = {}
        self.client.force_authenticate(user=self.admin)
        valid_data["examName"] = "placement 2024"
        valid_data["examLocation"] = "kochi"
        valid_data["examDate"] = "23456789"
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1034")

    def test_400_no_exam_date(self):
        valid_data = {}
        self.client.force_authenticate(user=self.admin)
        valid_data["examName"] = "placement 2024"
        valid_data["examLocation"] = "kochi"
        valid_data["examDate"] = ""
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1040")

    def test_400_past_year(self):
        valid_data = {"examName": "valid name", "examLocation": "kochi"}
        self.client.force_authenticate(user=self.admin)
        current_year = datetime.now().year
        past_year = datetime(current_year - 1, 8, 30)

        valid_data["examDate"] = past_year.strftime("%Y-%m-%d")
        response = self.client.post(self.url, valid_data, format="json")
        response.render()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1050")

    def test_400_exam_time_is_required(self):
        valid_data = {"examName": "valid name", "examLocation": "kochi"}
        self.client.force_authenticate(user=self.admin)
        valid_data["examDate"] = self.current_date
        valid_data["examTime"] = ""
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1041")

    def test_400_exam_time_is_invalid(self):
        valid_data = {"examName": "valid name", "examLocation": "kochi"}
        self.client.force_authenticate(user=self.admin)
        valid_data["examDate"] = self.current_date
        valid_data["examTime"] = "2345678"
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1042")

    def test_400_exam_duration_is_required(self):
        valid_data = {"examName": "valid name", "examLocation": "kochi"}
        self.client.force_authenticate(user=self.admin)
        valid_data["examDate"] = self.current_date
        valid_data["examTime"] = self.past_time
        valid_data["isPool"] = True
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1045")

    def test_400_exam_duration_type(self):
        valid_data = {"examName": "valid name", "examLocation": "kochi"}
        self.client.force_authenticate(user=self.admin)
        valid_data["examDate"] = self.current_date
        valid_data["examTime"] = self.past_time
        valid_data["isPool"] = True
        valid_data["examDuration"] = "60"
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1046")
        
    def test_400_duplicate_exam_name(self):
        valid_data = {
            "examName": "duplicate exam name",
            "examLocation": "Test Location",
            "examDate": self.current_date,
            "examTime": self.past_time,  # Exam time in the past
            "examDuration": 60,
            "questionnaireId": self.questionnaire.id,
            "isPool":True
        }
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    @patch("exam_management.views.Questionnaire.objects.get")
    def test_400_questionnaire_not_found(self, mock_get):
        valid_data = {
            "examName": "Past Exam Time",
            "examLocation": "Test Location",
            "examDate": self.current_date,
            "examTime": self.past_time,  # Exam time in the past
            "examDuration": 60,
            "questionnaireId": 2,
            "isPool":True
        }
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Questionnaire.DoesNotExist("Forced Exception")
        response = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_200_success_created_exam(self):

        valid_data = {
            "examName": "Past Exam Time",
            "examLocation": "Test Location",
            "examDate": self.current_date,
            "examTime": self.past_time,  # Exam time in the past
            "examDuration": 60,
            "questionnaireId": self.questionnaire.id,
            "isPool":True
        }
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, valid_data, format="json")
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ListExams(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        timezone = pytz.timezone("Asia/Kolkata")
        current_date = datetime.now(timezone).strftime("%Y-%m-%d")
        past_time = (datetime.now(timezone) + timedelta(hours=2)).strftime("%H:%M:%S")
        self.questionnaire_instance = Questionnaire.objects.create(
            id=1, questionnaire_name="Test Questionnaire", status=1
        )
        self.exam_location = ExamLocations.objects.create(id=1,location_name="kochi", status=1)

        self.exam = Exam.objects.create(
            id=1,
            exam_name="Valid name",
            exam_date=current_date,
            exam_time=past_time,
            exam_duration=60,
            exam_location=self.exam_location,
            questionnaire=self.questionnaire_instance,
            status=1,
        )

        self.url = reverse("exam_create_list")

    def test_200_get_all_exam_details(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, format="json")
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_200_filter_with_year_and_location(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"year": "2024", "examLocation": self.exam_location.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        
    def test_200_filter_with_year(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"year": "2024"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_200_filter_with_location(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"examLocation": self.exam_location.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_200_filter_with_questionnaire_id(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"questionnaireId": self.questionnaire_instance.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_200_filter_with_search(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"searchTerm": self.exam.exam_name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_400_filter_with_invalid_year(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"year": "invalid year"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_filter_with_invalid_questionnaire(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {"questionnaireId": "invalid questionnaire"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
        
        


class EditExamDetails(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )

        timezone = pytz.timezone("Asia/Kolkata")
        self.current_date = datetime.now(timezone).strftime("%Y-%m-%d")
        self.past_time = (datetime.now(timezone) + timedelta(hours=2)).strftime("%H:%M:%S")
        self.questionnaire_instance = Questionnaire.objects.create(
            id=1, questionnaire_name="Test Questionnaire", status=1
        )
        self.exam_location = ExamLocations.objects.create(location_name="kochi", status=1)

        self.exam = Exam.objects.create(
            id=1,
            exam_name="Valid name",
            exam_date=self.current_date,
            exam_time=self.past_time,
            exam_duration=60,
            exam_location=self.exam_location,
            questionnaire=self.questionnaire_instance,
            status=1,
        )

        self.exam2 = Exam.objects.create(
            id=2,
            exam_name="Valid name",
            exam_date=self.current_date,
            exam_time=self.past_time,
            exam_duration=60,
            exam_location=self.exam_location,
            questionnaire=self.questionnaire_instance,
            status=1,
            status_of_exam=2,
        )
        
        self.started_exam = Exam.objects.create(
            id=3,
            exam_name="Started exam",
            exam_date=self.current_date,
            exam_time=self.past_time,
            exam_duration=60,
            exam_location=self.exam_location,
            questionnaire=self.questionnaire_instance,
            status=1,
            status_of_exam=1,
        )

        self.completed_exam_url = reverse(
            "exam_edit_delete_get_by_id", kwargs={"exam_id": self.exam2.id}
        )
        

        self.valid_data = {
            "examStatus": 1,
        }

        self.valid_data_edit = {
            "examName": "Updated Exam Name",
            "examLocation": "Updated Location",
            "examDate": self.current_date,
            "examTime": self.past_time,
            "examDuration": 90,
            "questionnaireId": self.questionnaire_instance.id,
            "isPool":True
        }

        self.edit_exam_url = reverse(
            "exam_edit_delete_get_by_id", kwargs={"exam_id": self.exam.id}
        )

    def test_200_success(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(
            self.edit_exam_url, self.valid_data_edit, format="json"
        )
        response.render()
        self.assertEqual(response.status_code, 200)
        
    def test_200_success_without_exam_location(self):
        self.client.force_authenticate(user=self.admin)
        data = {
            "examName": "Exam Name",
            "examLocation": "Kottayam",
            "examDate": self.current_date,
            "examTime": self.past_time,
            "examDuration":10,
            "questionnaireId": self.questionnaire_instance.id,
            "isPool":True
        }
        response = self.client.put(
            self.edit_exam_url,data, format="json"
        )
        response.render()
        self.assertEqual(response.status_code, 200)

    def test_200_delete_exam_by_id(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(self.edit_exam_url, self.valid_data, format="json")
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_400_exam_does_not_exist(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            reverse("exam_edit_delete_get_by_id", kwargs={"exam_id": 65432}),
            self.valid_data,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1055")

    def test_exception(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(self.edit_exam_url, {"asdcds"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1010")

    def test_400_completed_exam(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            self.completed_exam_url, {"examStatus": 2}, format="json"
        )
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1062")

    def test_200_cancel_exam(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            self.edit_exam_url, {"examStatus": 3}, format="json"
        )
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthorised(self):
        response = self.client.patch(self.edit_exam_url, self.valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_200_success_get_exam_by_id(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.edit_exam_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_400_exam_not_found(self):

        self.exam_not_found_url = reverse(
            "exam_edit_delete_get_by_id", kwargs={"exam_id": 10}
        )
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.exam_not_found_url, format="json")
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1055")
        
    @patch("exam_management.views.Questionnaire.objects.get")
    def test_400_questionnaire_not_found(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Questionnaire.DoesNotExist("Forced Exception")
        response = self.client.put(self.edit_exam_url, self.valid_data_edit, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch("exam_management.views.Exam.objects.get")
    def test_400_exam_not_found(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Exam.DoesNotExist("Forced Exception")
        response = self.client.put(self.edit_exam_url, self.valid_data_edit, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_400_exam_duration_is_required(self):
        self.client.force_authenticate(user=self.admin)
        data = {
            "examName": "Updated Exam Name",
            "examLocation": "Updated Location",
            "examDate": self.current_date,
            "examTime": self.past_time,
            "questionnaireId": self.questionnaire_instance.id,
            "isPool":True
        }

        response = self.client.put(self.edit_exam_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e1045")
        
    

class GetExamDetails(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        timezone = pytz.timezone("Asia/Kolkata")
        self.current_date = datetime.now(timezone).strftime("%Y-%m-%d")
        self.past_time = (datetime.now(timezone) + timedelta(hours=2)).strftime("%H:%M:%S")
        self.questionnaire_instance = Questionnaire.objects.create(
            id=1, questionnaire_name="Test Questionnaire", status=1
        )
        self.exam_location = ExamLocations.objects.create(location_name="kochi", status=1)

        self.exam = Exam.objects.create(
            id=1,
            exam_name="Valid name",
            exam_date=self.current_date,
            exam_time=self.past_time,
            exam_duration=60,
            exam_location=self.exam_location,
            questionnaire=self.questionnaire_instance,
            status=1,
        )
        self.exam_details_url = reverse(
            "exam_edit_delete_get_by_id", kwargs={"exam_id": self.exam.id}
        )
        
    def test_200_get_exam_details(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.exam_details_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    @patch("exam_management.views.Exam.objects.prefetch_related")
    def test_400_exam_doesnotexist(self,mock_prefetch_related):
        self.client.force_authenticate(user=self.admin)
        mock_prefetch_related.side_effect = Exam.DoesNotExist()
        response = self.client.get(self.exam_details_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch("exam_management.views.Exam.objects.prefetch_related")
    def test_400_exception(self,mock_prefetch_related):
        self.client.force_authenticate(user=self.admin)
        mock_prefetch_related.side_effect = Exception()
        response = self.client.get(self.exam_details_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        

class CountOfQuestionsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.category_has_question = QuestionCategory.objects.create(
            id=3,
            question_category_name='Has Question',
            status=True
        )
        self.question_data = QuestionData.objects.create(
            question="What is the capital of France?",
            question_category_id=self.category_has_question,
        )
        self.url = reverse("count_of_questions_of_each_category")
        
    def test_200_success(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        
    @patch("exam_management.views.QuestionCategory.objects.annotate")
    def test_400_question_category_does_not_exist(self,mock_annotate):
        self.client.force_authenticate(user=self.admin)
        mock_annotate.side_effect = QuestionCategory.DoesNotExist()
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch("exam_management.views.QuestionCategory.objects.annotate")
    def test_400_question_does_not_exist(self,mock_annotate):
        self.client.force_authenticate(user=self.admin)
        mock_annotate.side_effect = QuestionData.DoesNotExist()
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    
    @patch("exam_management.views.QuestionCategory.objects.annotate")
    def test_400_exception(self,mock_annotate):
        self.client.force_authenticate(user=self.admin)
        mock_annotate.side_effect = Exception()
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
class QuestionPaperSendViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()


        # Create QuestionnaireQuestions
        self.category_has_question = QuestionCategory.objects.create(
            id=3,
            question_category_name='Has Question',
            status=True
        )
        self.question_data = QuestionData.objects.create(
            question="What is 2 + 2?",
            question_category_id=self.category_has_question,
            question_type=QuestionData.TRUEORFALSE,
            question_difficulty_level=QuestionData.EASY,
            status=True,
        )
        

        # Create mock Options instances for the question
        self.option1 = Options.objects.create(
            option="True",
            question_id=self.question_data,
            is_correct=True,
            status=True,
        )
        self.option2 = Options.objects.create(
            option="False",
            question_id=self.question_data,
            is_correct=False,
            status=True,
        )
        
        self.image_file = SimpleUploadedFile(
            name="test_image.jpg",
            content=b"dummy_image_data",
            content_type="image/jpeg",
        )
        
        self.question_with_image = QuestionData.objects.create(
            question="What is 2 + 2?",
            question_category_id=self.category_has_question,
            question_type=QuestionData.MCQ,
            question_difficulty_level=QuestionData.EASY,
            status=True,
        )
        
        self.question_image = QuestionImage.objects.create(
            question_id=self.question_with_image,
            question_image=self.image_file,
            status=True,
        )
        
        self.option1 = Options.objects.create(
            option="4",
            question_id=self.question_with_image,
            is_correct=True,
            status=True,
        )
        self.option2 = Options.objects.create(
            option="3",
            question_id=self.question_with_image,
            is_correct=False,
            status=True,
        )
        self.option3 = Options.objects.create(
            option="5",
            question_id=self.question_with_image,
            is_correct=False,
            status=True,
        )
        
        self.option4 = Options.objects.create(
            option="6",
            question_id=self.question_with_image,
            is_correct=False,
            status=True,
        )
        
        self.question_mcs = QuestionData.objects.create(
            question="What is 2 + 2?",
            question_category_id=self.category_has_question,
            question_type=QuestionData.MCS,
            question_difficulty_level=QuestionData.EASY,
            status=True,
        )
        
        
        self.option1 = Options.objects.create(
            option="4",
            question_id=self.question_mcs,
            is_correct=True,
            status=True,
        )
        self.option2 = Options.objects.create(
            option="3",
            question_id=self.question_mcs,
            is_correct=True,
            status=True,
        )
        self.option3 = Options.objects.create(
            option="5",
            question_id=self.question_mcs,
            is_correct=True,
            status=True,
        )
        
        self.option4 = Options.objects.create(
            option="6",
            question_id=self.question_mcs,
            is_correct=True,
            status=True,
        )
        
        self.questionnaire = Questionnaire.objects.create(
            id=1,questionnaire_name="Sample Questionnaire"
        )
        
        self.questionnaire_question1 = QuestionnaireQuestions.objects.create(
            questionnaire=self.questionnaire, question=self.question_data
        )
        
        self.questionnaire_question2 = QuestionnaireQuestions.objects.create(
            questionnaire=self.questionnaire, question=self.question_with_image
        )
        self.questionnaire_question2 = QuestionnaireQuestions.objects.create(
            questionnaire=self.questionnaire, question=self.question_mcs
        )
        self.institution_has_student = Institution.objects.create(
            id=3,
            institution_name="Active Institution",
            institution_code="Active123",
            coordinator_name="name two",
            coordinator_email="emailthree@gmail.com",
            coordinator_phone="1234567893",
            status=True,
        )
        self.student = Student.objects.create(
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_has_student,
            cgpa = "2",
            no_of_backlogs="4",
            course=Student.BTECH_CSE,
            status=1,
        )
        
        self.exam_location = ExamLocations.objects.create(
            location_name="Central Hall",
            status=1,  # Active
        )
        
        self.exam = Exam.objects.create(
            exam_name="Math Exam",
            exam_date=date(2024, 12, 10),
            exam_time=time(10, 0),
            exam_duration=90,
            status=1,  # Active
            exam_location=self.exam_location,
            status_of_exam=Exam.STARTED,
            questionnaire=self.questionnaire,
            cut_of_mark=50.0,
            is_pool=False,
        )
        
        self.batch1 = Batch.objects.create(
            exam=self.exam,
            uuid="BATCH001",
            batch_name="Morning Batch",
            count_of_students=30,
            batch_status=Batch.OPEN,
        )
        
        self.mapping = StudentBatchMapping.objects.create(
            student=self.student,
            exam=self.exam,
            batch=self.batch1,
            student_status=StudentBatchMapping.SCHEDULED,
            exam_start_time=None,
            exam_end_time=None,
        )
        
        
        self.url = reverse("question-paper-token")
        self.mock_exam = MagicMock(
            id=1,
            exam_name="Sample Exam",
            exam_duration=60,
            questionnaire_id=1,
        )
        self.mock_response = MagicMock(
            id=1,
            student_status=0,
            exam_start_time=None,
        )
        
    def generate_token(self, student_id, batch_id, expiry_minutes=30):
        """Generate a JWT token for testing."""
        payload = {
            "student_id": student_id,
            "batch_id": batch_id,
            "exp": datetime.utcnow() + timedelta(minutes=expiry_minutes),
        }
        return jwt.encode(payload, config('SECRET_KEY'), algorithm="HS256")

    def test_successful_exam_start(self):
        # Generate valid token
        token = self.generate_token(
            student_id=self.mapping.student_id,
            batch_id=self.mapping.batch_id,
        )

        # Make GET request with valid token
        response = self.client.get(self.url, {"token": token})
        self.assertEqual(response.status_code, 200)

    @patch("exam_management.views.decode_token_from_query_params")
    def test_invalid_token_error(self, mock_decode_token):
        """Test invalid token error"""
        mock_decode_token.side_effect = InvalidTokenError
        response = self.client.get(self.url, {"token": "invalid_token"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("exam_management.views.decode_token_from_query_params")
    @patch("exam_management.views.validate_exam_status")
    def test_exam_not_found(self, mock_validate_exam, mock_decode_token):
        """Test when the exam is not found"""
        mock_decode_token.return_value = {
            "decoded_token": {"response": self.mock_response, "exam": None}
        }
        mock_validate_exam.side_effect = Exam.DoesNotExist
        response = self.client.get(self.url, {"token": "mock_token"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("exam_management.views.decode_token_from_query_params")
    @patch("questionnaire_management.models.QuestionnaireQuestions.objects.filter")
    def test_no_questions_in_questionnaire(
        self, mock_filter_questions, mock_decode_token
    ):
        """Test no questions in the questionnaire"""
        mock_decode_token.return_value = {
            "decoded_token": {
                "response": self.mock_response,
                "exam": self.mock_exam,
            }
        }
        mock_filter_questions.return_value.exists.return_value = False
        response = self.client.get(self.url, {"token": "mock_token"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("exam_management.views.decode_token_from_query_params")
    @patch("exam_management.views.validate_batch_student")
    def test_student_batch_mapping_not_found(
        self, mock_validate_batch, mock_decode_token
    ):
        """Test student batch mapping does not exist"""
        mock_decode_token.return_value = {
            "decoded_token": {
                "response": self.mock_response,
                "exam": self.mock_exam,
            }
        }
        mock_validate_batch.side_effect = StudentBatchMapping.DoesNotExist
        response = self.client.get(self.url, {"token": "mock_token"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("exam_management.views.decode_token_from_query_params")
    def test_unexpected_exception(self, mock_decode_token):
        """Test unexpected exception handling"""
        mock_decode_token.side_effect = Exception("Unexpected error")
        response = self.client.get(self.url, {"token": "mock_token"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch("exam_management.views.QuestionData.objects.get")
    def test_question_data_not_found(self, mock_get_question_data):
        """Test when question data is not found"""
        token = self.generate_token(
            student_id=self.mapping.student_id,
            batch_id=self.mapping.batch_id,
        )
        mock_get_question_data.side_effect = QuestionData.DoesNotExist()
        response = self.client.get(self.url, {"token": token})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch("exam_management.views.QuestionnaireQuestions.objects.filter")
    def test_questionnaire_questions_not_found(self, mock_filter_questions):
        """Test when questionnaire questions are not found"""
        token = self.generate_token(
            student_id=self.mapping.student_id,
            batch_id=self.mapping.batch_id,
        )
        mock_filter_questions.side_effect = QuestionnaireQuestions.DoesNotExist()
        response = self.client.get(self.url, {"token": token})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
    @patch("exam_management.views.QuestionnaireQuestions.objects.filter")
    def test_exception(self, mock_filter_questions):
        """Test when questionnaire questions are not found"""
        token = self.generate_token(
            student_id=self.mapping.student_id,
            batch_id=self.mapping.batch_id,
        )
        mock_filter_questions.side_effect = Exception()
        response = self.client.get(self.url, {"token": token})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch("exam_management.views.Options.objects.filter")
    def test_options_not_found(self, mock_filter):
        token = self.generate_token(
            student_id=self.mapping.student_id,
            batch_id=self.mapping.batch_id,
        )
        mock_filter.side_effect = Options.DoesNotExist()
        response = self.client.get(self.url, {"token": token})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        


class CountOfStudentsInExamTestCase(TestCase):
    def setUp(self):
        # Initialize API Client
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        # Create mock Exam instance
        self.exam_location = ExamLocations.objects.create(
            location_name="Central Hall",
            status=1,  # Active
        )
        self.questionnaire = Questionnaire.objects.create(
            id=1,questionnaire_name="Sample Questionnaire"
        )
        
        self.exam = Exam.objects.create(
            id=1,
            exam_name="Math Exam",
            exam_date=date(2024, 12, 10),
            exam_time=time(10, 0),
            exam_duration=90,
            status=1,  # Active
            exam_location=self.exam_location,
            status_of_exam=Exam.STARTED,
            questionnaire=self.questionnaire,
            cut_of_mark=50.0,
            is_pool=False,
        )
        
        self.exam_which_has_no_student = Exam.objects.create(
            id=2,
            exam_name="no student Exam",
            exam_date=date(2024, 12, 10),
            exam_time=time(10, 0),
            exam_duration=90,
            status=1,  # Active
            exam_location=self.exam_location,
            status_of_exam=Exam.STARTED,
            questionnaire=self.questionnaire,
            cut_of_mark=50.0,
            is_pool=False,
        )
        self.institution_has_student = Institution.objects.create(
            id=3,
            institution_name="Active Institution",
            institution_code="Active123",
            coordinator_name="name two",
            coordinator_email="emailthree@gmail.com",
            coordinator_phone="1234567893",
            status=True,
        )
        # Create mock Student instances
        self.student = Student.objects.create(
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_has_student,
            cgpa = "2",
            no_of_backlogs="4",
            course=Student.BTECH_CSE,
            status=1,
        )

        # Create mock StudentBatchMapping instances
        self.batch1 = Batch.objects.create(
            exam=self.exam,
            uuid="BATCH001",
            batch_name="Morning Batch",
            count_of_students=30,
            batch_status=Batch.OPEN,
        )
        
        self.mapping = StudentBatchMapping.objects.create(
            student=self.student,
            exam=self.exam,
            batch=self.batch1,
            student_status=StudentBatchMapping.SCHEDULED,
            exam_start_time=None,
            exam_end_time=None,
        )
        
        self.valid_url = reverse("count_of_students",kwargs={"pk": self.exam.id})
        self.no_students_in_exam = reverse("count_of_students",kwargs={"pk": self.exam_which_has_no_student.id})
        
    def test_200_success(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.valid_url, format='json')
        self.assertEqual(response.status_code, 200)
    
    def test_200_no_students_in_exam(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.no_students_in_exam, format='json')
        self.assertEqual(response.status_code, 200)
    
        
    @patch("exam_management.views.StudentBatchMapping.objects.filter")
    def test_400_no_student_mapping(self,mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = StudentBatchMapping.DoesNotExist()
        response = self.client.get(self.valid_url, format='json')
        self.assertEqual(response.status_code, 400)
        
        
    @patch("exam_management.views.StudentBatchMapping.objects.filter")
    def test_400_exception(self,mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Exception()
        response = self.client.get(self.valid_url, format='json')
        self.assertEqual(response.status_code, 400)
        
        
        
        
class ExamReportViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        # Create mock Exam instance
        self.exam_location = ExamLocations.objects.create(
            location_name="Central Hall",
            status=1,  # Active
        )
        self.questionnaire = Questionnaire.objects.create(
            id=1,questionnaire_name="Sample Questionnaire"
        )
        
        self.exam = Exam.objects.create(
            id=1,
            exam_name="Math Exam",
            exam_date=date(2024, 12, 10),
            exam_time=time(10, 0),
            exam_duration=90,
            status=1,  # Active
            exam_location=self.exam_location,
            status_of_exam=Exam.COMPLETED,
            questionnaire=self.questionnaire,
            cut_of_mark=50.0,
            is_pool=False,
        )
        
        self.exam_not_completed = Exam.objects.create(
            id=2,
            exam_name="Not Completed Exam",
            exam_date=date(2024, 12, 10),
            exam_time=time(10, 0),
            exam_duration=90,
            status=1,  # Active
            exam_location=self.exam_location,
            status_of_exam=Exam.STARTED,
            questionnaire=self.questionnaire,
            cut_of_mark=50.0,
            is_pool=False,
        )
        
        self.institution_has_student = Institution.objects.create(
            id=3,
            institution_name="Active Institution",
            institution_code="Active123",
            coordinator_name="name two",
            coordinator_email="emailthree@gmail.com",
            coordinator_phone="1234567893",
            status=True,
        )
        # Create mock Student instances
        self.student = Student.objects.create(
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year="2023",
            institution=self.institution_has_student,
            cgpa = "2",
            no_of_backlogs="4",
            course=Student.BTECH_CSE,
            status=1,
        )

        # Create mock StudentBatchMapping instances
        self.batch1 = Batch.objects.create(
            exam=self.exam,
            uuid="BATCH001",
            batch_name="Morning Batch",
            count_of_students=30,
            batch_status=Batch.OPEN,
        )
        
        self.mapping = StudentBatchMapping.objects.create(
            student=self.student,
            exam=self.exam,
            batch=self.batch1,
            student_status=StudentBatchMapping.SCHEDULED,
            exam_start_time=None,
            exam_end_time=None,
        )
        
        self.valid_url = reverse("exam-report",kwargs={"pk": self.exam.id})
        self.not_completed_url = reverse("exam-report",kwargs={"pk": self.exam_not_completed.id})
        
        
        
    def test_200_ok(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.valid_url, format='json')
        self.assertEqual(response.status_code, 200)
        
    def test_400_exam_not_completed(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.not_completed_url,format='json')
        self.assertEqual(response.status_code, 400)
        
    @patch("exam_management.views.Exam.objects.get")
    def test_exam_not_found(self,mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Exam.DoesNotExist()
        response = self.client.get(self.valid_url, format='json')
        self.assertEqual(response.status_code, 404)
        
        
    @patch("exam_management.views.Exam.objects.get")
    def test_exception(self,mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Exception()
        response = self.client.get(self.valid_url, format='json')
        self.assertEqual(response.status_code, 400)
    
        
        
        
        
        
        
        
        
        
        
        
    