from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    creator = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_creator(self, obj):
        return {
            "email": obj.creator.email if obj.creator else None
        }