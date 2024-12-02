from django.urls import path
from .views import QuestionCreateListView, QuestionDeleteUpdateView, QuestionCSVUploadView


urlpatterns = [
    path(
        "admin/question-management/",
        QuestionCreateListView.as_view(),
        name="create_and_list_question",
    ),
    path(
        "admin/question-management/<int:question_id>",
        QuestionDeleteUpdateView.as_view(),
        name="delete_and_update_question",
    ),
    path(
        "admin/question-management/bulk-upload",
        QuestionCSVUploadView.as_view(),
        name="question_bulk_upload",
    ),
]
