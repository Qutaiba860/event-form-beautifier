from rest_framework import serializers
from .models import Media, Document

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'file', 'media_type', 'name', 'uploaded_by', 'event', 'size']
        read_only_fields = ['uploaded_by', 'size', 'name', 'media_type']

    def create(self, validated_data):
        uploaded_file = self.context['request'].FILES.get('file')
        validated_data['name'] = uploaded_file.name
        validated_data['size'] = uploaded_file.size
        validated_data['media_type'] = uploaded_file.content_type
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)


class DocumentSerializer(serializers.ModelSerializer):
    url = serializers.FileField(source='file', read_only=True)

    class Meta:
        model = Document
        fields = ['id', 'name', 'type', 'size', 'event', 'url']
        read_only_fields = ['name', 'type', 'size']

    def create(self, validated_data):
        uploaded_file = self.context['request'].FILES.get('file')
        validated_data['name'] = uploaded_file.name
        validated_data['type'] = uploaded_file.content_type
        validated_data['size'] = uploaded_file.size
        return super().create(validated_data)
