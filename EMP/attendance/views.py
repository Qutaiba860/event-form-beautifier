import io
from rest_framework import generics
from django.core.mail import EmailMessage
from .models import Attendance
from .serializers import AttendanceSerializer
from barcode import Code128
from barcode.writer import ImageWriter
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Attendance

class AttendeeCreateView(generics.CreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def perform_create(self, serializer):
        attendee = serializer.save()

        # Generate barcode image in memory
        barcode_data = attendee.barcode
        barcode_io = io.BytesIO()
        barcode = Code128(barcode_data, writer=ImageWriter())
        barcode.write(barcode_io)

        # Reset pointer and name the file
        barcode_io.seek(0)
        barcode_filename = f"{attendee.barcode}.png"

        # Send email with barcode image attached
        email = EmailMessage(
            subject="Your Event Registration Barcode",
            body=f"Hello {attendee.first_name},\n\nThank you for registering. Please find your unique barcode attached.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[attendee.email],
        )
        email.attach(barcode_filename, barcode_io.read(), "image/png")
        email.send(fail_silently=False)

class BarcodeScanView(APIView):
    def post(self, request):
        barcode = request.data.get("barcode")
        try:
            attendee = Attendance.objects.get(barcode=barcode)
            if not attendee.is_present:
                attendee.is_present = True
                attendee.checkin_time = timezone.now()
                attendee.save()

            # Construct full name
            full_name = f"{attendee.first_name} {attendee.last_name}"
            role = attendee.affiliation  # e.g. "student", "faculty", etc.

            return Response({
                "status": "success",
                "message": f"{role.title()} {full_name} marked present",
                "attendee": {
                    "name": full_name,
                    "role": role,
                    "checkin_time": attendee.checkin_time
                }
            })
        except Attendance.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Attendee not found"
            }, status=404)

class PresentAttendeesView(APIView):
    def get(self, request, event_id):
        attendees = Attendance.objects.filter(event_id=event_id, is_present=True)
        serializer = AttendanceSerializer(attendees, many=True)
        return Response(serializer.data)