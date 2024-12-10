from django.urls import path
from .views import CreateAndListInstitution,EditDeleteInstitute

ADMIN = 'admin'

urlpatterns = [
    path('admin/institutions', CreateAndListInstitution.as_view(), name='institution_create_list'),
    path('admin/institutions/<int:pk>', EditDeleteInstitute.as_view(), name='institution_edit_delete_get_by_id'),
]