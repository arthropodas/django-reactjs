from django.db import models
from student_management.models import Student
from exam_management.models import Exam


# Create your models here.
class Batch(models.Model):

    OPEN = 1
    CLOSED = 2
    EXAM_BATCH_STATUS = (
        (OPEN, "exam batch is open"),
        (CLOSED, "exam batch is closed"),
    )
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    uuid = models.CharField(max_length=10)
    batch_name = models.CharField(max_length=100)
    count_of_students = models.IntegerField()
    batch_status = models.IntegerField(choices=EXAM_BATCH_STATUS, default=OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = "batch"


class StudentBatchMapping(models.Model):

    SCHEDULED = 0
    STARTED = 1
    COMPLETED = 2
    TERMINATED = 3
    REJECTED = 4
    SHORTLISTED = 5
    PROCESSING = 6
    EXAM_STUDENT_STATUS = (
        (SCHEDULED, "exam scheduled for the student"),
        (STARTED, "exam started for the student"),
        (COMPLETED, "exam completed for the student"),
        (TERMINATED, "exam terminated for the student"),
        (REJECTED, "student is rejected from the exam"),
        (SHORTLISTED, "student is shortlisted from the exam"),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    student_status = models.IntegerField(choices=EXAM_STUDENT_STATUS, default=SCHEDULED)
    correct_count = models.IntegerField()
    exam_start_time = models.DateTimeField(null=True)
    correct_count = models.IntegerField(default=0)
    exam_end_time = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Exam details created time
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "student_batch_mapping"
