from django.db import models


class Institution(models.Model):
    institution_name = models.CharField(max_length=100)
    institution_code = models.CharField(
        max_length=10, unique=True, blank=True, null=True
    )
    institution_email = models.EmailField(max_length=100, blank=True, null=True)
    institution_phone = models.CharField(max_length=15, blank=True, null=True)
    coordinator_name = models.CharField(max_length=100, blank=True, null=True)
    coordinator_phone = models.CharField(max_length=100, blank=True, null=True)
    coordinator_email = models.EmailField(max_length=100, blank=True, null=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'institution'