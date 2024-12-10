import json
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch
from admin_management.models import Admin
from institution_management.models import Institution
from exam_management.models import Exam
from datetime import datetime
from student_management.models import Student
from question_category_management.models import QuestionCategory
from server.utils.messages.error_messages import error_code_e2029
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from exam_management.models import  Exam
from question_management.models import QuestionData, Options
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from admin_management.models import Admin
from exam_management.models import ExamLocations
from questionnaire_management.models import Questionnaire, QuestionnaireQuestions
from exam_batch_management.models import StudentBatchMapping, Batch

current_date = datetime.now()
valid_current_year = current_date.strftime("%Y-%m-%d")  
PHONE_NUMBER = '1234567890'
INSTITUTION_EMAIL = 'institution@gmail.com'
CORDINATOR_EMAIL = 'cordinator@gmail.com'

LOCATION_NAME = "ABC college"

QUETIONNAIRE_NAME = 'MODEL question papaer'
EXAM_NAME = "Sample Exam"

BATCH_UUID = "1234567890"
BATCH_NAME = "Batch 2024"
BATCH_COUNT_OF_STUDENTS = 50
BATCH_STATUS = Batch.OPEN
TERMINATE_DATA = data = {
            "action": "terminate",
            
        }

ACTION_SUBMIT = "submit"
ACTION_TERMINATE = "terminate"
EXAM_TIME = "12:00:00"


def create_exam(self, exam_name, status_of_exam, questionnaire, location, date=None, time=None):
    """Utility function to create an exam with a given status."""
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")
    if time is None:
        time = "12:00:00"
    return Exam.objects.create(
        exam_name=exam_name,
        exam_date=date,
        exam_time=time,
        exam_duration=60,
        status_of_exam=status_of_exam,
        exam_location=location,
        questionnaire=questionnaire,
    )


def create_batch(self, exam, batch_name, batch_status, student_count=50):
    """Utility function to create a batch linked to an exam."""
    return Batch.objects.create(
        exam=exam,
        uuid=str(datetime.now().timestamp()),  # Generate a unique UUID
        batch_name=batch_name,
        count_of_students=student_count,
        batch_status=batch_status,
    )


def map_student_to_batch(self, student, exam, batch, student_status=1, correct_count=0):
    """Utility function to map a student to an exam batch."""
    return StudentBatchMapping.objects.create(
        student=student,
        exam=exam,
        batch=batch,
        student_status=student_status,
        correct_count=correct_count,
    )


