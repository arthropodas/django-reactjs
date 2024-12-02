from django.urls import path
from .views import PreviewQuestionnaireView,CreateListQuestionnaireView, QuestionnaireDetailsView, QuestionnaireGetEditDeleteView



urlpatterns = [
    path('admin/questionnaire/preview', PreviewQuestionnaireView.as_view(), name='preview_questionnaire'),
    path('admin/questionnaire', CreateListQuestionnaireView.as_view(), name='create_list_questionnaire'),
    path('admin/questionnaire/<int:pk>', QuestionnaireGetEditDeleteView.as_view(), name='get_edit_delete_questionnaire'),
    path('admin/questionnaire/details/<int:pk>', QuestionnaireDetailsView.as_view(), name='detail_questionnaire'),
]
