from rest_framework import serializers
from .models import Batch


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = [
            "id",
            "uuid",
            "batch_name",
            "count_of_students",
            "status",
            "batch_status",
        ]
