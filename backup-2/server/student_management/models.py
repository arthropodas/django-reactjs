from django.db import models
from exam_management.models import Exam
from institution_management.models import Institution

class Student(models.Model):
    BTECH_CSE = 1
    BTECH_IT = 2
    BE_CSE = 3
    BE_IT = 4
    BCA = 5
    MCA = 6
    MCS_CS = 7
    BSC_CS = 8
    BTECH_AI_DS = 9

    COURSE_CHOICES = (
        (BTECH_CSE, "Bachelor of Technology in Computer Science and Engineering"),
        (BTECH_IT, "Bachelor of Technology in Information Technology"),
        (BE_CSE, "Bachelor of Engineering in Computer Science and Engineering"),
        (BE_IT, "Bachelor of Engineering in Information Technology"),
        (BCA, "Bachelor of Computer Applications"),
        (MCA, "Master of Computer Applications"),
        (MCS_CS, "Master of Computer Science"),
        (BSC_CS, "Bachelor of Science in Computer Science"),
        (BTECH_AI_DS,"Bachelor of Engineering in Artificial Intelligence and Data Science")
    )

    name = models.CharField(max_length=100)  # Student name
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=15)
    institution = models.ForeignKey(
        Institution, on_delete=models.CASCADE, null=True, blank=True
    )
    pass_out_year = models.IntegerField()
    course = models.IntegerField(choices=COURSE_CHOICES) 
    cgpa = models.FloatField()
    no_of_backlogs = models.IntegerField()
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student'
