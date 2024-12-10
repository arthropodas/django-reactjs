from django.urls import path
from .views import CreateAndListQuestionCategory,EditAndDeleteQuestionCategoryDetails

ADMIN = 'admin'

urlpatterns = [
    path('admin/question-categories', CreateAndListQuestionCategory.as_view(), name='question_category_create_list'),
    path('admin/question-categories/<int:pk>', EditAndDeleteQuestionCategoryDetails.as_view(), name='question_category_edit_delete_fetch_by_id'),
]