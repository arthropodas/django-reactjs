from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIRequestFactory, force_authenticate
from admin_management.models import Admin
from rest_framework import status
from django.conf import settings
from .views import ShortlistStudents, ExamCriteriaView
from exam_management.models import Exam, ExamLocations, ExamCriteria
from questionnaire_management.models import Questionnaire, QuestionnaireQuestions
from student_management.models import Student
from institution_management.models import Institution
from exam_batch_management.models import StudentBatchMapping, Batch
from valuation_management.models import QuestionCategoryResponse
from question_category_management.models import QuestionCategory
from question_management.models import QuestionData, Options
import json
from rest_framework.response import Response
from unittest.mock import patch


class ShortlistStudentViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.url = reverse("shortlist-students", args=[1000])
        self.view = ShortlistStudents.as_view()

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

        self.student = Student.objects.create(
            name="Test Student",
            email="XXXXXXXXXXXXXX",
            phone="1234567890",
            pass_out_year="2024",
            institution=self.institution,
            cgpa=8.5,
            no_of_backlogs=0,
            course=1,
        )

        self.exam_data = Exam.objects.create(
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
            uuid="Test10",
            count_of_students="0",
            batch_status=1,
            exam=self.exam_data,
        )
        self.student_batch_mapping = StudentBatchMapping.objects.create(
            student=self.student,
            exam=self.exam_data,
            batch=self.batch,
            student_status=2,
            correct_count=2,
        )

        self.question_category = QuestionCategory.objects.create(
            question_category_name="Test Category",
        )

        self.category_level_1 = QuestionCategoryResponse.objects.create(
            question_difficulty_level=1,
            correct_answer_count=1,
            response=self.student_batch_mapping,
            category=self.question_category,
        )

        self.category_level_2 = QuestionCategoryResponse.objects.create(
            question_difficulty_level=2,
            correct_answer_count=1,
            response=self.student_batch_mapping,
            category=self.question_category,
        )

        self.question_data = QuestionData.objects.create(
            question="What is the capital of France?",
            question_category_id=self.question_category,
        )

        self.wrong_option = Options.objects.create(
            question_id=self.question_data,
            option=json.dumps(["abc", "xyz", "pqr", "lmn"]),
            is_correct=0,
        )
        self.correct_option = Options.objects.create(
            question_id=self.question_data, option=json.dumps(["abc"]), is_correct=1
        )

        self.questionnaire_question = QuestionnaireQuestions.objects.create(
            questionnaire=self.questionnaire,
            question=self.question_data,
        )

    def test_list_all_students(self):

        request = self.factory.get(self.url)
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_exam_not_completed(self):
        self.exam_not_completed = Exam.objects.create(
            exam_name="Test Exam",
            exam_location=self.exam_location,
            exam_date="2024-01-01",
            exam_time="12:00:00",
            exam_duration=60,
            questionnaire=self.questionnaire,
            is_pool=True,
            status_of_exam=1,
        )

        request = self.factory.get(self.url)

        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_not_completed.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e4607")

    def test_exam_not_found(self):

        request = self.factory.get(self.url)

        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=10)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3900")

    def test_shortlist_students_cut_off_only(self):
        request = self.factory.post(
            self.url, {"cut_off": 1, "action_value": 0}, format="json"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["shortlisted_students"]), 1)

    def test_shortlist_students_cut_off_only_empty_list(self):
        request = self.factory.post(
            self.url, {"cut_off": 4, "action_value": 0}, format="json"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e4703")

    def test_send_email_shortlist_students_cut_off_only(self):
        request = self.factory.post(
            self.url, {"cut_off": 1, "action_value": 1}, format="json"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_shortlist_students_category_only(self):
        request = self.factory.post(
            self.url,
            {
                "action_value": 0,
                "category": [
                    {
                        "category_id": self.question_category.id,
                        "cut_off": 1,
                        "question_level": 1,
                    }
                ],
            },
            format="json",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_send_email_shortlist_students_category_only(self):
        request = self.factory.post(
            self.url,
            {
                "action_value": 1,
                "category": [
                    {
                        "category_id": self.question_category.id,
                        "cut_off": 1,
                        "question_level": 1,
                    }
                ],
            },
            format="json",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_shortlist_students_category_wise_criteria_not_met(self):
        request = self.factory.post(
            self.url,
            {
                "action_value": 1,
                "category": [
                    {
                        "category_id": self.question_category.id,
                        "cut_off": 2,
                        "question_level": 1,
                    }
                ],
            },
            format="json",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e4601")

    def test_list_shortlist_students_cut_off_and_category_wise(self):
        request = self.factory.post(
            self.url,
            {
                "action_value": 0,
                "cut_off": 1,
                "category": [
                    {
                        "category_id": self.question_category.id,
                        "cut_off": 1,
                        "question_level": 1,
                    }
                ],
            },
            format="json",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_shortlist_criteria_not_provided(self):
        request = self.factory.post(self.url, {"action_value": 0}, format="json")
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e4702")

    def test_category_not_provided(self):
        request = self.factory.post(
            self.url, {"action_value": 0, "category": [{}]}, format="json"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2050")

    def test_invalid_category_data(self):
        request = self.factory.post(
            self.url,
            {
                "action_value": 1,
                "category": [
                    {
                        "category_id": "1",
                        "cut_off": "1",
                        "question_level": "1",
                    }
                ],
            },
            format="json",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2050")

    def test_validate_action_value(self):
        invalid_action_values = [
            {"action_value": None, "error_code": "e4605"},
            {"action_value": "", "error_code": "e4606"},
            {"action_value": "2", "error_code": "e4604"},
            {"action_value": 3, "error_code": "e4603"},
        ]

        for case in invalid_action_values:
            with self.subTest(action_value=case["action_value"]):
                request = self.factory.post(
                    self.url,
                    {"action_value": case["action_value"]},
                    format="json",
                )
                force_authenticate(request, user=self.admin)
                response = self.view(request, exam_id=self.exam_data.id)
                response.render()

                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertEqual(response.data["errorCode"], case["error_code"])

    def test_exam_not_found_shortlist(self):
        request = self.factory.post(
            self.url,
            {
                "action_value": 1,
                "category": [
                    {
                        "category_id": 1,
                        "cut_off": 1,
                        "question_level": 1,
                    }
                ],
            },
            format="json",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=10)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3900")

    def test_exam_not_complete_shortlist_category_wise(self):
        self.exam_data = Exam.objects.create(
            exam_name="Test Exam",
            exam_location=self.exam_location,
            exam_date="2024-01-01",
            exam_time="12:00:00",
            exam_duration=60,
            questionnaire=self.questionnaire,
            is_pool=True,
            status_of_exam=1,
        )
        request = self.factory.post(
            self.url,
            {
                "action_value": 1,
                "category": [
                    {
                        "category_id": 1,
                        "cut_off": 1,
                        "question_level": 1,
                    }
                ],
            },
            format="json",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e4600")

    def test_exam_not_complete_shortlist_category_wise_and_cut_off(self):
        self.exam_data = Exam.objects.create(
            exam_name="Test Exam",
            exam_location=self.exam_location,
            exam_date="2024-01-01",
            exam_time="12:00:00",
            exam_duration=60,
            questionnaire=self.questionnaire,
            is_pool=True,
            status_of_exam=1,
        )
        request = self.factory.post(
            self.url,
            {
                "action_value": 1,
                "cut_off": 1,
                "category": [
                    {
                        "category_id": 1,
                        "cut_off": 1,
                        "question_level": 1,
                    }
                ],
            },
            format="json",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e4600")

    def test_send_email_shortlist_student_category_wise_and_cut_off(self):
        request = self.factory.post(
            self.url,
            {
                "action_value": 1,
                "cut_off": 1,
                "category": [
                    {
                        "category_id": self.question_category.id,
                        "cut_off": 1,
                        "question_level": 1,
                    }
                ],
            },
            format="json",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ExamCriteriaViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.url = reverse("exam-criteria", args=[1000])
        self.view = ExamCriteriaView.as_view()

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

        self.student = Student.objects.create(
            name="Test Student",
            email="XXXXXXXXXXXXXX",
            phone="1234567890",
            pass_out_year="2024",
            institution=self.institution,
            cgpa=8.5,
            no_of_backlogs=0,
            course=1,
        )

        self.exam_data = Exam.objects.create(
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
            uuid="Test10",
            count_of_students="0",
            batch_status=1,
            exam=self.exam_data,
        )
        self.student_batch_mapping = StudentBatchMapping.objects.create(
            student=self.student,
            exam=self.exam_data,
            batch=self.batch,
            student_status=5,
            correct_count=0,
        )

        self.question_category = QuestionCategory.objects.create(
            question_category_name="Test Category",
        )

        self.student_response_category_wise = QuestionCategoryResponse.objects.create(
            question_difficulty_level=1,
            correct_answer_count=0,
            response=self.student_batch_mapping,
            category=self.question_category,
        )

        self.exam_criteria = ExamCriteria.objects.create(
            exam=self.exam_data,
            category=self.question_category,
            cut_off=1,
            question_difficulty_level=1,
        )

    def test_exam_criteria(self):

        request = self.factory.get(self.url)
        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_exam_not_completed(self):
        self.exam_not_completed = Exam.objects.create(
            exam_name="Test Exam",
            exam_location=self.exam_location,
            exam_date="2024-01-01",
            exam_time="12:00:00",
            exam_duration=60,
            questionnaire=self.questionnaire,
            is_pool=True,
            status_of_exam=1,
        )

        request = self.factory.get(self.url)

        force_authenticate(request, user=self.admin)
        response = self.view(request, exam_id=self.exam_not_completed.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e4712")
