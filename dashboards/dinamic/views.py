from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect
# Create your views here.

def home(request):
	return render_to_response("dashboard.html")