from django.urls import path
from .views import OTPLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('otp/', OTPLoginView.as_view(), name='otp_login'),
    # path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]