import datetime
from rest_framework import serializers

from portal.models import GarmentType, ShootType, ShootSubType, WorkType, WorkSubType, \
						PageQuality, BindingType, Order, PoseCutting, PoseSelection, ChangesTaken, ChangesImplementation, \
						Layout, Shoot, ColorCorrection, Printing, BillCreation, Delivery, DummySent


class OrderSummarySerializer(serializers.ModelSerializer):

	incoming_date = serializers.SerializerMethodField()
	garment_type = serializers.SerializerMethodField()
	work_type = serializers.SerializerMethodField()
	status = serializers.SerializerMethodField()
	next_status = serializers.SerializerMethodField()
	has_next_status_form = serializers.SerializerMethodField()

	class Meta:
		model = Order
		fields = ('id', 'client_name', 'incoming_date', 'client_challan_number', 'garment_type', 'work_type', 'status', 'next_status', 'has_next_status_form')
	
	def get_incoming_date(self, obj):
		return datetime.datetime.strftime(obj.incoming_date, '%I %b, %Y')

	def get_garment_type(self, obj):
		return obj.garment_type.type_name

	def get_work_type(self, obj):
		return obj.work_type.type_name

	def get_status(self, obj):
		return obj.get_status_display()

	def get_next_status(self, obj):
		return obj.get_next_state()

	def get_has_next_status_form(self, obj):
		return "true";		


class OrderSerializer(serializers.ModelSerializer):

	incoming_date = serializers.SerializerMethodField()
	garment_type = serializers.SerializerMethodField()
	shoot_type = serializers.SerializerMethodField()
	shoot_sub_type = serializers.SerializerMethodField()
	work_type = serializers.SerializerMethodField()
	size = serializers.SerializerMethodField()
	has_blouse_stitch = serializers.SerializerMethodField()
	has_photo_lamination = serializers.SerializerMethodField()
	outer_page_quality = serializers.SerializerMethodField()
	inner_page_quality = serializers.SerializerMethodField()
	binding_type = serializers.SerializerMethodField()
	status = serializers.SerializerMethodField()

	class Meta:
		model = Order
		fields = ('id', 'client_name', 'incoming_date', 'client_challan_number', 'garment_type', 'garment_count', 'shoot_type',
			'shoot_sub_type', 'has_blouse_stitch', 'work_type', 'size', 'page_count', 'outer_page_quality', 'inner_page_quality',
			'binding_type', 'book_name', 'book_quantity', 'has_photo_lamination', 'status')

	def get_incoming_date(self, obj):
		return datetime.datetime.strftime(obj.incoming_date, '%Y/%m/%d')

	def get_garment_type(self, obj):
		return obj.garment_type.id

	def get_shoot_type(self, obj):
		return obj.shoot_type.id

	def get_shoot_sub_type(self, obj):
		return obj.shoot_sub_type.id

	def get_work_type(self, obj):
		return obj.work_type.id

	def get_size(self, obj):
		return obj.size.id

	def get_outer_page_quality(self, obj):
		return obj.outer_page_quality.id

	def get_inner_page_quality(self, obj):
		return obj.inner_page_quality.id

	def get_binding_type(self, obj):
		return obj.binding_type.id									

	def get_status(self, obj):
		return obj.get_status_display()

	def get_has_blouse_stitch(self, obj):
		return str(obj.has_blouse_stitch)

	def get_has_photo_lamination(self, obj):
		return str(obj.has_photo_lamination)		


class ShootSerializer(serializers.ModelSerializer):

	shooting_location = serializers.SerializerMethodField()
	studio_name = serializers.SerializerMethodField()
	model_name = serializers.SerializerMethodField()
	shoot_date = serializers.SerializerMethodField()

	class Meta:
		model = Shoot
		fields = ('id', 'shooting_location', 'model_name', 'shoot_date', 'studio_name')
	
	def get_shooting_location(self, obj):
		return obj.shooting_location

	def get_studio_name(self, obj):
		return obj.studio_name

	def get_model_name(self, obj):
		return obj.model_name

	def get_shoot_date(self, obj):
		return datetime.datetime.strftime(obj.shoot_date, '%Y/%m/%d')


class PoseCuttingSerializer(serializers.ModelSerializer):
	
	number_of_poses = serializers.SerializerMethodField()

	class Meta:
		model = PoseCutting
		fields = ('id', 'number_of_poses')

	def get_number_of_poses(self, obj):
		return obj.number_of_poses


class PrintingSerializer(serializers.ModelSerializer):

	folder_number = serializers.SerializerMethodField()

	class Meta:
		model = Printing
		fields = ('id', 'folder_number')

	def get_folder_number(self, obj):
		return obj.folder_number				