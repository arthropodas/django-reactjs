from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.core.exceptions import ValidationError
from rest_framework.exceptions import ParseError
from .models import Questionnaire, QuestionnaireQuestions
from admin_management.models import Admin
from question_management.models import QuestionData, Options
from question_category_management.models import QuestionCategory

# Test constants
QUETIONNAIRE_NAME = 'MODEL question paper'

class CreateListQuestionnaireViewTests(APITestCase):

    def setUp(self):
        # Create the user and authenticate
        self.user = Admin.objects.create_user(email="admin@gmail.com", password="password")
        self.client.force_authenticate(user=self.user)

        # Create mock data for categories and questions
        self.category = QuestionCategory.objects.create(question_category_name="Mock Category")
        
        self.question_data1 = QuestionData.objects.create(
            id=2,
            question="What is the capital of India?",
            question_category_id=self.category,
            status=1,
            question_type=2
        )

        self.question_data2 = QuestionData.objects.create(
            id=1,
            question="What is the capital of France?",
            question_category_id=self.category,
            status=1,
            question_type=2
        )

        self.option1 = Options.objects.create(
            id=1, question_id=self.question_data1, option="option1", is_correct=True
        )
        self.option2 = Options.objects.create(
            id=2, question_id=self.question_data1, option="option2", is_correct=False
        )
        self.option3 = Options.objects.create(
            id=3, question_id=self.question_data1, option="option3", is_correct=True
        )

        # Create Questionnaire and associate with questions
        self.questionnaire = Questionnaire.objects.create(questionnaire_name=QUETIONNAIRE_NAME)
        self.question_questions = QuestionnaireQuestions.objects.create(
            questionnaire=self.questionnaire, question=self.question_data1
        )

    def tearDown(self):
        # Clean up any shared resources if necessary (optional)
        Questionnaire.objects.all().delete()
        QuestionCategory.objects.all().delete()
        QuestionData.objects.all().delete()
        Options.objects.all().delete()

    def test_preview_questionnaire_success(self):
        url = reverse('preview_questionnaire')
        data = {'questionnaireName': QUETIONNAIRE_NAME, 'examCategories': [{'questionCategoryId': self.category.id, 'level': 1, 'noOfQuestions': 1}]}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_preview_questionnaire_parseerror(self):
        url = reverse('preview_questionnaire')
        # Malformed JSON: Missing closing brace
        data = '{"questionnaireName": "Test 1", "examCategories": [{"questionCategoryId": 1, "level": 1, "noOfQuestions": 1}'
        # Simulate a POST request with malformed JSON
        response = self.client.post(url, data, content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'], "e408")

    def test_get_questionnaire_success(self):
        url = reverse('get_edit_delete_questionnaire', kwargs={'pk': self.questionnaire.id})
        response = self.client.get(url)
  
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('questionnaireName', response.data)
        self.assertEqual(response.data['questionnaireName'], QUETIONNAIRE_NAME)

    def list_questionnaire(self):
        url = reverse('create_list_questionnaire')
        response = self.client.get(url, {'searchTerm': 'Test'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('Test', response.content.decode())

    def test_create_questionnaire(self):
        url = reverse('create_list_questionnaire')
        data1 = '{"questionnaireName": "Test 1dd", "questionArray": [1]}'
        response = self.client.post(url, data1, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_questionnaire_details(self):
        url = reverse('detail_questionnaire', kwargs={'pk': self.questionnaire.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_questionnaire(self):
        url = reverse('get_edit_delete_questionnaire', kwargs={'pk': self.questionnaire.id})
        response = self.client.patch(url)
  
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_edit_questionnaire(self):
        url = reverse('get_edit_delete_questionnaire', kwargs={'pk': self.questionnaire.id})
        data1 = '{"questionnaireName": "Test 1dd", "questionArray": [1]}'
        response = self.client.put(url, data1, content_type="application/json")
  
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # --------------------- New Test Cases ---------------------

    def test_get_questionnaire_search_term(self):
        # Test that the search term query parameter works as expected
        url = reverse('create_list_questionnaire')
        response = self.client.get(url, {'searchTerm': QUETIONNAIRE_NAME})  # Search for "India"
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        

    def test_get_questionnaire_no_search_term(self):
        # Test that the search returns all questionnaires when no search term is provided
        url = reverse('create_list_questionnaire')
        response = self.client.get(url)  # No search term passed
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 3)  # Assuming you have multiple questionnaires

    def test_get_questionnaire_invalid_search_term(self):
        # Test that the search returns no results when a non-matching term is passed
        url = reverse('create_list_questionnaire')
        response = self.client.get(url, {'searchTerm': 'Test 1'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)  # Assuming no results are found for "NonExistingTerm"

    # --------------------- Exception Handling Tests ---------------------

    def test_post_create_questionnaire_parse_error(self):
        url = reverse('create_list_questionnaire')
        # Send malformed JSON (missing a closing brace)
        data = '{"questionnaireName": "Test 1dd", "questionArray": [1]'
        response = self.client.post(url, data, content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'], "e408")

    def test_post_create_questionnaire_validation_error(self):
        url = reverse('create_list_questionnaire')
        # Pass invalid data that will trigger a validation error (e.g., missing required fields)
        data = '{"questionnaireName": "", "questionArray": [1]}'  # Assuming empty name is invalid
        response = self.client.post(url, data, content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(response.data['errorCode'],"e2201")  # Assuming the validation error for "questionnaireName" is triggered


