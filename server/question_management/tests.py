from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIRequestFactory, force_authenticate
from .views import (
    QuestionCreateListView,
    QuestionDeleteUpdateView,
    QuestionCSVUploadView,
)
from rest_framework.validators import ValidationError
from unittest.mock import patch
from admin_management.models import Admin
from rest_framework import status
from question_category_management.models import QuestionCategory
from .models import QuestionData, Options, QuestionImage, QuestionCategory
from questionnaire_management.models import Questionnaire
import json
from django.core.files.uploadedfile import SimpleUploadedFile
import tempfile
import shutil
from django.conf import settings


class QuestionAddViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        # Create a temporary directory for media files during the tests
        self._temp_media = tempfile.mkdtemp()

        # Override MEDIA_ROOT to use the temporary directory
        self.original_media_root = settings.MEDIA_ROOT
        settings.MEDIA_ROOT = self._temp_media

        self.view = QuestionCreateListView.as_view()
        self.question_category = QuestionCategory.objects.create(
            question_category_name="test"
        )
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )

        self.question_is_empty = {"question": ""}
        self.question_minimum_length = {"question": "find"}
        self.question_contain_spaces = {"question": "     find  "}
        self.question_maximum_length = {"question": "s" * 1001}

        self.question_type_required = {"question": "What is the capital of France?"}

        self.question_type_is_missing = {
            "question": "What is the capital of France?",
            "question_type": "",
        }

        self.question_type_string = {
            "question": "What is the capital of France?",
            "question_type": "yes",
        }

        self.invalid_question_type = {
            "question": "What is the capital of France?",
            "question_type": 3,
        }

        self.category_required = {
            "question": "What is the capital of France?",
            "question_type": 1,
        }

        self.category_is_empty = {
            "question": "What is the capital of France?",
            "question_type": 1,
            "category_id": "",
        }
        self.invalid_category_id = {
            "question": "What is the capital of France?",
            "question_type": 1,
            "category_id": "E1",
        }

        self.options_required = {
            "question": "What is the capital of France?",
            "question_type": 1,
            "category_id": "100",
        }

        self.option_is_empty = {
            "question": "What is the capital of France?",
            "question_type": 1,
            "category_id": "100",
            "options": "",
        }

        self.options_minimum_required = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": "100",
            "options": '["Lyon","Marseille"]',
        }

        self.duplicate_options = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": "100",
            "options": '["Lyon","Marseille","Lyon","Paris"]',
        }

        self.options = json.dumps(["Marseille", "Lyon" * 1001, "Bordeaux", "paris"])

        self.invalid_correct_answer = json.dumps(["p" * 1001])

        self.invalid_options_length = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": "100",
            "options": self.options,
        }

        self.invalid_options_format = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": "100",
            "options": ["abc", "xyz"],
        }

        self.invalid_options_list_empty = {
            "question": "What is the capital of France?",
            "question_type": 1,
            "category_id": "100",
            "options": json.dumps([]),
        }

        self.invalid_option_type_length = {
            "question": "What is the capital of France?",
            "question_type": 1,
            "category_id": "100",
            "options": '["Marseille","Bordeaux","Lyon",100000]',
        }

        self.correct_answer_required = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": 1,
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "Paris"]),
        }

        self.correct_answer_is_empty = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": 1,
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "Paris"]),
            "correct_answer": "",
        }

        self.correct_answer_maximum_length = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": self.question_category.id,
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "Paris"]),
            "correct_answer": self.invalid_correct_answer,
        }

        self.invalid_correct_answer_fomrat = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": self.question_category.id,
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "Paris"]),
            "correct_answer": ["abc", "xyz"],
        }

        self.correct_answer_list_empty = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": self.question_category.id,
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "Paris"]),
            "correct_answer": json.dumps([]),
        }

        self.duplicate_correct_answer = {
            "question": "Identify the color of zebra",
            "question_type": 2,
            "category_id": "100",
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "Paris"]),
            "correct_answer": '["Paris","Paris"]',
        }

        self.correct_answer_min_with_question_type = {
            "question": "Identify the color of zebra",
            "question_type": 2,
            "category_id": 1,
            "options": '["black","gray","white","red"]',
            "correct_answer": '["black"]',
        }

        self.category_invalid_data = QuestionCategory.objects.create(
            question_category_name="aptitude", status=0
        )

        self.valid_options = ["china", "italy", "spain"]

        self.category_not_found = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": self.category_invalid_data.id,
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "paris"]),
            "correct_answer": '["paris"]',
            "difficulty_level": 1,
        }

        self.image_content = b"Image content here"
        self.valid_image = SimpleUploadedFile(
            "test_image.png", self.image_content, content_type="image/png"
        )

        self.large_image_content = b"X" * (3 * 1024 * 1024)

        self.large_image = SimpleUploadedFile(
            "large_image.png", self.large_image_content, content_type="image/png"
        )
        self.invalid_image = SimpleUploadedFile(
            "test_image.avif", self.image_content, content_type="image/avif"
        )

        self.url = reverse("create_and_list_question")

    def test_question_is_empty(self):

        request = self.factory.post(
            self.url, data=self.question_is_empty, type="multipart"
        )

        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3001")

    def test_question_minimum_length(self):

        request = self.factory.post(
            self.url, data=self.question_minimum_length, type="multipart"
        )

        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3003")

    def test_question_maximum_length(self):

        request = self.factory.post(
            self.url, data=self.question_maximum_length, type="multipart"
        )

        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3004")

    def test_question_contain_spaces(self):

        request = self.factory.post(
            self.url, data=self.question_contain_spaces, type="multipart"
        )

        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3002")

    def test_question_type_required(self):

        request = self.factory.post(
            self.url, data=self.question_type_required, type="multipart"
        )

        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3500")

    def test_question_type_is_empty(self):

        request = self.factory.post(
            self.url, data=self.question_type_is_missing, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3501")

    def test_question_type_is_string(self):

        request = self.factory.post(
            self.url, data=self.question_type_string, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3502")

    def test_invalid_question_type(self):

        request = self.factory.post(
            self.url, data=self.invalid_question_type, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3503")

    def test_category_required(self):

        request = self.factory.post(
            self.url, data=self.category_required, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3100")

    def test_category_is_empty(self):

        request = self.factory.post(
            self.url, data=self.category_is_empty, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3101")

    def test_invalid_category_id(self):

        request = self.factory.post(
            self.url, data=self.invalid_category_id, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3102")

    def test_options_required(self):

        request = self.factory.post(
            self.url, data=self.options_required, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3200")

    def test_option_is_empty(self):

        request = self.factory.post(
            self.url, data=self.option_is_empty, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3201")

    def test_minimum_options_required(self):

        request = self.factory.post(
            self.url, data=self.options_minimum_required, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3202")

    def test_duplicate_options(self):

        request = self.factory.post(
            self.url, data=self.duplicate_options, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3204")

    def test_option_list_is_empty(self):

        request = self.factory.post(
            self.url, data=self.invalid_options_list_empty, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3206")

    def test_invalid_options_format(self):

        request = self.factory.post(
            self.url, data=self.invalid_options_format, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3205")

    def test_invalid_option_length(self):

        request = self.factory.post(
            self.url, data=self.invalid_options_length, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3203")

    def test_correct_answer_required(self):

        request = self.factory.post(
            self.url, data=self.correct_answer_required, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3300")

    def test_invalid_correct_answer_format(self):

        request = self.factory.post(
            self.url, data=self.invalid_correct_answer_fomrat, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3303")

    def test_correct_answer_list_empty(self):

        request = self.factory.post(
            self.url, data=self.correct_answer_list_empty, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3304")

    def test_correct_answer_is_empty(self):

        request = self.factory.post(
            self.url, data=self.correct_answer_is_empty, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3301")

    def test_correct_answer_maximum_length(self):

        request = self.factory.post(
            self.url, data=self.correct_answer_maximum_length, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3302")

    def test_duplicate_correct_answer(self):

        request = self.factory.post(
            self.url, data=self.duplicate_correct_answer, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3504")

    def test_category_not_found(self):

        request = self.factory.post(
            self.url, data=self.category_not_found, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3103")

    def tearDown(self):
        # Restore the original MEDIA_ROOT setting
        settings.MEDIA_ROOT = self.original_media_root

        # Remove the temporary directory after the tests
        shutil.rmtree(self._temp_media)

    def test_upload_large_question_image_file(self):

        self.invalid_pyload = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": self.question_category.id,
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "Paris"]),
            "correct_answer": '["Paris"]',
            "difficulty_level": 1,
            "question_image": self.large_image,
        }

        request = self.factory.post(
            self.url, data=self.invalid_pyload, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3401")

    def test_upload_invalid_image_file(self):

        self.invalid_pyload = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": self.question_category.id,
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "Paris"]),
            "correct_answer": '["Paris"]',
            "difficulty_level": 2,
            "question_image": self.invalid_image,
        }

        request = self.factory.post(
            self.url, data=self.invalid_pyload, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3400")

    def test_valid_question_already_exist(self):

        question = QuestionData.objects.create(
            question="What is the capital of France?",
            question_category_id=self.question_category,
        )

        self.invalid_payload = {
            "question": question.question,
            "question_type": 2,
            "category_id": self.question_category.id,
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "Paris"]),
            "correct_answer": '["Paris"]',
            "difficulty_level": 2,
            "question_image": self.valid_image,
        }
        request = self.factory.post(
            self.url, data=self.invalid_payload, type="multipart"
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3006")

    def test_valid_question_creation(self):

        self.valid_payload = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": self.question_category.id,
            "options": json.dumps(["Lyon", "Marseille", "Toulouse", "Paris"]),
            "correct_answer": '["Paris"]',
            "difficulty_level": 1,
            "question_image": self.valid_image,
        }
        request = self.factory.post(self.url, data=self.valid_payload, type="multipart")
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Question added successfully")

    def test_question_difficulty_level(self):
        test_scenarios = [
            {"difficulty_level": "", "expected_error_code": "e4101"},
            {"difficulty_level": None, "expected_error_code": "e4100"},
            {"difficulty_level": 8, "expected_error_code": "e4102"},
            {"difficulty_level": "a", "expected_error_code": "e4103"},
        ]

        for scenario in test_scenarios:
            with self.subTest(difficulty_level=scenario["difficulty_level"]):
                if scenario["difficulty_level"] is None:
                    self.valid_payload = {
                        "question": "What is the capital of France?",
                        "question_type": 2,
                        "category_id": self.question_category.id,
                        "options": json.dumps(
                            ["Lyon", "Marseille", "Toulouse", "Paris"]
                        ),
                        "correct_answer": json.dumps(["Paris"]),
                    }
                else:
                    self.valid_payload = {
                        "question": "What is the capital of France?",
                        "question_type": 2,
                        "category_id": self.question_category.id,
                        "options": json.dumps(
                            ["Lyon", "Marseille", "Toulouse", "Paris"]
                        ),
                        "correct_answer": json.dumps(["Paris"]),
                        "difficulty_level": scenario["difficulty_level"],
                    }

                request = self.factory.post(
                    self.url, data=self.valid_payload, type="multipart"
                )
                force_authenticate(request, user=self.admin)
                response = self.view(request)
                response.render()
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertEqual(
                    response.data["errorCode"], scenario["expected_error_code"]
                )


# Testcase for delete question


class QuestionDeleteViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = QuestionDeleteUpdateView.as_view()
        self.question_category = QuestionCategory.objects.create(
            question_category_name="Test Category"
        )
        self.question_data = QuestionData.objects.create(
            question="What is the capital of France?",
            question_category_id=self.question_category,
        )
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )

        self.question_deleted_instance = QuestionData.objects.create(
            question="What is the capital of France?",
            question_category_id=self.question_category,
            status=0,
        )
        self.valid_url = reverse(
            "delete_and_update_question", args=[self.question_data.id]
        )
        self.invalid_url = reverse("delete_and_update_question", args=[1000])

    def test_successful_question_delete(self):
        request = self.factory.delete(self.valid_url)
        force_authenticate(request, user=self.admin)
        response = self.view(request, question_id=self.question_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Question deleted successfully")

    def test_question_not_found(self):
        request = self.factory.delete(self.invalid_url)
        force_authenticate(request, user=self.admin)
        response = self.view(request, question_id=1000)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3008")

    def test_question_already_deleted(self):
        request = self.factory.delete(self.valid_url)
        force_authenticate(request, user=self.admin)
        response = self.view(request, question_id=self.question_deleted_instance.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3007")


# Testcase for list questions


class QuestionListViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = QuestionCreateListView.as_view()
        self.url = reverse("create_and_list_question")
        self.question_category = QuestionCategory.objects.create(
            question_category_name="Test Category"
        )

        self.category_id = self.question_category.id
        self.question_data = QuestionData.objects.create(
            question="What is the capital of France?",
            question_category_id=self.question_category,
            status=1,
        )
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
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

    def test_fetch_question_category_wise(self):
        request = self.factory.get(self.url, data={"category_id": self.category_id})
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_fetch_all_question(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_fetch_single_question_not_found(self):
        request = self.factory.get(self.url, data={"question_id": 10})
        force_authenticate(request, user=self.admin)
        response = QuestionDeleteUpdateView.as_view()(request, question_id=2)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3008")

    def test_fetch_single_question(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.admin)
        response = QuestionDeleteUpdateView.as_view()(
            request, question_id=self.question_data.id
        )
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_question(self):
        self.searchTerm = "What"
        self.search_url = (
            f"{reverse('create_and_list_question')}?searchTerm={self.searchTerm}"
        )
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_fetch_question_category_wise_not_found(self):
        request = self.factory.get(self.url, data={"category_id": 3})
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3103")


# Testcase for update question


class QuestionUpdateViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = QuestionDeleteUpdateView.as_view()
        self.url = reverse("delete_and_update_question", args=[1000])
        self.question_category = QuestionCategory.objects.create(
            question_category_name="Test Category"
        )
        self.valid_options = json.dumps([2, 4, 7, 9])
        self.valid_answer = json.dumps([2, 7])
        self.valid_option_update = json.dumps([2, 4, 7, 10])
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.question_data = QuestionData.objects.create(
            question="What is the capital of France?",
            question_type=2,
            question_category_id=self.question_category,
            status=1,
        )
        self.wrong_option = Options.objects.create(
            question_id=self.question_data,
            option=json.dumps(["abc", "xyz", "pqr", "lmn"]),
            is_correct=0,
        )
        self.correct_option = Options.objects.create(
            question_id=self.question_data, option=json.dumps(["abc"]), is_correct=1
        )

        self.image_content = b"Image content here"
        self.image_content2 = b"Image content here"
        self.valid_image = SimpleUploadedFile(
            "test1_image.png", self.image_content, content_type="image/png"
        )

        self.valid_image2 = SimpleUploadedFile(
            "test2_image.png", self.image_content2, content_type="image/png"
        )

        self.question_image_instance = QuestionImage.objects.create(
            question_id=self.question_data, question_image=self.valid_image
        )

        self.question_data2 = QuestionData.objects.create(
            question="What is the capital of Delhi?",
            question_type=0,
            question_category_id=self.question_category,
            status=1,
        )

        self.question_not_found = QuestionData.objects.create(
            question="Which of the following are prime numbers?",
            question_category_id=self.question_category,
            status=0,
        )

        self.valid_payload = {
            "question": "What is the capital of France?",
            "question_type": 2,
            "category_id": self.question_category.id,
            "options": json.dumps(["abc", "xyz", "pqr", "lmn"]),
            "correct_answer": json.dumps(["lmn"]),
            "question_image": self.valid_image2,
            "difficulty_level": 1,
        }

        self.valid_payload2 = {
            "question": "Which of the following are prime numbers?",
            "question_type": 2,
            "category_id": self.question_category.id,
            "options": json.dumps([1, 2, 3, 10]),
            "correct_answer": json.dumps([2, 10]),
            "question_image": self.valid_image2,
            "difficulty_level": 1,
        }

        self.invalid_data_payload = {
            "question": "Which of the following are prime numbers?",
            "question_type": 1,
            "category_id": self.question_category.id,
            "options": json.dumps([2, 4, 10, 3]),
            "correct_answer": json.dumps([2, 3]),
            "question_image": self.valid_image,
            "difficulty_level": 1,
        }

    def test_valid_question_update(self):
        request = self.factory.put(self.url, data=self.valid_payload, type="multipart")
        force_authenticate(request, user=self.admin)
        response = self.view(request, question_id=self.question_data.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Question updated successfully")

    def test_valid_question_answer_update_data(self):
        request = self.factory.put(self.url, data=self.valid_payload2, type="multipart")
        force_authenticate(request, user=self.admin)
        response = self.view(request, question_id=self.question_data.id)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_question_not_found(self):
        request = self.factory.put(self.url, data=self.valid_payload, type="multipart")
        force_authenticate(request, user=self.admin)
        response = self.view(request, question_id=self.question_not_found.id)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e3008")


class QuestionCsvUploadTestCaseView(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = QuestionCSVUploadView.as_view()
        self.url = reverse("question_bulk_upload")
        self.question_category = QuestionCategory.objects.create(
            question_category_name="Test Category"
        )
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )

    def test_valid_csv_upload(self):

        valid_csv_content = (
            "Question,Question_type,Category,Difficulty_level,Option_1,Option_2,Option_3,Option_4,Answer_1,Answer_2,Answer_3,Answer_4\n"
            f"What is the capital of France?,multiple Answer,{self.question_category.question_category_name},medium,Paris,London,Berlin,Tokyo,Paris\n"
        )

        csv_file = SimpleUploadedFile(
            "test.csv", bytes(valid_csv_content, "utf-8"), content_type="text/csv"
        )
        request = self.factory.post(self.url, {"csvFileUpload": csv_file})
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_csv_questionnaire(self):

        csv_content = (
            "Question,Question_type,Category,Difficulty_level,Option_1,Option_2,Option_3,Option_4,Answer_1,Answer_2,Answer_3,Answer_4\n"
            f"What is the capital of France?,multiple Answer,{self.question_category.question_category_name},medium,Paris,London,Berlin,Tokyo,Paris\n"
        )

        csv_file = SimpleUploadedFile(
            "test.csv", bytes(csv_content, "utf-8"), content_type="text/csv"
        )
        request = self.factory.post(
            self.url,
            {"questionnaireName": "Geography Quiz", "csvFileUpload": csv_file},
            format="multipart",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_csv_data(self):

        csv_content = (
            "Question,Question_type,Category,Difficulty_level,Option_1,Option_2,Option_3,Option_4,Answer_1,Answer_2,Answer_3,Answer_4\n"
            ",,,,,,,\n"
        )

        csv_file = SimpleUploadedFile(
            "test.csv", bytes(csv_content, "utf-8"), content_type="text/csv"
        )
        request = self.factory.post(
            self.url,
            {"questionnaireName": "Geography Quiz", "csvFileUpload": csv_file},
            format="multipart",
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(response.data["errorCode"], "e4300")

    def test_csv_duplicate_question(self):

        self.question = QuestionData.objects.create(
            question="What is the capital of France?",
            question_type=2,
            question_category_id=self.question_category,
            status=1,
        )
        self.questionnaire = Questionnaire.objects.create(
            questionnaire_name="demo name"
        )

        invalid_csv_content = (
            "Question,Question_type,Category,Difficulty_level,Option_1,Option_2,Option_3,Option_4,Answer_1,Answer_2,Answer_3,Answer_4\n"
            f"What is the capital of France?,multiple Answer,{self.question_category.question_category_name},medium,Paris,London,Berlin,Tokyo,Paris\n"
            f"What is the capital of France?,multiple Answer,abc,medium,Paris,London,Berlin,Tokyo,Japan\n"
        )

        csv_file = SimpleUploadedFile(
            "test.csv", bytes(invalid_csv_content, "utf-8"), content_type="text/csv"
        )
        request = self.factory.post(
            self.url,
            {
                "csvFileUpload": csv_file,
                "questionnaireName": self.questionnaire.questionnaire_name,
            },
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(response.data["errorCode"], "e4300")

    def test_invalid_file(self):
        invalid_file = SimpleUploadedFile(
            "file.txt", b"Not a CSV content", content_type="text/plain"
        )
        request = self.factory.post(
            self.url,
            {
                "csvFileUpload": invalid_file,
            },
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(response.data["errorCode"], "e4201")

    def test_csv_file_required(self):
        request = self.factory.post(
            self.url,
            {
                "csvFileUpload": "",
            },
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(response.data["errorCode"], "e4200")

    def test_csv_validate_headers(self):

        invalid_csv_content = (
            "Question,Question_type,Category,Difficulty_level,Option_1,Option_2,Option_3,Answer_1,Answer_2,Answer_3,Answer_4\n"
            f"What is the capital of France?,multiple Answer,{self.question_category.question_category_name},medium,Paris,London,Berlin,Tokyo,Paris\n"
        )

        csv_file = SimpleUploadedFile(
            "test.csv", bytes(invalid_csv_content, "utf-8"), content_type="text/csv"
        )
        request = self.factory.post(
            self.url,
            {"csvFileUpload": csv_file},
        )
        force_authenticate(request, user=self.admin)
        response = self.view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(response.data["errorCode"], "e4203")
