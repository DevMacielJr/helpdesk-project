from rest_framework import viewsets
from .models import Ticket
from .serializers import TicketSerializer
from django.http import JsonResponse

import requests
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-criado_em')
    serializer_class = TicketSerializer

    def perform_create(self, serializer):
        ticket = serializer.save()
        
        # envia notificação para o servidor WebSocket (Node.js)
        try:
            requests.post('http://localhost:8080/notificar', json={
                'tipo': 'novo_ticket',
                'titulo': ticket.titulo,
                'descricao': ticket.descricao,
                'id': ticket.id
            })
        except requests.exceptions.RequestException as e:
            print(f"Erro ao notificar WebSocket: {e}")

    @action(detail=True, methods=['post'])
    def marcar_visualizado(self, request, pk=None):
        ticket = self.get_object()
        ticket.visualizado = True
        ticket.save()
        return Response({'status': 'Chamado marcado como visualizado'}, status=status.HTTP_200_OK)

def index(request):
    return JsonResponse({"mensagem": "Bem-vindo à API do HelpDesk"})
