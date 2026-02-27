from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import lab_testsViewSet, lab_ordersViewSet
from .test_catalog_views import test_catalog_list_create, test_catalog_detail
from .lab_order_events_views import lab_order_events_list_create, lab_order_events_detail

router = DefaultRouter()
router.register(r"lab_tests", lab_testsViewSet, basename="lab_tests")
router.register(r"lab_orders", lab_ordersViewSet, basename="lab_orders")

urlpatterns = [
    path("test-catalog/", test_catalog_list_create),
    path("test-catalog/<str:id>/", test_catalog_detail),
    path("lab-order-events/", lab_order_events_list_create),
    path("lab-order-events/<str:id>/", lab_order_events_detail),
]
urlpatterns += router.urls