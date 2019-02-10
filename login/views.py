from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests

class HomePage(TemplateView):
    template_name = "index.html"


class AboutPage(TemplateView):
    template_name = "about.html"

class fetchUserData(APIView):
	def post(self, request):
		accessToken = request.data.get('accessToken', None)
		userId = request.data.get('userId', None)
		if (accessToken == None or userId == None):
			return Response({}, status=status.HTTP_400_BAD_REQUEST)
		response = requests.get('https://graph.facebook.com/' + userId + '/picture?redirect=false&access_token=' + accessToken)
		if (response.status_code == 200):
			print response
			return Response(response.json(),status=status.HTTP_200_OK)

