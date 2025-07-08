import uuid
from django.db import models
from events.models import Event

def generate_barcode():
    return uuid.uuid4().hex[:10].upper()

class Attendance(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendees')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    affiliation = models.CharField(max_length=20, choices=[
        ('faculty', 'Faculty'),
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('external', 'External'),
    ])
    aurak_id = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    organization = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    dietary_restrictions = models.TextField(blank=True, null=True)
    special_requests = models.TextField(blank=True, null=True)
    barcode = models.CharField(max_length=10, unique=True, editable=False, default=generate_barcode)
    created_at = models.DateTimeField(auto_now_add=True)
    is_present = models.BooleanField(default=False)
    checkin_time = models.DateTimeField(null=True, blank=True)



    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.barcode}"
