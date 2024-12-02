import threading
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from exam_management.models import Exam, ExamCriteria
from exam_batch_management.models import StudentBatchMapping
from valuation_management.models import QuestionCategoryResponse
from student_management.models import Student
from server.utils.messages.error_messages import (
    error_code_e3900,
    error_code_e4006,
    error_code_e4600,
    error_code_e4601,
    error_code_e4607,
    error_code_e4702,
    error_code_e4703,
    error_code_e4704,
    error_code_e4712,
)

from .validator.validations import (
    validate_categories,
    validate_category_ids,
    validate_action_value,
    validate_cut_off,
)
from questionnaire_management.models import QuestionnaireQuestions
from .shortlist_student_email import email_shortlisted_students
from server.utils.permissions.permission import CustomIsAuthenticated
import logging

logger = logging.getLogger("api_logger")


class ShortlistStudents(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request, exam_id):
        try:

            exam_instance = Exam.objects.get(id=exam_id, status=1)

            if exam_instance.status_of_exam != 2:
                raise ValidationError(error_code_e4607())

            cut_off_response = self.get_shortlist_data(exam_instance)

            if cut_off_response.exists():
                shortlist_data = self.process_shortlist_data(cut_off_response)
            return Response(
                {"shortlisted_students": shortlist_data},
                status=status.HTTP_200_OK,
            )

        except Exam.DoesNotExist:
            return Response(error_code_e3900(), status=status.HTTP_400_BAD_REQUEST)

    # get shortlist data

    def get_shortlist_data(self, exam_instance):
        cut_off_response = (
            StudentBatchMapping.objects.filter(exam=exam_instance)
            .prefetch_related("questioncategoryresponse")
            .values(
                "student__id",
                "student__name",
                "correct_count",
                "batch_id",
                "batch_id__batch_name",
                "questioncategoryresponse__correct_answer_count",
                "questioncategoryresponse__question_difficulty_level",
                "questioncategoryresponse__category_id",
                "questioncategoryresponse__category_id__question_category_name",
                "student_status",
                "student__institution__institution_name",
            )
            .distinct()
        )
        return cut_off_response

    # process shortlist data

    def process_shortlist_data(self, cut_off_response):
        student_data = {}

        for shortlist in cut_off_response:
            category_id = shortlist["questioncategoryresponse__category_id"]
            student_id = shortlist["student__id"]
            correct_answer_count = shortlist[
                "questioncategoryresponse__correct_answer_count"
            ]
            question_level = shortlist[
                "questioncategoryresponse__question_difficulty_level"
            ]

            category_name = shortlist[
                "questioncategoryresponse__category_id__question_category_name"
            ]

            if student_id not in student_data:
                student_data[student_id] = {
                    "studentId": student_id,
                    "studentName": shortlist["student__name"],
                    "institution": shortlist["student__institution__institution_name"],
                    "batchId": shortlist["batch_id"],
                    "batchName": shortlist["batch_id__batch_name"],
                    "mark": shortlist["correct_count"],
                    "studentStatus": shortlist["student_status"],
                    "matchedCategories": [],
                    "responses": [],
                }

            student_data[student_id]["matchedCategories"].append(
                {
                    "categoryName": category_name,
                    "categoryId": category_id,
                    "questionLevel": question_level,
                    "scoreAcquired": correct_answer_count,
                }
            )

            category_found = False
            for response in student_data[student_id]["responses"]:
                if response["category_id"] == category_id:
                    response["total"] += correct_answer_count
                    category_found = True
                    break

            if not category_found:
                student_data[student_id]["responses"].append(
                    {
                        "category_name": category_name,
                        "category_id": category_id,
                        "total": correct_answer_count,
                    }
                )

        shortlisted_students = list(student_data.values())
        return shortlisted_students

    def post(self, request, exam_id):
        categories = request.data.get("category")
        cut_off_mark = request.data.get("cut_off")
        action_value = request.data.get("action_value")

        try:
            exam_instance = Exam.objects.get(id=exam_id, status=1)

            validate_action_value(action_value)

            if cut_off_mark and not categories:
                return self.process_cut_off_only(
                    exam_instance, cut_off_mark, action_value
                )

            if categories and not cut_off_mark:
                return self.process_categories_only(
                    exam_instance, categories, action_value
                )

            if categories and cut_off_mark:
                return self.process_cut_off_and_categories(
                    exam_instance, categories, cut_off_mark, action_value
                )

            if not cut_off_mark and not categories:

                return Response(
                    error_code_e4702(),
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exam.DoesNotExist:
            return Response(error_code_e3900(), status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def process_cut_off_only(self, exam_instance, cut_off_mark, action_value):
        shortlisted_students = []
        validate_cut_off(cut_off_mark)

        cut_off_response = self.get_shortlist_data(exam_instance)

        if cut_off_response.exists():
            shortlist_data = self.process_shortlist_data(cut_off_response)
            for shortlist in shortlist_data:
                if shortlist["mark"] >= cut_off_mark:
                    shortlisted_students.append(shortlist)
        else:
            raise ValidationError(error_code_e4006())

        if shortlisted_students:
            if action_value == 0:
                return Response(
                    {"shortlisted_students": shortlisted_students},
                    status=status.HTTP_200_OK,
                )
            elif action_value == 1:

                exam_instance.cut_of_mark = cut_off_mark
                exam_instance.save()

                return self.send_email_shortlisted_students(shortlisted_students)

        else:
            return Response(error_code_e4703(), status=status.HTTP_400_BAD_REQUEST)

    def process_categories_only(self, exam_instance, categories, action_value):
        validate_categories(categories)

        if exam_instance.status_of_exam != 2:
            raise ValidationError(error_code_e4600())

        category_ids = self.get_questionnaire_category_ids(exam_instance)
        validate_category_ids(category_ids, categories)

        responses = self.get_shortlist_data(exam_instance)
        shortlisted_students = []
        if responses.exists():

            shortlist_data = self.process_shortlist_data(responses)

            shortlisted_students = self.match_categories(shortlist_data, categories)

        if shortlisted_students:
            if action_value == 0:
                return Response(
                    {"shortlisted_students": shortlisted_students},
                    status=status.HTTP_200_OK,
                )
            elif action_value == 1:

                self.save_exam_criteria(categories, exam_instance)
                return self.send_email_shortlisted_students(shortlisted_students)
        else:
            return Response(
                error_code_e4601(),
                status=status.HTTP_400_BAD_REQUEST,
            )

    def process_cut_off_and_categories(
        self, exam_instance, categories, cut_off_mark, action_value
    ):
        validate_cut_off(cut_off_mark)

        validate_categories(categories)

        if exam_instance.status_of_exam != 2:
            raise ValidationError(error_code_e4600())

        category_ids = self.get_questionnaire_category_ids(exam_instance)
        validate_category_ids(category_ids, categories)

        responses = self.get_shortlist_data(exam_instance)

        shortlisted_students = []

        if responses.exists():

            shortlist_data = self.process_shortlist_data(responses)

            cut_off_response = self.match_categories(shortlist_data, categories)
            for data in cut_off_response:
                if data["mark"] >= cut_off_mark:
                    shortlisted_students.append(data)
        else:
            raise ValidationError(error_code_e4006())

        if shortlisted_students:
            if action_value == 0:
                return Response(
                    {"shortlisted_students": shortlisted_students},
                    status=status.HTTP_200_OK,
                )
            elif action_value == 1:
                exam_instance.cut_of_mark = cut_off_mark
                exam_instance.save()
                self.save_exam_criteria(categories, exam_instance)

                return self.send_email_shortlisted_students(shortlisted_students)
        else:
            return Response(
                error_code_e4704(),
                status=status.HTTP_400_BAD_REQUEST,
            )

    def get_questionnaire_category_ids(self, exam_instance):
        category_instance = QuestionnaireQuestions.objects.filter(
            questionnaire=exam_instance.questionnaire
        )
        category_id_list = []
        for category in category_instance:
            category_id = category.question.question_category_id.id
            if category_id not in category_id_list:
                category_id_list.append(category_id)

        return category_id_list if category_id_list else []

    def match_categories(self, student_data, categories):
        matched_students = []

        for student in student_data:

            matched_categories = self.filter_student_by_categories(student, categories)

            if matched_categories:

                matched_students.append(student)

        return matched_students

    def filter_student_by_categories(self, student, categories):
        matched_scores = []

        for category in categories:
            category_id = category.get("category_id")
            cut_off = category.get("cut_off")
            question_level = category.get("question_level")

            score = self.get_matched_category_score(
                student, category_id, question_level, cut_off
            )

            if score is None:
                return []

            matched_scores.append(score)

        return matched_scores

    def get_matched_category_score(self, student, category_id, question_level, cut_off):
        for matched_category in student["matchedCategories"]:
            if (
                matched_category["categoryId"] == category_id
                and matched_category["questionLevel"] == question_level
                and matched_category["scoreAcquired"] >= cut_off
            ):
                return matched_category["scoreAcquired"]
        return None

    def send_email_shortlisted_students(self, shortlisted_students):
        email_list = self.get_email_lists(shortlisted_students)
        logger.info(f"Email list: {email_list}")

        if email_list:
            try:
                self.update_student_status(shortlisted_students)
                email_thread = threading.Thread(
                    target=lambda e=email_list: email_shortlisted_students(e)
                )
                email_thread.start()

                logger.info("Successfully initiated thread to sent the email")

                return Response(
                    {"message": "Email sent successfully"},
                    status=status.HTTP_200_OK,
                )

            except Exception as e:
                logger.error(f"An error occurred: {str(e)}")
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_email_lists(self, shortlisted_students):
        email_list = []

        for student in shortlisted_students:
            student_instance = Student.objects.get(id=student["studentId"])
            email_list.append(student_instance.email)

        return email_list

    def update_student_status(self, shortlisted_students):
        try:
            logger.info("Updating student status")
            for student in shortlisted_students:

                try:
                    student_instance = StudentBatchMapping.objects.get(
                        student_id=student["studentId"], student_status=2
                    )
                    student_instance.student_status = 5
                    student_instance.save()
                    logger.info(f"Student status updated for {student['studentId']}")
                except StudentBatchMapping.DoesNotExist:
                    logger.warning(
                        f"Student not found or already updated: {student['studentId']}"
                    )
                    continue
                except Exception as e:
                    logger.error(
                        f"Failed to update student {student['studentId']}: {str(e)}"
                    )
                    return Response(
                        {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
                    )

        except Exception as e:
            logging.error(f"Failed to update student status: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def save_exam_criteria(self, categories, exam_instance):

        try:
            exam_instance = Exam.objects.get(id=exam_instance.id, status_of_exam=2)
            ExamCriteria.objects.filter(exam=exam_instance).delete()

            for category in categories:
                category_id = category.get("category_id")
                cut_off = category.get("cut_off")
                question_level = category.get("question_level")

                exam_criteria_instance = ExamCriteria(
                    exam=exam_instance,
                    category_id=category_id,
                    cut_off=cut_off,
                    question_difficulty_level=question_level,
                )
                exam_criteria_instance.save()
        except Exam.DoesNotExist:
            return Response(error_code_e4712(), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ExamCriteriaView(APIView):
    authentication_classes = (CustomIsAuthenticated,)

    def get(self, request, exam_id):
        try:
            exam_instance = Exam.objects.get(id=exam_id)

            if exam_instance.status_of_exam != 2:
                raise ValidationError(error_code_e4712())

            exam_criteria_instance = ExamCriteria.objects.filter(exam=exam_instance)

            shortlisted_students = StudentBatchMapping.objects.filter(
                exam=exam_instance, student_status=5
            )

            criteria_list = []
            students_data = []

            for students in shortlisted_students:

                students_data.append(
                    {
                        "studentId": students.student.id,
                        "studentName": students.student.name,
                        "mark": students.correct_count,
                        "institution": students.student.institution.institution_name,
                        "studentStatus": students.student_status,
                    }
                )

            for criteria in exam_criteria_instance:
                criteria_list.append(
                    {
                        "category": criteria.category.id,
                        "categoryName": criteria.category.question_category_name,
                        "cutOff": criteria.cut_off,
                        "questionLevel": criteria.question_difficulty_level,
                    }
                )
            exam_criteria_data = {
                "examId": exam_instance.id,
                "examName": exam_instance.exam_name,
                "generalCutOff": exam_instance.cut_of_mark,
                "categoryCriteria": criteria_list,
                "shortlistedStudents": students_data,
            }
            return Response(exam_criteria_data, status=status.HTTP_200_OK)

        except Exam.DoesNotExist:
            return Response(error_code_e3900(), status=status.HTTP_400_BAD_REQUEST)
