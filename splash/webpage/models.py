from django.db import models
from uuid import uuid4


# Create your models here.
class Ufficio(models.Model):
    pkid = models.UUIDField(primary_key=True, default=uuid4)
    name = models.CharField(max_length=25)

    def __str__(self):
        return self.name

class Orario(models.Model):
    pkid = models.UUIDField(primary_key=True, default=uuid4)
    fkufficio = models.ForeignKey(to=Ufficio, on_delete=models.CASCADE, related_name='orario')
    time_start = models.TimeField()
    time_end = models.TimeField()
    day_of_week = models.IntegerField()

    def __str__(self):
        return f"{self.fkufficio.name}: {self.time_start}-{self.time_end} gg {self.day_of_week}"