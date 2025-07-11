from rest_framework import viewsets
from .models import Ticket
from .serializers import TicketSerializer
from django.http import JsonResponse 
from django.db import models

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-criado_em')
    serializer_class = TicketSerializer

def index(request):
    return JsonResponse({"mensagem": "Bem-vindo à API do HelpDesk"})