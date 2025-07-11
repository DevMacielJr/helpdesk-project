from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet
from . import views  # importa o módulo views

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('index/', views.index, name='index'),
]