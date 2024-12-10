from django.urls import path
from .views import ShortlistStudents, ExamCriteriaView


urlpatterns = [
    path(
        "admin/shortlist/students/<int:exam_id>",
        ShortlistStudents.as_view(),
        name="shortlist-students",
    ),
    path(
        "admin/shortlist/exam/criteria/<int:exam_id>",
        ExamCriteriaView.as_view(),
        name="exam-criteria",
    ),
]
