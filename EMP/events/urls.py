from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet
from .views import notify_chair

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')

urlpatterns = [
    path('', include(router.urls)),
    path('notify-chair/', notify_chair, name='notify-chair'),  # ✅ this line
]
