from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        try:
            serializer.save(creator=self.request.user)
        except Exception as e:
            print("❌ Event creation failed:", e)
            raise



    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)