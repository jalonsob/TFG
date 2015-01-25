from django.shortcuts import render
from django.http import *
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect
# Create your views here.

def home(request):
	return render_to_response("dashboard.html")

def saveall(request):
	
	print "hola"