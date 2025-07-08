from django.db import models
from users.models import User
from events.models import Event

class Media(models.Model):
    file = models.FileField(upload_to="event_media/", null=True, blank=True, db_column="file_temp")
    media_type = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    size = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.media_type})"

class Document(models.Model):
    file = models.FileField(upload_to="documents/")
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50, blank=True)
    size = models.PositiveIntegerField(default=0)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="documents")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name