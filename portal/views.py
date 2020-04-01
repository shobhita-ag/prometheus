import datetime
import boto
import pytz
from django.conf import settings
from django.utils.timezone import make_aware

from django.shortcuts import render
from django.db import models, transaction
from django.views.generic import TemplateView
from rest_framework.views import APIView
from django.shortcuts import render, redirect
from rest_framework.response import Response

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from django.core.paginator import Paginator
from django.core import serializers

from rest_framework import status
import requests
import json
from django.contrib.auth import authenticate, login, logout
from portal.models import GarmentType, ShootType, ShootSubType, WorkType, WorkSubType, \
						PageQuality, BindingType, Order, PoseCutting, PoseSelection, ChangesTaken, ChangesImplementation, \
						Layout, Shoot, ColorCorrection, Printing, BillCreation, Delivery, DummySent
from portal.serializers import OrderFullViewSerializer, OrderSerializer, OrderSummarySerializer, ShootSerializer, PoseSelectionSerializer, PoseCuttingSerializer, \
								LayoutSerializer, ColorCorrectionSerializer, DummySentSerializer, ChangesImplementationSerializer, \
								ChangesTakenSerializer, BillCreationSerializer, DeliverySerializer, PrintingSerializer, Client
from portal.helper import convert_utc_into_ist

from boto.s3.key import Key
from boto.s3.connection import S3Connection

class HomePage(TemplateView):
	def get(self, request):
		return redirect('login')


class Login(APIView):

	def get(self, request):
		if request.user.is_authenticated():
			return redirect('dashboard')
		return render(request, template_name='index.html')

	def post(self, request):
		username = request.data.get('username', None)
		password = request.data.get('password', None)

		user = authenticate(username=username, password=password)
		if user is not None:
			login(request, user)
			return redirect('dashboard')
		else:
			return render(request, context={'message': 'Invalid user credentials'}, template_name='index.html')

class getNextStatus(APIView):

	def get(self, request):
		if request.user.is_authenticated():
			return redirect('dashboard')
		return Response({"status": "Sent to Shooting"}, status=status.HTTP_200_OK)


class Logout(APIView):

	def get(self, request):
		if request.user.is_authenticated():
			logout(request)
		return redirect('login')

class Dashboard(APIView):

	def get(self, request):
		if not request.user.is_authenticated():
			return redirect('login')

		user = request.user
		#find if user is allowed to create/edit orders
		from portal.helper import order_status_user_group_permissions_map
		user_groups = user.groups.all().values_list('id', flat=True)
		groups_allowed = order_status_user_group_permissions_map[1]
		is_user_allowed_set = set.intersection(set(groups_allowed), set(user_groups))
		is_user_allowed = True if len(is_user_allowed_set) > 0 else False
		return render(request, context={"ops_user": request.user.username.upper(), "has_order_permissions": is_user_allowed}, template_name='dashboard.html')


class GetDialogData(APIView):

	def get(self, request):
		if not request.user.is_authenticated():
			return redirect('login')

		next_status = request.GET.get('next_status', None)
		order_id = request.GET.get('order_id', None)

		from portal.helper import order_next_status_model_map, order_next_status_serializer_map
		import portal.models
		try:
			dialog = getattr(portal.models, order_next_status_model_map[int(next_status)]).objects.get(order=order_id)
		except Exception as e:
			return Response(status=status.HTTP_204_NO_CONTENT)

		dialog_data = getattr(portal.serializers, order_next_status_serializer_map[int(next_status)])(dialog).data
		return Response({"dialog_data" : dialog_data}, status=status.HTTP_200_OK)


