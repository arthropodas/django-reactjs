from django.urls import path
from .views import (
    CreateListExam,
    ExamEditListGetById,
    QuestionPaperSendView,
    CountOfQuestions,
    CountOfStudentsInExam,
    ExamReportView,
)


ADMIN = "admin"

urlpatterns = [
    path("admin/exams", CreateListExam.as_view(), name="exam_create_list"),
    path(
        "admin/exams/<int:exam_id>",
        ExamEditListGetById.as_view(),
        name="exam_edit_delete_get_by_id",
    ),
    path(
        "student/exam-management/question-paper",
        QuestionPaperSendView.as_view(),
        name="question-paper-token",
    ),
    path(
        "admin/exam/question-category-count",
        CountOfQuestions.as_view(),
        name="count_of_questions_of_each_category",
    ),
    path(
        "admin/exam/<int:pk>/count-students",
        CountOfStudentsInExam.as_view(),
        name="count_of_students",
    ),
    path(
        "admin/exam-report/<int:pk>",
        ExamReportView.as_view(),
        name="exam-report",
    ),
]
