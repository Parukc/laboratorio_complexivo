from rest_framework import serializers
from .models import lab_tests, lab_orders

class lab_testsSerializer(serializers.ModelSerializer):
    class Meta:
        model = lab_tests
        fields = ["id", "test_name", "sample_type", "price", "is_available"]

class lab_ordersSerializer(serializers.ModelSerializer):
    lab_tests_name = serializers.CharField(source="test_id.test_name", read_only=True)

    class Meta:
        model = lab_orders
        fields = ["id", "test_id", "lab_tests_name", "patient_name", "status", "result_summary", "created_at"]