class RenderDialog(APIView):

	def get(self, request):
		if not request.user.is_authenticated():
			return redirect('login')

		dialog_type = request.GET.get('type', None)
		next_status = request.GET.get('next_status', None)
		order_id = request.GET.get('order_id', None)

		if dialog_type == "status_change":
			from portal.helper import order_next_status_template_map
			return render(request, template_name='dialogs/' + order_next_status_template_map[int(next_status)])
		elif dialog_type == "order_full_view":
			return render(request, template_name='dialogs/order_full_view.html')
		else:
			return Response({"response": "Incorrect dialog type"}, status=status.HTTP_400_BAD_REQUEST)

	@transaction.atomic
	def post(self, request):
		if not request.user.is_authenticated():
			return redirect('login')

		from portal.helper import order_next_status_model_map
		import portal.models

		user = request.user
		dialog_data = request.data.get('dialog_data', {})
		order_id = request.data.get('order_id', None)
		date = convert_utc_into_ist(request.data.get('date', None))
		next_status = request.data.get('next_status', None)
		next_status = int(next_status)
		# print(date)

		# date = make_aware(date)

		# asiatimezone = pytz.timezone('Asia/Kolkata')
		# asiatimezone.localize(date)
		# print(date)

		try:
			# create next_status's table entry
			if next_status == 2:
				try:
					Shoot.objects.get(id = dialog_data.get("id"))
					Shoot.objects.filter(id = dialog_data.get('id')).update(shooting_location = dialog_data.get('shooting_location', None),
					studio_name = dialog_data.get('studio_name', None), model_name = dialog_data.get('model_name', None),
					shoot_date = convert_utc_into_ist(dialog_data.get('shoot_date', None)), shoot_user = user, start_date = date)
				except Shoot.DoesNotExist:
					Shoot.objects.create(order_id = order_id, shooting_location = dialog_data.get('shooting_location', None),
					studio_name = dialog_data.get('studio_name', None), model_name = dialog_data.get('model_name', None),
					shoot_date = convert_utc_into_ist(dialog_data.get('shoot_date', None)), shoot_user = user, start_date = date)

			elif next_status == 3:
				Shoot.objects.filter(id = dialog_data.get('id')).update(shooting_location = dialog_data.get('shooting_location', None),
					studio_name = dialog_data.get('studio_name', None), model_name = dialog_data.get('model_name', None),
					shoot_date = convert_utc_into_ist(dialog_data.get('shoot_date', None)), shoot_user = user, end_date = date)

			elif next_status == 4:
				try:
					PoseSelection.objects.get(id = dialog_data.get('id'))
					PoseSelection.objects.filter(id = dialog_data.get('id')).update(pose_selection_user = user, start_date = date)
				except PoseSelection.DoesNotExist:
					PoseSelection.objects.create(order_id = order_id, pose_selection_user = user, start_date = date)

			elif next_status == 5:
				PoseSelection.objects.filter(id = dialog_data.get('id')).update(pose_selection_user = user, end_date = date)

			elif next_status == 6:
				try:
					PoseCutting.objects.get(id = dialog_data.get('id'))
					PoseCutting.objects.filter(id = dialog_data.get('id')).update(pose_cutting_user = user,
					number_of_poses = dialog_data.get('number_of_poses', None), start_date = date)
				except PoseCutting.DoesNotExist:
					PoseCutting.objects.create(order_id = order_id, pose_cutting_user = user, 
					number_of_poses = dialog_data.get('number_of_poses', None), start_date = date)

			elif next_status == 7:
				PoseCutting.objects.filter(id = dialog_data.get('id')).update(pose_cutting_user = user,
					number_of_poses = dialog_data.get('number_of_poses', None), end_date = date)

			elif next_status == 8:
				try:
					Layout.objects.get(id = dialog_data.get('id'))
					Layout.objects.filter(id = dialog_data.get('id')).update(layout_user = user, start_date = date)
				except Layout.DoesNotExist:
					Layout.objects.create(order_id = order_id, layout_user = user, start_date = date)

			elif next_status == 9:
				Layout.objects.filter(id = dialog_data.get('id')).update(layout_user = user, end_date = date)

			elif next_status == 10:
				try:
					ColorCorrection.objects.get(id = dialog_data.get('id'))
					ColorCorrection.objects.filter(id = dialog_data.get('id')).update(color_correction_user = user, start_date = date)
				except ColorCorrection.DoesNotExist:
					ColorCorrection.objects.create(order_id = order_id, color_correction_user = user, start_date = date)

			elif next_status == 11:
				ColorCorrection.objects.filter(id = dialog_data.get('id')).update(color_correction_user = user, end_date = date)

			elif next_status == 12:
				try:
					DummySent.objects.get(id = dialog_data.get('id'))
					DummySent.objects.filter(id = dialog_data.get('id')).update(order_id = order_id, dummy_sent_user = user, dummy_sent_date = date)
				except DummySent.DoesNotExist:
					DummySent.objects.create(order_id = order_id, dummy_sent_user = user, dummy_sent_date = date)

			elif next_status == 13:
				try:
					ChangesTaken.objects.get(id = dialog_data.get('id'))
					ChangesTaken.objects.filter(id = dialog_data.get('id')).update(order_id = order_id, changes_taken_user = user, changes_taken_date = date,
					remarks = dialog_data.get('remarks', None))
				except ChangesTaken.DoesNotExist:
					ChangesTaken.objects.create(order_id = order_id, changes_taken_user = user, changes_taken_date = date,
					remarks = dialog_data.get('remarks', None))

			elif next_status == 14:
				try:
					ChangesImplementation.objects.get(id = dialog_data.get('id'))
					ChangesImplementation.objects.filter(id = dialog_data.get('id')).update(changes_implementation_user = user, start_date = date)
				except ChangesImplementation.DoesNotExist:
					ChangesImplementation.objects.create(order_id = order_id, changes_implementation_user = user, start_date = date)

			elif next_status == 15:
				ChangesImplementation.objects.filter(id = dialog_data.get('id')).update(changes_implementation_user = user, end_date = date)

			elif next_status == 16:
				try:
					Printing.objects.get(id = dialog_data.get('id'))
					Printing.objects.filter(id = dialog_data.get('id')).update(folder_number = dialog_data.get('folder_number', None),
					printing_user = user, start_date = date)
				except Printing.DoesNotExist:
					Printing.objects.create(order_id = order_id, folder_number = dialog_data.get('folder_number', None),
					printing_user = user, start_date = date)

			elif next_status == 17:
				Printing.objects.filter(id = dialog_data.get('id')).update(folder_number = dialog_data.get('folder_number', None),
					printing_user = user, end_date = date)

			elif next_status == 18:
				try:
					BillCreation.objects.get(id = dialog_data.get('id'))
					BillCreation.objects.filter(id = dialog_data.get('id')).update(order_id = order_id, bill_creation_user = user,
					bill_number = dialog_data.get('bill_number', None), bill_date = date)
				except BillCreation.DoesNotExist:
					BillCreation.objects.create(order_id = order_id, bill_creation_user = user,
					bill_number = dialog_data.get('bill_number', None), bill_date = date)

			elif next_status == 19:
				try:
					Delivery.objects.get(id = dialog_data.get('id'))
					Delivery.objects.filter(id = dialog_data.get('id')).update(order_id = order_id, delivery_user = user, delivery_date = date)
				except Delivery.DoesNotExist:
					Delivery.objects.create(order_id = order_id, delivery_user = user, delivery_date = date)

			else:
				return Response({"response": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)

			#update order status
			Order.objects.filter(id=order_id).update(status=next_status)
		except Exception as e:
				print("Order status update failed:" + str(e))
				return Response({"response": "Error in order updation"}, status=status.HTTP_400_BAD_REQUEST)

		return Response({"response": "Order status updated"}, status=status.HTTP_200_OK)


class CreateEditOrder(APIView):

	def get(self, request):
		if not request.user.is_authenticated():
			return redirect('login')

		order_id = request.GET.get('order_id', None)
		return render(request, context={"order_id": order_id, "ops_user": request.user.username.upper()}, template_name='create_edit_order.html')

	def post(self, request):
		if not request.user.is_authenticated():
			return redirect('login')

		# checking user permissions for create/edit order
		user = request.user
		from portal.helper import order_status_user_group_permissions_map
		user_groups = user.groups.all().values_list('id', flat=True)
		groups_allowed = order_status_user_group_permissions_map[1]
		is_user_allowed_set = set.intersection(set(groups_allowed), set(user_groups))
		is_user_allowed = True if len(is_user_allowed_set) > 0 else False

		if not is_user_allowed:
			return Response({"response": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
		###

		order_data = request.data.get('order_data', None)
		order_id = request.data.get('order_id', None)
		client_name = order_data.get('client_name', None)
		incoming_date = order_data.get('incoming_date', None)

		if incoming_date:
			incoming_date = convert_utc_into_ist(incoming_date)

		client_challan_number = order_data.get('client_challan_number', None)
		garment_type = order_data.get('garment_type', None)
		garment_count = order_data.get('garment_count', None)
		shoot_type = order_data.get('shoot_type', None)
		shoot_sub_type = order_data.get('shoot_sub_type', None)
		has_blouse_stitch = order_data.get('has_blouse_stitch', None)
		work_type = order_data.get('work_type', None)
		size = order_data.get('size', None)
		photo_size = order_data.get('photo_size', None)
		page_count = order_data.get('page_count', None)
		outer_page_quality = order_data.get('outer_page_quality', None)
		inner_page_quality = order_data.get('inner_page_quality', None)
		binding_type = order_data.get('binding_type', None)
		book_name = order_data.get('book_name', None)
		book_quantity = order_data.get('book_quantity', None)
		has_photo_lamination = order_data.get('has_photo_lamination', None)

		try:
			if order_id == "None":
				createdOrder = Order.objects.create(client_name_id = client_name, incoming_date = incoming_date, client_challan_number = client_challan_number,
				garment_type_id = garment_type, garment_count = garment_count, shoot_type_id = shoot_type, shoot_sub_type_id = shoot_sub_type,
				has_blouse_stitch = has_blouse_stitch, work_type_id = work_type, size_id = size, photo_size_id = photo_size, page_count = page_count, outer_page_quality_id = outer_page_quality,
				inner_page_quality_id = inner_page_quality, binding_type_id = binding_type, book_name = book_name, book_quantity = book_quantity,
				has_photo_lamination = has_photo_lamination, created_by = user)
				return Response({"response": "Order created", "order_id" : createdOrder.id}, status=status.HTTP_201_CREATED)

			else:
				Order.objects.filter(id=order_id).update(client_name_id = client_name, incoming_date = incoming_date, client_challan_number = client_challan_number,
				garment_type_id = garment_type, garment_count = garment_count, shoot_type_id = shoot_type, shoot_sub_type_id = shoot_sub_type,
				has_blouse_stitch = has_blouse_stitch, work_type_id = work_type, size_id = size, photo_size_id = photo_size, page_count = page_count, outer_page_quality_id = outer_page_quality,
				inner_page_quality_id = inner_page_quality, binding_type_id = binding_type, book_name = book_name, book_quantity = book_quantity,
				has_photo_lamination = has_photo_lamination, created_by = user)
				return Response({"response": "Order updated", "order_id" : order_id}, status=status.HTTP_200_OK)
		except Exception as e:
			print("Order creation failed:" + str(e))
			return Response({"response": "Error in order creation"}, status=status.HTTP_400_BAD_REQUEST)


class GetOrder(APIView):

	def get(self, request):
		if not request.user.is_authenticated():
			return redirect('login')
		order_id = request.GET.get('order_id', None)
		if order_id:
			order_id = int(order_id)
			order = Order.objects.get(id=order_id)
			order_data = OrderSerializer(order).data
			return Response({"order_data": order_data}, status=status.HTTP_200_OK)
		else:
			return Response({}, status=status.HTTP_400_BAD_REQUEST)


class GetOrderFullView(APIView):

	def get(self, request):
		if not request.user.is_authenticated():
			return redirect('login')
		order_id = request.GET.get('order_id', None)
		if order_id:
			try:
				order_id = int(order_id)

				#order
				order_data = OrderFullViewSerializer(Order.objects.get(id = order_id)).data

				#statuses
				try:
					shoot_data = ShootSerializer(Shoot.objects.get(order_id = order_id)).data
				except Shoot.DoesNotExist:
					shoot_data = None

				try:
					pose_selection_data = PoseSelectionSerializer(PoseSelection.objects.get(order_id = order_id)).data
				except PoseSelection.DoesNotExist:
					pose_selection_data = None

				try:
					pose_cutting_data = PoseCuttingSerializer(PoseCutting.objects.get(order_id = order_id)).data
				except PoseCutting.DoesNotExist:
					pose_cutting_data = None

				try:
					layout_data = LayoutSerializer(Layout.objects.get(order_id = order_id)).data
				except Layout.DoesNotExist:
					layout_data = None

				try:
					color_correction_data = ColorCorrectionSerializer(ColorCorrection.objects.get(order_id = order_id)).data
				except ColorCorrection.DoesNotExist:
					color_correction_data = None

				try:
					dummy_sent_data = DummySentSerializer(DummySent.objects.get(order_id = order_id)).data
				except DummySent.DoesNotExist:
					dummy_sent_data = None

				try:
					changes_taken_data = ChangesTakenSerializer(ChangesTaken.objects.get(order_id = order_id)).data
				except ChangesTaken.DoesNotExist:
					changes_taken_data = None

				try:
					changes_implementation_data = ChangesImplementationSerializer(ChangesImplementation.objects.get(order_id = order_id)).data
				except ChangesImplementation.DoesNotExist:
					changes_implementation_data = None

				try:
					bill_creation_data = BillCreationSerializer(BillCreation.objects.get(order_id = order_id)).data
				except BillCreation.DoesNotExist:
					bill_creation_data = None

				try:
					delivery_data = DeliverySerializer(Delivery.objects.get(order_id = order_id)).data
				except Delivery.DoesNotExist:
					delivery_data = None

				try:
					printing_data = PrintingSerializer(Printing.objects.get(order_id = order_id)).data
				except Printing.DoesNotExist:
					printing_data = None

				return Response({"data": {"order_data" : order_data, "shoot_data" : shoot_data, "pose_selection_data" : pose_selection_data,
								"pose_cutting_data" : pose_cutting_data, "layout_data" : layout_data, "color_correction_data" : color_correction_data,
								"dummy_sent_data" : dummy_sent_data, "changes_taken_data" : changes_taken_data, "changes_implementation_data" : changes_implementation_data,
								"bill_creation_data" : bill_creation_data, "delivery_data" : delivery_data, "printing_data" : printing_data}},
								status = status.HTTP_200_OK)
			except Exception as e:
				print("Error while fetching order data:" + str(e))
				return Response({"response": "Error in fetching order data"}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response({"response" : "Order does not exist"}, status = status.HTTP_400_BAD_REQUEST)


class DashboardOrders(APIView):

	def get(self, request):
		if not request.user.is_authenticated():
			return redirect('login')
		try:
			user = request.user
			order_status = request.GET.get('status', None)
			incoming_date = request.GET.get('incoming_date', None)
			client = request.GET.get('client', None)

			page_size = request.GET.get('page_size', 10)
			page_index = request.GET.get('page_index', 1)


			orders = Order.objects.select_related('garment_type', 'work_type').all()

			#filter out orders that are delivered
			orders = orders.exclude(status = 19)
			active_orders = orders.exclude(status__in = [16,17,18]).count

			if order_status:
				orders = orders.filter(status = order_status)

			if incoming_date:
				orders = orders.filter(incoming_date = incoming_date)

			if client:
				orders = orders.filter(client_name_id=client)

			orders = orders.order_by('incoming_date')

			pages = Paginator(orders, page_size)
			page_count = pages.num_pages
			orders = pages.page(page_index).object_list
			order_data = OrderSummarySerializer(orders, many=True, context={"user": user}).data

			total_orders = pages.count

			return Response({"order_data": order_data, "page_count" : page_count, "total_orders" : total_orders, "active_orders" : active_orders}, status=status.HTTP_200_OK)

		except Exception as e:
			print("Error while fetching orders:" + str(e))
			return Response({"response" : "Error while fetching orders"}, status = status.HTTP_400_BAD_REQUEST)


class GetClients(APIView):

	def get(self, request):
		if not request.user.is_authenticated():
			return redirect('login')
		try:
			clients = Client.objects.all().order_by('client_name').values()
			return Response({"clients": clients}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({"response" : "Error while fetching clients"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetDropDownData(APIView):

	def get(self, request):
		if not request.user.is_authenticated():
			return redirect('login')
		garment_types = GarmentType.objects.all().values()
		work_types = WorkType.objects.all().values()
		work_sub_types = WorkSubType.objects.all().values()
		shoot_types = ShootType.objects.all().values()
		shoot_sub_types = ShootSubType.objects.all().values()
		page_qualities = PageQuality.objects.all().values()
		binding_types = BindingType.objects.all().values()
		clients = Client.objects.all().values()

		dropdowndata = {}
		dropdowndata['garment_types'] = garment_types
		dropdowndata['work_types'] = work_types
		dropdowndata['work_sub_types'] = work_sub_types
		dropdowndata['shoot_types'] = shoot_types
		dropdowndata['shoot_sub_types'] = shoot_sub_types
		dropdowndata['page_qualities'] = page_qualities
		dropdowndata['binding_types'] = binding_types
		dropdowndata['clients'] = clients
		return Response({"dropdowndata": dropdowndata}, status=status.HTTP_200_OK)


class OrderImageUpload(APIView):

	def post(self, request):
		if not request.user.is_authenticated():
			return redirect('login')

		# checking user permissions for create/edit order
		user = request.user
		from portal.helper import order_status_user_group_permissions_map
		user_groups = user.groups.all().values_list('id', flat=True)
		groups_allowed = order_status_user_group_permissions_map[1]
		is_user_allowed_set = set.intersection(set(groups_allowed), set(user_groups))
		is_user_allowed = True if len(is_user_allowed_set) > 0 else False

		if not is_user_allowed:
			return Response({"response": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
		###

		file_data = request.FILES.get('file', None)
		order_id = request.data.get('order_id', None)
		now = datetime.datetime.now()

		try:
			connection = S3Connection(settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY, host=settings.AWS_MUMBAI_REGION_HOST)
			bucket = connection.get_bucket(settings.AWS_STORAGE_MUMBAI_BUCKET_NAME)
			key = Key(bucket)

			#store new file
			keyname = "order_id:" + str(order_id) + "-timestamp:" + str(now)
			key.name = keyname
			sent = key.set_contents_from_string(file_data.read(), headers={'Content-Type': 'image/jpeg'})
			key.set_acl('public-read')
			image_path = key.generate_url(expires_in=0, query_auth=False)

			if sent:
				#delete old s3 file for the order if any
				orderData = Order.objects.get(id=order_id)
				if orderData.s3_key:
					key.name = orderData.s3_key
					bucket.delete_key(key)

				#set new file path in order table
				Order.objects.filter(id=order_id).update(image_path = image_path, s3_key = keyname)
				return Response({"response" : "File uploaded successfully"}, status=status.HTTP_200_OK)
			else:
				return Response({"response" : "File could not be uploaded"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		except Exception as e:
			print("Error while fetching orders:" + str(e))
			return Response({"response" : "File could not be uploaded"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteOrder(APIView):

	@transaction.atomic
	def post(self, request):
		if not request.user.is_authenticated():
			return redirect('login')

		order_id = request.data.get('order_id', None)
		try:
			Shoot.objects.filter(order_id = order_id).delete()
			PoseSelection.objects.filter(order_id = order_id).delete()
			Shoot.PoseCutting.filter(order_id = order_id).delete()
			Layout.objects.filter(order_id = order_id).delete()
			ColorCorrection.objects.filter(order_id = order_id).delete()
			DummySent.objects.filter(order_id = order_id).delete()
			ChangesTaken.objects.filter(order_id = order_id).delete()
			ChangesImplementation.objects.filter(order_id = order_id).delete()
			Printing.objects.filter(order_id = order_id).delete()
			BillCreation.objects.filter(order_id = order_id).delete()
			Delivery.objects.filter(order_id = order_id).delete()

			Order.objects.filter(id = order_id).delete()
			return Response({"response" : "Order deleted successfully"}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({"response" : "Order could not be deleted"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
15. Get work types, garment types, shoot types, page qualities, binding-types, shooting locations, statuses
16. Get work-subtypes, shoot-subtypes,
'''


class list_orders(APIView):
	def post(self, request):
		filter = request.data.get('filter', None)
		status_filter = 1









