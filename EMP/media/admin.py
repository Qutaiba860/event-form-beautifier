from django.contrib import admin
from .models import Media

# @admin.register(Media)
# class MediaAdmin(admin.ModelAdmin):
#     list_display = ("name", "media_type", "event", "uploaded_by", "size")
class MediaAdmin(admin.ModelAdmin):
    list_display = ['name', 'media_type', 'event', 'uploaded_by', 'size']
    search_fields = ['name', 'event__name', 'uploaded_by__email']