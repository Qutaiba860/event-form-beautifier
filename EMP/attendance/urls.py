from django.urls import path
from .views import AttendeeCreateView
from .views import BarcodeScanView
from .views import PresentAttendeesView

urlpatterns = [
    path('register/', AttendeeCreateView.as_view(), name='attendee-register'),
    path('scan/', BarcodeScanView.as_view(), name='scan-barcode'),
    path('present/<int:event_id>/', PresentAttendeesView.as_view(), name='present-attendees'),
]
