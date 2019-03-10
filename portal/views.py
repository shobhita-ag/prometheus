from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from portal.models import GarmentType, ShootType, ShootSubType, WorkType, WorkSubType, \
						PageQuality, BindingType, Order, PoseCutting, PoseSelection, ChangesTaken, ChangesImplementation, \
						Layout, Shoot, ColorCorrection, Printing, BillCreation, Delivery, DummySent

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


'''
0. Login
1. Create order
2. Send to shooting
3. Complete shooting
4. Start/Complete Pose Selection
5. Start/Complete Pose Cutting
6. Start/Complete Layout Creation
7. Start/Complete Color Correction
8. Send Dummy to Client
9. Start/Complete Feedback changes
10. Send to Re-shooting
11. Start/Complete Printing
12. Out for delivery
13. Delivery Done
14. Search orders - with pagination, filters - status, incoming date
'''

class create_order(APIView):

	def post(self, request):
		client_name = request.data.get('client_name', None)
		incoming_date = request.data.get('incoming_date', None)
		client_challan_number = request.data.get('client_challan_number', None)
		garment_type = request.data.get('garment_type', None)
		garment_count = request.data.get('garment_count', None)
		shoot_type = request.data.get('shoot_type', None)
		shoot_sub_type = request.data.get('shoot_sub_type', None)
		has_blouse_stitch = request.data.get('has_blouse_stitch', None)
		work_type = request.data.get('work_type', None)
		size = request.data.get('size', None)
		page_count = request.data.get('page_count', None)
		outer_page_quality = request.data.get('outer_page_quality', None)
		inner_page_quality = request.data.get('inner_page_quality', None)
		binding_type = request.data.get('binding_type', None)
		book_name = request.data.get('book_name', None)
		book_quantity = request.data.get('book_quantity', None)
		has_photo_lamination = request.data.get('has_photo_lamination', None)

		try:
			Order.objects.create(client_name = client_name, incoming_date = incoming_date, client_challan_number = client_challan_number,
			garment_type_id = garment_type, garment_count = garment_count, shoot_type_id = shoot_type, shoot_sub_type_id = shoot_sub_type,
			has_blouse_stitch = has_blouse_stitch, work_type_id = work_type, size_id = size, page_count = page_count, outer_page_quality_id = outer_page_quality,
			inner_page_quality_id = inner_page_quality, binding_type_id = binding_type, book_name = book_name, book_quantity = book_quantity,
			has_photo_lamination = has_photo_lamination)
		except Exception as e:
			print("Order creation failed:" + str(e))
			return Response({"response": "Error in order creation"}, status=HTTP_400_BAD_REQUEST)


		return Response({"response": "201 created"}, status=status.HTTP_201_CREATED)		











