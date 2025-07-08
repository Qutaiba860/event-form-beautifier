from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Event
from .serializers import EventSerializer
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status



# Optional: Replace with Django Group-based permissions later
PRIVILEGED_EMAILS = [
    # "2023005883@aurak.ac.ae",
    # "Imad.hoballah@aurak.ac.ae",
    # "qutaiba.raid@gmail.com"
]

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]  # Require login

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.email in PRIVILEGED_EMAILS:
            return Event.objects.all()
        return Event.objects.filter(creator=user)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

@csrf_exempt
def notify_chair(request):
    if request.method == "POST":
        data = json.loads(request.body)
        to_email = data.get("to")
        event_name = data.get("eventName")
        department = data.get("department")
        submitted_by = data.get("submittedBy")
        submitted_email = data.get("submittedEmail")

        if to_email:
            subject = f"New Event Submission for {department}"
            message = (
                f"A new event titled '{event_name}' has been submitted by {submitted_by} ({submitted_email}).\n\n"
                f"Please log in to the platform to review it."
            )
            send_mail(subject, message, "noreply@aurak-events.com", [to_email])
            return JsonResponse({"message": "Email sent"}, status=200)
        return JsonResponse({"error": "Missing email"}, status=400)
