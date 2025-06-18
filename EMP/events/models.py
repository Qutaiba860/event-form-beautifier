from django.db import models
from users.models import User
from core.models import Tag

class UserEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey("events.Event", on_delete=models.CASCADE)  # ← string reference

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"{self.user} → {self.event}"


class Event(models.Model):
    name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=50)
    description = models.TextField()
    host = models.CharField(max_length=100)
    venue = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    goals = models.TextField(blank=True)
    expected_students = models.IntegerField(blank=True, null=True)
    expected_faculty = models.IntegerField(blank=True, null=True)
    expected_community = models.IntegerField(blank=True, null=True)
    expected_others = models.IntegerField(blank=True, null=True)
    target_audience = models.CharField(max_length=255, blank=True)


    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"


class EventTag(models.Model):
    event = models.ForeignKey("events.Event", on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('event', 'tag')

    def __str__(self):
        return f"{self.event} tagged with {self.tag}"
