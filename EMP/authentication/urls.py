from django.urls import path
from .views import OTPLoginView, get_current_user
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('otp/', OTPLoginView.as_view(), name='otp_login'),
    path('me/', get_current_user, name='get_current_user'),
    # path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]