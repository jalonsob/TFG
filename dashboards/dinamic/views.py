from django.shortcuts import render
from django.http import *
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect
from models import P
# Create your views here.

def home(request):
	return render_to_response("dashboard.html")

@csrf_exempt
def saveall(request):
	
	try:
		T_P = P(n=request.body)
		T_P.save()
	except:
		print "No he podido guardar"

def loadall(request):
	# asi es como cojo el contenido de lo que me piden
	print request.body
	# asi es como e responde
	return HttpResponse("hola")
	# asi es como se saca todo
	P.objects.all()
	
