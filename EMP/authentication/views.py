import random
import json
import traceback

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
# Simulated OTP store
OTP_STORE = {}

class OTPLoginView(APIView):
    def post(self, request):
        print("REACHED /api/auth/otp")  # sanity check
        try:
            data = request.data
            if isinstance(data, str):
                data = json.loads(data)

            email = data.get("email")
            otp = data.get("otp")

            if not email:
                return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

            from users.models import User  # just to be sure, also verify this import
            try:
                user = User.objects.get(email=email)
            except ObjectDoesNotExist:
                return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

            if not otp:
                generated_otp = str(random.randint(100000, 999999))
                OTP_STORE[email] = generated_otp
                subject = "Your AURAK Event Platform OTP"
                message = f"Your OTP is: <strong>{generated_otp}</strong>"

                from django.core.mail import EmailMessage
                email_message = EmailMessage(
                    subject,
                    message,
                    settings.EMAIL_HOST_USER,
                    [email]
                )
                email_message.content_subtype = "html"
                email_message.send()

                return Response({"detail": f"OTP sent to {email}"}, status=status.HTTP_200_OK)

            if OTP_STORE.get(email) != otp:
                return Response({"detail": "Invalid OTP"}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            profile = getattr(user, "userprofile", None)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "department": profile.department if profile else "",
                    "phone": profile.phone if profile else "",
                }
            }, status=status.HTTP_200_OK) 

        except Exception as e:
            print("❌ ERROR OCCURRED:", str(e))
            traceback.print_exc()  # ⬅️ show full stack trace
            return Response({"detail": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    profile = getattr(user, "userprofile", None)

    return Response({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "department": profile.department if profile else "",
        "phone": profile.phone if profile else "",
    })