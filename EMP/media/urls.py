from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaViewSet, DocumentViewSet

router = DefaultRouter()
router.register(r'media', MediaViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
