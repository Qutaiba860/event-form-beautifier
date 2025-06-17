from django.db import models
from users.models import User
from events.models import Event

class Media(models.Model):
    url = models.TextField()
    media_type = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    size = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.media_type})"