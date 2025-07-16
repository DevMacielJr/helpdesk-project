from django.db import models

class Ticket(models.Model):
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)
    resolvido = models.BooleanField(default=False)


    visualizado = models.BooleanField(default=False)


    def __str__(self):
        return self.titulo
