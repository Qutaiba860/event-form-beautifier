from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, parsers
from .models import Media, Document
from .serializers import MediaSerializer, DocumentSerializer

class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer

    def get_queryset(self):
        queryset = Media.objects.all()
        event_id = self.request.query_params.get("event")
        if event_id:
            queryset = queryset.filter(event__id=event_id)
        return queryset
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def get_queryset(self):
        queryset = Document.objects.all()
        event_id = self.request.query_params.get("event")
        if event_id:
            queryset = queryset.filter(event__id=event_id)
        return queryset
    def perform_create(self, serializer):
        print("📥 Incoming FILES:", self.request.FILES)
        print("📥 Incoming DATA:", self.request.data)

        file = self.request.data.get("file")
        if file:
            serializer.save(
                name=file.name,
                type=file.content_type,
                size=file.size,
            )
        else:
            serializer.save()

            