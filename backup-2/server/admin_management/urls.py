from django.urls import path

from .views import  CustomTokenRefreshView, AdminDashboardData, AddListFeedback, DropDownLists, AdminLoginAPIView,AdminViewFeedback,DropDownListsStudent


urlpatterns = [
   

    path('admin/auth/login', AdminLoginAPIView.as_view(),name='admin_login'),
    path('admin/login/refresh', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('admin/dashboard', AdminDashboardData.as_view(), name='dashboard'),
    path('student/feedbacks',AddListFeedback.as_view(),name='add_list_feedback'),
    path('admin/feedbacks',AdminViewFeedback.as_view(),name='admin_view_feedbacks'),
    path('admin/dropdown-list/<str:required_dropdown>',DropDownLists.as_view(), name='dropdown_list'),
    path('student/dropdown-list/<str:required_dropdown>',DropDownListsStudent.as_view(), name='dropdown_list_student')

]
