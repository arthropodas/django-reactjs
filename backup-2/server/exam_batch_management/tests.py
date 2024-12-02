from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from admin_management.models import Admin
from exam_management.models import ExamLocations,Exam
from datetime import datetime
from .models import Batch,StudentBatchMapping
from unittest.mock import patch
from student_management.models import Student
from institution_management.models import Institution

# Create your tests here.
current_date = datetime.now()  # This is a datetime object
valid_current_year = current_date.strftime("%Y-%m-%d")

class AddBatchTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('batch_view')
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.exam_location = ExamLocations.objects.create(
            id=1,
            location_name="demolocation",
            status=True,
        )
        self.exam = Exam.objects.create(
            id=1,
            exam_name="Valid name",
            exam_date=valid_current_year,
            exam_time="12:00:00",
            exam_duration=60,
            exam_location=self.exam_location,
            status_of_exam=1
        )
        
        self.batch = Batch.objects.create(
            id=1,
            batch_name="duplicate name",
            exam=self.exam,
            status=True,
            count_of_students=0
            )
        self.data = {
            "batchName": "Valid name",
            "examId":1,
        }

    def test_200_ok(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_400_no_batch_name(self):
        self.client.force_authenticate(user=self.admin)
        self.data['batchName']=""
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_invalid_batch_name(self):
        self.client.force_authenticate(user=self.admin)
        self.data['batchName']=1
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_small_batch_name(self):
        self.client.force_authenticate(user=self.admin)
        self.data['batchName']="1"
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_large_batch_name(self):
        self.client.force_authenticate(user=self.admin)
        self.data['batchName']='a'*300
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_space_in_first_batch_name(self):
        self.client.force_authenticate(user=self.admin)
        self.data['batchName']=" asdfgh"
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_space_in_last_batch_name(self):
        self.client.force_authenticate(user=self.admin)
        self.data['batchName']="asdfgh "
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_no_exam_id(self):
        self.client.force_authenticate(user=self.admin)
        self.data['batchName']="Valid name"
        self.data['examId']=None
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_invalid_exam_id(self):
        self.client.force_authenticate(user=self.admin)
        self.data['examId']="dsasdc"
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_400_no_exam_id(self):
        self.client.force_authenticate(user=self.admin)
        self.data['examId']=2
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("exam_batch_management.views.Batch.objects.create")
    def test_exception(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Exception("forced exception")
        response = self.client.post(self.url,self.data,format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    
    def test_400_unique_name(self):
        self.client.force_authenticate(user=self.admin)
        self.data['batchName']="duplicate name"
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)




class BatchViewDeleteTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.exam_location = ExamLocations.objects.create(
            id=1,
            location_name="demolocation",
            status=True,
        )
        self.exam = Exam.objects.create(
            id=1,
            exam_name="Valid name",
            exam_date=valid_current_year,
            exam_time="12:00:00",
            exam_duration=60,
            exam_location=self.exam_location,
            status_of_exam=1
        )
        self.exam2 = Exam.objects.create(
            id=2,
            exam_name="Valid name",
            exam_date=valid_current_year,
            exam_time="12:00:00",
            exam_duration=60,
            exam_location=self.exam_location,
            status_of_exam=3
        )
        self.batch = Batch.objects.create(
            id=1,
            batch_name="Valid name",
            exam=self.exam,
            status=True,
            count_of_students=0
            )
        self.batch2 = Batch.objects.create(
            id=2,
            batch_name="Valid name",
            exam=self.exam,
            status=True,
            count_of_students=0
            )
        self.batch3 = Batch.objects.create(
            id=3,
            batch_name="Valid name",
            exam=self.exam2,
            status=True,
            count_of_students=0
            )
        self.institution = Institution.objects.create(
            id=1,
            institution_name="Valid name",
        )
        self.student = Student.objects.create(
            name="John Doe",
            email="john.doe@example.com",
            phone="1234567890",
            institution=self.institution,  # Assuming Institution is required
            pass_out_year=2022,
            cgpa=3.8,
            no_of_backlogs=0,
            course=Student.BTECH_CSE,
            status=1
        )
        self.mapping = StudentBatchMapping.objects.create(
            exam_id=self.exam.id,
            student=self.student,
            batch=self.batch,
            student_status=1
        )
        self.valid_url = reverse('delete_batch',kwargs={"pk": self.batch2.id})
        self.unable_to_delete = reverse('delete_batch',kwargs={"pk": self.batch.id})
        
    def test_200_ok(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.valid_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
       
    def test_400_invalid_no_batch(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(reverse('delete_batch',kwargs={"pk": 100}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_invalid_unable_to_delete(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.unable_to_delete)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_400_invalid_no_exam(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(reverse('delete_batch',kwargs={"pk": 3}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch("exam_batch_management.views.Exam.objects.filter")
    def test_exam_not_found(self,mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Exam.DoesNotExist()
        response = self.client.delete(self.valid_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch("exam_batch_management.views.Exam.objects.filter")
    def test_exception(self,mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Exception()
        response = self.client.delete(self.valid_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)        
    
    
    

class GetStudentsFromBatch(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.exam_location = ExamLocations.objects.create(
            id=1,
            location_name="demolocation",
            status=True,
        )
        self.exam = Exam.objects.create(
            id=1,
            exam_name="Valid name",
            exam_date=valid_current_year,
            exam_time="12:00:00",
            exam_duration=60,
            exam_location=self.exam_location,
            status_of_exam=1
        )
        self.batch = Batch.objects.create(
            id=1,
            batch_name="Valid name",
            exam=self.exam,
            status=True,
            count_of_students=1
            )
        self.batch2 = Batch.objects.create(
            id=2,
            batch_name="Valid name",
            exam=self.exam,
            status=True,
            count_of_students=0
            )
        self.batch3 = Batch.objects.create(
            id=3,
            batch_name="Valid name",
            exam=self.exam,
            status=True,
            count_of_students=0
            )
        self.institution = Institution.objects.create(
            id=1,
            institution_name="Valid name",
        )
        self.student = Student.objects.create(
            name="John Doe",
            email="john.doe@example.com",
            phone="1234567890",
            institution=self.institution,  # Assuming Institution is required
            pass_out_year=2022,
            cgpa=3.8,
            no_of_backlogs=0,
            course=Student.BTECH_CSE,
            status=1
        )
        self.mapping = StudentBatchMapping.objects.create(
            exam_id=self.exam.id,
            student=self.student,
            batch=self.batch,
            student_status=1
        )

        self.url = reverse('student_view',kwargs={'pk': self.batch.id})
        self.no_batch_url = reverse('student_view',kwargs={'pk': 5})
        

    def test_200_ok(self):
        self.client.force_authenticate(user=self.admin)
        self.client.force_login(self.admin)
        response = self.client.get(self.url+"?search=jo")
        self.assertEqual(response.status_code, 200)

    @patch("exam_batch_management.views.Batch.objects.get")
    def test_400_batch_does_not_exist(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Batch.DoesNotExist()
        response = self.client.get(self.no_batch_url,format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error_code'], 'e1106') 
    

    @patch("exam_batch_management.views.Batch.objects.get")
    def test_400_batch_does_not_exist(self, mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Exception("forced Exception")
        response = self.client.get(self.url,format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    

class ChangeBatchStatus(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.exam_location = ExamLocations.objects.create(
            id=1,
            location_name="demolocation",
            status=True,
        )
        self.exam = Exam.objects.create(
            id=1,
            exam_name="Valid name",
            exam_date=valid_current_year,
            exam_time="12:00:00",
            exam_duration=60,
            exam_location=self.exam_location,
            status_of_exam=1
        )
        self.batch = Batch.objects.create(
            id=1,
            batch_name="Valid name",
            exam=self.exam,
            status=True,
            count_of_students=1
            )
        self.batch_closed = Batch.objects.create(
            id=2,
            batch_name="Closed batch",
            exam=self.exam,
            status=True,
            count_of_students=1,
            batch_status=Batch.CLOSED
            )
        
        self.valid_url = reverse("delete_batch",kwargs={'pk': self.batch.id})
        self.closed_batch_url = reverse("delete_batch",kwargs={'pk':self.batch_closed.id})
        
    def test_200_ok(self):
        self.client.force_authenticate(user=self.admin)
        response=self.client.patch(self.valid_url, {"batchStatus": Batch.CLOSED}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_400_already_closed(self):
        self.client.force_authenticate(user=self.admin)
        response=self.client.patch(self.closed_batch_url, {"batchStatus": Batch.CLOSED}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch("exam_batch_management.views.Batch.objects.get")
    def test_400_no_batch(self,mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Batch.DoesNotExist()
        response=self.client.patch(self.valid_url, {"batchStatus": Batch.CLOSED}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch("exam_batch_management.views.Exam.objects.get")
    def test_400_exam_not_found(self,mock_get):
        self.client.force_authenticate(user=self.admin)
        mock_get.side_effect = Exam.DoesNotExist()
        response=self.client.patch(self.valid_url, {"batchStatus": Batch.CLOSED}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    
    def test_400_no_batch_status(self):
        self.client.force_authenticate(user=self.admin)
        response=self.client.patch(self.valid_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_400_invalid_batch_status(self):
        self.client.force_authenticate(user=self.admin)
        response=self.client.patch(self.valid_url, {"batchStatus": "Invalid status"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_400_batch_status_not_in_1_and_2(self):
        self.client.force_authenticate(user=self.admin)
        response=self.client.patch(self.valid_url, {"batchStatus": 3}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    
    
        
class DeleteStudentFromBatchTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = Admin.objects.create(
            id=1, email="test@gmail.com", password="test@password.com", status=True
        )
        self.exam_location = ExamLocations.objects.create(
            id=1,
            location_name="demolocation",
            status=True,
        )
        self.exam = Exam.objects.create(
            id=1,
            exam_name="Valid name",
            exam_date=valid_current_year,
            exam_time="12:00:00",
            exam_duration=60,
            exam_location=self.exam_location,
            status_of_exam=1
        )
        self.batch = Batch.objects.create(
            id=1,
            batch_name="Valid name",
            exam=self.exam,
            status=True,
            count_of_students=1
            )
        self.institution = Institution.objects.create(
            id=1,
            institution_name="Valid name",
        )
        self.student = Student.objects.create(
            id=1,
            name="John Doe",
            email="john.doe@example.com",
            phone="1234567890",
            institution=self.institution,  # Assuming Institution is required
            pass_out_year=2022,
            cgpa=3.8,
            no_of_backlogs=0,
            course=Student.BTECH_CSE,
            status=1
        )
        self.mapping = StudentBatchMapping.objects.create(
            exam_id=self.exam.id,
            student=self.student,
            batch=self.batch,
            student_status=1
        )
        
        self.valid_url = reverse('student_view',kwargs={'pk':self.batch.id})
        self.invalid_batch_id = reverse('student_view',kwargs={'pk':22})
        
    def test_200_ok(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.valid_url+"?studentId=1", format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_400_batch_does_not_exist(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.invalid_batch_id+"?studentId=1", format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch('exam_batch_management.views.Exam.objects.filter')
    def test_400_exam_doesnotexist(self,mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Exam.DoesNotExist()
        response = self.client.delete(self.valid_url+"?studentId=1", format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch('exam_batch_management.views.StudentBatchMapping.objects.filter')
    def test_400_student_mapping_doesnotexist(self,mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = StudentBatchMapping.DoesNotExist()
        response = self.client.delete(self.valid_url+"?studentId=1", format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch('exam_batch_management.views.StudentBatchMapping.objects.filter')
    def test_400_exception(self,mock_filter):
        self.client.force_authenticate(user=self.admin)
        mock_filter.side_effect = Exception()
        response = self.client.delete(self.valid_url+"?studentId=1", format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
        
        
            
            
        
        


