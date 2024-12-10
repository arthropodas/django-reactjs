from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from .models import QuestionCategory
from admin_management.models import Admin
from question_management.models import QuestionData
from unittest.mock import patch

class CreateQuestionCategoryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.valid_payload = {
            "categoryName": "Sample Category"
        }
        self.is_required = {
            "categoryName": ""
        }
        self.name_too_small = {
            "categoryName": "a"
        }
        self.name_too_large = {
            "categoryName": "a" * 101
        }
        self.name_with_space_at_beginning = {
            "categoryName": " Sample Category with space at beginning"
        }
        self.name_with_space_at_end = {
            "categoryName": "Sample Category with space at end "
        }

        self.not_string = {
            "categoryName": 1234
        }

        self.exception = {
            "aaaa"
        }


        self.admin = Admin.objects.create(
            id=1,
            email="test@gmail.com",
            password = "test@password.com",
            status = True
        )

        self.url = reverse("question_category_create_list")

    def test_create_valid_question_category(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, data=self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["question_category_name"], "Sample Category")
        self.assertTrue(QuestionCategory.objects.filter(question_category_name="Sample Category").exists())

    
    def test_400_is_required(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, data=self.is_required, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1002')


    def test_400_name_too_small(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, data=self.name_too_small, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1004')

    

    def test_400_name_too_large(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, data=self.name_too_large, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1003')

    def test_400_not_string(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, data=self.not_string, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1000')

    def test_400_space_at_beginning(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, data=self.name_with_space_at_beginning, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1005')

    
    def test_400_space_at_end(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, data=self.name_with_space_at_end, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1005')

    def test_exception(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, data=self.exception, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_unauthorised_user(self):
        response = self.client.post(self.url, data=self.valid_payload, format='json')
        self.assertEqual(response.status_code,401)

    


class EditQuestionCategoryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.valid_payload = {
            "categoryName": "Sample Category edited"
        }
        self.is_required = {
            "categoryName": ""
        }
        self.name_too_small = {
            "categoryName": "a"
        }
        self.name_too_large = {
            "categoryName": "a" * 101
        }
        self.name_with_space_at_beginning = {
            "categoryName": " Sample Category with space at beginning"
        }
        self.name_with_space_at_end = {
            "categoryName": "Sample Category with space at end "
        }

        self.not_string = {
            "categoryName": 1234
        }

        

        self.exception = {
            "aaaa"
        }


        self.admin = Admin.objects.create(
            id=1,
            email="test@gmail.com",
            password = "test@password.com",
            status = True
        )

        self.invalid_pk_not_found = 1234566
        self.valid_pk = 1

        self.category = QuestionCategory.objects.create(
            id=1,
            question_category_name='Original Name',
            status=True
        )
        self.url = reverse('question_category_edit_delete_fetch_by_id', kwargs={'pk': self.category.id})
        self.url_with_invalid_parameter = reverse('question_category_edit_delete_fetch_by_id', kwargs={'pk': self.invalid_pk_not_found})


    def test_200_success(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(QuestionCategory.objects.get(id=self.category.id).question_category_name, self.valid_payload['categoryName'])


    def test_400_is_required(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, data=self.is_required, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1002')


    def test_400_name_too_small(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, data=self.name_too_small, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1004')

    

    def test_400_name_too_large(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, data=self.name_too_large, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1003')

    def test_400_not_string(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, data=self.not_string, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1000')

    def test_400_space_at_beginning(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, data=self.name_with_space_at_beginning, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1005')

    
    def test_400_space_at_end(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, data=self.name_with_space_at_end, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1005')

    def test_exception(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url, data=self.exception, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1010')

    def test_category_not_found(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(self.url_with_invalid_parameter, data=self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1006')

    def test_unauthorised_user(self):
        response = self.client.put(self.url, data=self.valid_payload, format='json')
        self.assertEqual(response.status_code,401)
        

class DeleteQuestionCategoryTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1,
            email="test@gmail.com",
            password = "test@password.com",
            status = True
        )
        self.category = QuestionCategory.objects.create(
            id=1,
            question_category_name='Original Name',
            status=True
        )
        
        self.category_has_question = QuestionCategory.objects.create(
            id=3,
            question_category_name='Has Question',
            status=True
        )

        self.already_deleted_category = QuestionCategory.objects.create(
            id=2,
            question_category_name='Name',
            status=False
        )
        
        self.question_data = QuestionData.objects.create(
            question="What is the capital of France?",
            question_category_id=self.category_has_question,
        )

        self.invalid_url_param = 890989
        self.url = reverse('question_category_edit_delete_fetch_by_id', kwargs={'pk': self.category.id})
        self.invalid_url = reverse('question_category_edit_delete_fetch_by_id', kwargs={'pk': self.invalid_url_param})
        self.already_deleted_url = reverse('question_category_edit_delete_fetch_by_id', kwargs={'pk': self.already_deleted_category.id})
        self.category_has_questions_url = reverse('question_category_edit_delete_fetch_by_id', kwargs={'pk': self.category_has_question.id})


    def test_200_success_delete(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_400_invalid_id(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.invalid_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1006')

    
    def test_400_already_deleted(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.already_deleted_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'],'e1008')
        
        
    def test_400_category_has_questions(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.category_has_questions_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        


    def test_unauthorised(self):
         response = self.client.delete(self.url)
         self.assertEqual(response.status_code,401)


    @patch('question_category_management.views.QuestionCategory.objects.get')  
    def test_delete_category_with_exception(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        # Configure the mock to raise an exception
        mock_get.side_effect = Exception('Forced Exception')
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'], 'e1010')  


class QuestionCategoryListTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('question_category_create_list')
        self.admin = Admin.objects.create(
            id=1,
            email="test@gmail.com",
            password = "test@password.com",
            status = True
        )
        # Create some QuestionCategory objects
        for i in range(15):
            QuestionCategory.objects.create(id=i+1,question_category_name=f"Category {i+1}")

        
    def test_get_all_categories(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        


    def test_search_category(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {'search': 'Category 1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        

    def test_search_category_no_results(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {'search': 'Nonexistent'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        

    
    @patch('question_category_management.views.QuestionCategory.objects.filter')
    def test_400_table_not_exist_in_search(self,mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = QuestionCategory.DoesNotExist
        response = self.client.get(self.url, {'search': 'zzzzzz'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



    @patch('question_category_management.views.QuestionCategory.objects.filter')  
    def test_list_category_with_exception(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        # Configure the mock to raise an exception
        mock_get.side_effect = Exception('Forced Exception')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'], 'e1010')  


   

class QuestionCategoryById(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = QuestionCategory.objects.create(
            id=1,
            question_category_name='Original Name',
            status=True
        )
        self.admin = Admin.objects.create(
            id=1,
            email="test@gmail.com",
            password = "test@password.com",
            status = True
        )
        self.url = reverse('question_category_edit_delete_fetch_by_id',kwargs={'pk': self.category.id})
        self.url_invalid = reverse('question_category_edit_delete_fetch_by_id',kwargs={'pk': 1000})


    def test_200__question_category_id(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_url(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url_invalid)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'], 'e1006')

    @patch('question_category_management.views.QuestionCategory.objects.get')  
    def test_list_category_with_exception(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        # Configure the mock to raise an exception
        mock_get.side_effect = Exception('Forced Exception')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['errorCode'], 'e1010')  


    def test_unauthorised(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    






