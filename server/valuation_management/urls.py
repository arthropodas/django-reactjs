from .views import ExamValuation
from django.urls import path

urlpatterns = [
    path("student/valuation", ExamValuation.as_view(), name="exam_valuation"),
]
