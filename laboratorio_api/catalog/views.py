from rest_framework import viewsets
from rest_framework.permissions import AllowAny
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

class lab_ordersViewSet(viewsets.ModelViewSet):
    queryset = lab_orders.objects.select_related("lab_tests").all().order_by("-id")
    serializer_class = lab_ordersSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["test_id"]
    search_fields = ["patient_name", "status", "result_summary", "created_at"]
    ordering_fields = ["id", "patient_name", "status", "result_summary", "created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        anio_min = self.request.query_params.get("anio_min")
        anio_max = self.request.query_params.get("anio_max")
        if anio_min:
            qs = qs.filter(anio__gte=int(anio_min))
        if anio_max:
            qs = qs.filter(anio__lte=int(anio_max))
        return qs

    def get_permissions(self):
        # Público: SOLO listar vehículos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()