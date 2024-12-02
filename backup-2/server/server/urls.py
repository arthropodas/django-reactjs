from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


BASE_URL = "recruit-system/"

urlpatterns = [
    path(BASE_URL, include("admin_management.urls")),
    path(BASE_URL, include("question_category_management.urls")),
    path(BASE_URL, include("institution_management.urls")),
    path(BASE_URL, include("student_management.urls")),
    path(BASE_URL, include("question_management.urls")),
    path(BASE_URL, include("exam_management.urls")),
    path(BASE_URL, include("valuation_management.urls")),
    path(BASE_URL, include("questionnaire_management.urls")),
    path(BASE_URL, include("exam_batch_management.urls")),
    path(BASE_URL, include("shortlist_management.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
