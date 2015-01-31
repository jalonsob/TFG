from django.shortcuts import render
from django.http import *
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect
from models import Plantilla
import json
# Create your views here.

def home(request):
	return render_to_response("dashboard.html")

@csrf_exempt
def totalList(request):
	if request.method== 'POST':
		d=json.loads(request.body)
		T_Plantilla= Plantilla(n=d['N'],json=json.dumps(d['C']))
		T_Plantilla.save()
		return HttpResponse("Su dashboard ha sido creado")
	elif request.method=='GET':
		Plantillas = Plantilla.objects.all()
		response=''
		for x in Plantillas :
			if response=='':
				response = response+ str(x.n)
			else:
				response = response+","+str(x.n)
		return HttpResponse(response)

@csrf_exempt
def loadall(request):
	if request.method== 'PUT':
		d=json.loads(request.body)
		T_Plantilla= Plantilla.objects.get(n=d['N'])
		T_Plantilla.json=json.dumps(d['C'])
		T_Plantilla.save()
		return HttpResponse("Plantilla guardada satisfactoriamente")
		
	
	
