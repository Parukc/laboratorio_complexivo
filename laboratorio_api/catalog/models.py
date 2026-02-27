from django.db import models


class lab_tests(models.Model):
    test_name = models.CharField(max_length=150, unique=True)
    sample_type = models.CharField(max_length=60, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.test_name


class lab_orders(models.Model):
    class Status(models.TextChoices):
        CREATED = "created", "Created"
        PROCESSING = "processing", "Processing"
        CANCELLED = "cancelled", "Cancelled"

    test_id = models.ForeignKey(lab_tests, on_delete=models.PROTECT, related_name="lab_orders")
    patient_name = models.CharField(max_length=120)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CREATED)
    result_summary = models.CharField(max_length=300, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.test_id.test_name} {self.patient_name}"