class ExamValuationTestCase(APITestCase):

    def setUp(self):
        self.questions = []
        self.valid_inputs = {} 

        self.institution = Institution.objects.create(
            id=1,
            institution_name="Active Institution",
            institution_code="Active123",
            institution_email = 'institution@gmail.com',
            institution_phone = PHONE_NUMBER,
            coordinator_name = 'cordinator',
            coordinator_phone = PHONE_NUMBER,
            coordinator_email = CORDINATOR_EMAIL,
            status=True,
        )
        self.exam_location = ExamLocations.objects.create(
            
            location_name = LOCATION_NAME,
        
        )
        self.questionnaire = Questionnaire.objects.create(
            questionnaire_name = QUETIONNAIRE_NAME,
            
        )
        self.exam = Exam.objects.create(
            id=1,
            exam_name=EXAM_NAME,
            exam_date=valid_current_year,
            exam_time= EXAM_TIME,
            exam_duration=60,
            status_of_exam = Exam.STARTED,
            exam_location = self.exam_location,
            questionnaire = self.questionnaire     
        )
        self.exam_completed = Exam.objects.create(
            id=2,
            exam_name=EXAM_NAME,
            exam_date=valid_current_year,
            exam_time= EXAM_TIME,
            exam_duration=60,
            status_of_exam = Exam.COMPLETED,
            exam_location = self.exam_location,
            questionnaire = self.questionnaire     
        )
        self.exam_scheduled = Exam.objects.create(
            id=3,
            exam_name=EXAM_NAME,
            exam_date=valid_current_year,
            exam_time= EXAM_TIME,
            exam_duration=60,
            status_of_exam = Exam.SCHEDULED,
            exam_location = self.exam_location,
            questionnaire = self.questionnaire     
        )

        self.student1 = Student.objects.create(
            name="John Doe",
            email="johndoe@example.com",
            phone="1234567890",
            pass_out_year=2023,
            institution=self.institution,
            status=1,
            cgpa = 6,
            course = 1,
            no_of_backlogs = 0
        )
        self.student2 = Student.objects.create(
            name="John Doed",
            email="johndoed@example.com",
            phone="1234567790",
            pass_out_year=2023,
            institution=self.institution,
            status=1,
            cgpa = 6,
            course = 1,
            no_of_backlogs = 0
        )
        self.student3 = Student.objects.create(
            name="Johnie Doed",
            email="johndoed@example.com",
            phone="1234567790",
            pass_out_year=2023,
            institution=self.institution,
            status=1,
            cgpa = 6,
            course = 1,
            no_of_backlogs = 0
        )
        self.batch1 = Batch.objects.create(
            id = 1,
            exam=self.exam,
            uuid=BATCH_UUID,
            batch_name=BATCH_NAME,
            count_of_students=BATCH_COUNT_OF_STUDENTS,
            batch_status=BATCH_STATUS,
            
        )
        self.completed_exam_batch =Batch.objects.create(
            id =2,
            exam=self.exam_completed,
            uuid=BATCH_UUID,
            batch_name=BATCH_NAME,
            count_of_students=BATCH_COUNT_OF_STUDENTS,
            batch_status=BATCH_STATUS,
            
        )
        self.scheduled_exam_batch =Batch.objects.create(
            id =3,
            exam=self.exam_scheduled,
            uuid=BATCH_UUID,
            batch_name=BATCH_NAME,
            count_of_students=BATCH_COUNT_OF_STUDENTS,
            batch_status=BATCH_STATUS,
            
        )
        self.StudentBatchMapping = StudentBatchMapping.objects.create(
            student = self.student1,
            exam = self.exam,
            batch = self.batch1,
            student_status = 1,
            correct_count = 0,   
        )
        self.StudentBatchMapping2 = StudentBatchMapping.objects.create(
            student = self.student2,
            exam = self.exam_completed,
            batch = self.completed_exam_batch,
            student_status = 1,
            correct_count = 0,
        )
        self.StudentBatchMapping3 = StudentBatchMapping.objects.create(
            student = self.student3,
            exam = self.exam_scheduled,
            batch = self.scheduled_exam_batch,
            student_status = 1,
            correct_count = 0,
        )
        self.payload = {
                    "student_id": self.student1.id,
                    "batch_id": self.batch1.id,
                    "batch_uuid": self.batch1.uuid,
                }
        self.invalid_payload = {
                    "student_id": self.student2.id,
                    "batch_id": self.completed_exam_batch.id,
                    "batch_uuid": self.completed_exam_batch.uuid,
                }
        self.scheduled_payload ={
            
                    "student_id": self.student3.id,
                    "batch_id": self.scheduled_exam_batch.id,
                    "batch_uuid": self.scheduled_exam_batch.uuid,
                
        }
        self.token = jwt.encode(self.payload, settings.SECRET_KEY, algorithm="HS256")
        self.token_completed_exam = jwt.encode(self.invalid_payload, settings.SECRET_KEY, algorithm = "HS256")
        self.scheduled_token = jwt.encode(self.scheduled_payload, settings.SECRET_KEY, algorithm = "HS256")
        self.category = QuestionCategory.objects.create(
            question_category_name="Mock Category"
        )

        self.question_data1 = QuestionData.objects.create(
            id=2,
            question="What is the capital of India?",
            question_category_id=self.category,
            status=1,
        )
        self.question_data2 = QuestionData.objects.create(
            id=1,
            question="What is the capital of France?",
            question_category_id=self.category,
            status=1,
        )
        
        self.option1 = Options.objects.create(
            id =1,question_id=self.question_data1, option="option1",is_correct = True
        )
        self.option2 = Options.objects.create(
            id = 2,question_id=self.question_data1, option="option2",is_correct = True
        )
        self.option3 = Options.objects.create(
            id = 3, question_id=self.question_data1, option="option3",is_correct = True
        )
        self.option4 = Options.objects.create(
            id = 4, question_id=self.question_data1, option="option4",is_correct = False
        )
        
        
        self.option1A = Options.objects.create(
            id =7,question_id=self.question_data2, option="option1A",is_correct = True
        )
        self.option2B = Options.objects.create(
            id = 5,question_id=self.question_data2, option="option2B",is_correct = True
        )
        self.option3C = Options.objects.create(
            id = 6, question_id=self.question_data2, option="option3C",is_correct = True
        )
        self.option4D = Options.objects.create(
            id = 8, question_id=self.question_data2, option="option4D",is_correct = False
        )
        self.question_questions = QuestionnaireQuestions.objects.create(
            questionnaire = self.questionnaire,
            question = self.question_data1
        )

    def test_valid_exam_valuation(self):
        url = f"{reverse('exam_valuation')}?token={self.token}"
        data = {
            "action": ACTION_SUBMIT,
             "response": [
                {"questionId": self.question_data1.id, "studentInput": [self.option1.id, self.option2.id,self.option3.id]},
               
            ],
        }
      
        response = self.client.post(url, data, format="json")
        print("respnse data", response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Valuation completed successfully")
    def test_exam_terminate(self):
        url = f"{reverse('exam_valuation')}?token={self.token}"
        data = TERMINATE_DATA
        response = self.client.post(url, data, format="json")
        print("respnse data", response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Student marked as terminated")

    def test_invalid_token(self):
        url = f"{reverse('exam_valuation')}?token=invalid token"
        data = TERMINATE_DATA

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e406")
        
    def test_invalid_exam_question(self):
            url = f"{reverse('exam_valuation')}?token={self.token}"
            data = {
                "action": ACTION_SUBMIT,
                "response": [
                    {"questionId": self.question_data2.id, "studentInput": [3, 2, 1]},
                
                ],
            }
            response = self.client.post(url, data, format="json")
            print("respnse data", response.data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(response.data["errorCode"], "e2076")
            
    def test_exam_completed(self):
        url = f"{reverse('exam_valuation')}?token={self.token_completed_exam}"
        data = TERMINATE_DATA

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2242")
    def test_exam_not_started(self):
        url = f"{reverse('exam_valuation')}?token={self.scheduled_token}"
        data = TERMINATE_DATA

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["errorCode"], "e2073")
   
   
   