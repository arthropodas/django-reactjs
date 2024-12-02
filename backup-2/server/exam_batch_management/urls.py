from django.urls import path
from .views import BatchsView,BatchView,BatchStudentsView


urlpatterns = [
    path('admin/batch', BatchsView.as_view(), name='batch_view'),
    path('admin/batch/<int:pk>',BatchView.as_view(), name='delete_batch'),
    path('admin/batch/<int:pk>/student',BatchStudentsView.as_view(),name="student_view")
]