from rest_framework import serializers


class test_catalogSerializer(serializers.Serializer):
    test_name = serializers.CharField(max_length=120)
    category = serializers.CharField(required=False, allow_blank=True)
    normal_range = serializers.FloatField(required=False)
    is_active = serializers.BooleanField(default=True)


class lab_order_eventsSerializer(serializers.Serializer):
    lab_order_id = serializers.IntegerField()      
    test_catalog_id = serializers.CharField()      
    date = serializers.DateField(required=False)
    cost = serializers.FloatField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)