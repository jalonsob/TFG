from django.db import models

# Create your models here.
class Plantilla(models.Model):
	n= models.IntegerField()
	json= models.TextField()