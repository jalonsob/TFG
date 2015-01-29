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

def loadall(request):
	# asi es como cojo el contenido de lo que me piden
	print request.body
	# asi es como e responde
	return HttpResponse("funciona el db/324")
	# asi es como se saca todo
	
	
