from django.db import IntegrityError
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import lab_tests, lab_orders
from .serializers import lab_testsSerializer, lab_ordersSerializer
from .permissions import IsAdminOrReadOnly


class lab_testsViewSet(viewsets.ModelViewSet):
    queryset = lab_tests.objects.all().order_by("id")
    serializer_class = lab_testsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["test_name"]
    ordering_fields = ["id", "test_name", "price"]

    def perform_create(self, serializer):
        try:
            serializer.save()
        except IntegrityError as e:
            msg = str(e)
            if "test_name" in msg or "unique" in msg.lower():
                raise ValidationError({"test_name": "Ya existe una prueba con este nombre."})
            if "sample_type" in msg:
                raise ValidationError({"sample_type": "Ya existe una prueba con este tipo de muestra."})
            raise ValidationError("Datos duplicados. Cambia nombre de prueba o tipo de muestra.")

    def perform_update(self, serializer):
        try:
            serializer.save()
        except IntegrityError as e:
            msg = str(e)
            if "test_name" in msg or "unique" in msg.lower():
                raise ValidationError({"test_name": "Ya existe una prueba con este nombre."})
            if "sample_type" in msg:
                raise ValidationError({"sample_type": "Ya existe una prueba con este tipo de muestra."})
            raise ValidationError("Datos duplicados. Cambia nombre de prueba o tipo de muestra.")

class lab_ordersViewSet(viewsets.ModelViewSet):
    queryset = lab_orders.objects.select_related("test_id").all().order_by("-id")
    serializer_class = lab_ordersSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["test_id"]
    search_fields = ["patient_name", "status", "result_summary", "created_at"]
    ordering_fields = ["id", "patient_name", "status", "result_summary", "created_at"]

    def get_permissions(self):
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()