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
		request_user = self.context.get('user', None)
		return obj.get_next_state(request_user)

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
		if obj.shoot_sub_type:
			return obj.shoot_sub_type.id
		return None

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


class OrderFullViewSerializer(serializers.ModelSerializer):

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
		return datetime.datetime.strftime(obj.incoming_date, '%I %b, %Y')

	def get_garment_type(self, obj):
		return obj.garment_type.type_name

	def get_shoot_type(self, obj):
		return obj.shoot_type.type_name

	def get_shoot_sub_type(self, obj):
		if obj.shoot_sub_type:
			return obj.shoot_sub_type.sub_type_name
		return "N/A"

	def get_work_type(self, obj):
		return obj.work_type.type_name

	def get_size(self, obj):
		return obj.size.sub_type_name

	def get_outer_page_quality(self, obj):
		return obj.outer_page_quality.quality_name

	def get_inner_page_quality(self, obj):
		return obj.inner_page_quality.quality_name

	def get_binding_type(self, obj):
		return obj.binding_type.type_name

	def get_status(self, obj):
		return obj.get_status_display()

	def get_has_blouse_stitch(self, obj):
		if obj.has_blouse_stitch == True:
			return "Yes"
		else:
			return "No"

	def get_has_photo_lamination(self, obj):
		if obj.has_photo_lamination == True:
			return "Yes"
		else:
			return "No"



class ShootSerializer(serializers.ModelSerializer):

	shoot_date = serializers.SerializerMethodField()
	start_date = serializers.SerializerMethodField()
	end_date = serializers.SerializerMethodField()
	shoot_user = serializers.SerializerMethodField()

	class Meta:
		model = Shoot
		fields = ('id', 'shooting_location', 'model_name', 'shoot_date', 'studio_name', 'shoot_user','start_date', 'end_date')

	def get_shoot_date(self, obj):
		if obj.shoot_date:
			return datetime.datetime.strftime(obj.shoot_date, '%I %b, %Y')
		else:
			return None

	def get_start_date(self, obj):
		if obj.start_date:
			return datetime.datetime.strftime(obj.start_date, '%I %b, %Y')
		else:
			return None

	def get_end_date(self, obj):
		if obj.end_date:
			return datetime.datetime.strftime(obj.end_date, '%I %b, %Y')
		else:
			return None

	def get_shoot_user(self, obj):
		return obj.shoot_user.username


class PoseSelectionSerializer(serializers.ModelSerializer):
	start_date = serializers.SerializerMethodField()
	end_date = serializers.SerializerMethodField()
	pose_selection_user = serializers.SerializerMethodField()

	class Meta:
		model = PoseSelection
		fields = ('id', 'start_date', 'end_date', 'pose_selection_user')

	def get_start_date(self, obj):
		if obj.start_date:
			return datetime.datetime.strftime(obj.start_date, '%I %b, %Y')
		else:
			return None

	def get_end_date(self, obj):
		if obj.end_date:
			return datetime.datetime.strftime(obj.end_date, '%I %b, %Y')
		else:
			return None

	def get_pose_selection_user(self, obj):
		return obj.pose_selection_user.username


class PoseCuttingSerializer(serializers.ModelSerializer):
	start_date = serializers.SerializerMethodField()
	end_date = serializers.SerializerMethodField()
	pose_cutting_user = serializers.SerializerMethodField()

	class Meta:
		model = PoseCutting
		fields = ('id', 'number_of_poses', 'pose_cutting_user', 'start_date', 'end_date')

	def get_start_date(self, obj):
		if obj.start_date:
			return datetime.datetime.strftime(obj.start_date, '%I %b, %Y')
		else:
			return None

	def get_end_date(self, obj):
		if obj.end_date:
			return datetime.datetime.strftime(obj.end_date, '%I %b, %Y')
		else:
			return None

	def get_pose_cutting_user(self, obj):
		return obj.pose_cutting_user.username


class LayoutSerializer(serializers.ModelSerializer):
	start_date = serializers.SerializerMethodField()
	end_date = serializers.SerializerMethodField()
	layout_user = serializers.SerializerMethodField()

	class Meta:
		model = Layout
		fields = ('id', 'layout_user', 'start_date', 'end_date')

	def get_start_date(self, obj):
		if obj.start_date:
			return datetime.datetime.strftime(obj.start_date, '%I %b, %Y')
		else:
			return None

	def get_end_date(self, obj):
		if obj.end_date:
			return datetime.datetime.strftime(obj.end_date, '%I %b, %Y')
		else:
			return None

	def get_layout_user(self, obj):
		return obj.layout_user.username


class ColorCorrectionSerializer(serializers.ModelSerializer):
	start_date = serializers.SerializerMethodField()
	end_date = serializers.SerializerMethodField()
	color_correction_user = serializers.SerializerMethodField()

	class Meta:
		model = ColorCorrection
		fields = ('id', 'color_correction_user', 'start_date', 'end_date')

	def get_start_date(self, obj):
		if obj.start_date:
			return datetime.datetime.strftime(obj.start_date, '%I %b, %Y')
		else:
			return None

	def get_end_date(self, obj):
		if obj.end_date:
			return datetime.datetime.strftime(obj.end_date, '%I %b, %Y')
		else:
			return None

	def get_color_correction_user(self, obj):
		return obj.color_correction_user.username


class DummySentSerializer(serializers.ModelSerializer):
	dummy_sent_user = serializers.SerializerMethodField()
	dummy_sent_date = serializers.SerializerMethodField()

	class Meta:
		model = DummySent
		fields = ('id', 'dummy_sent_user', 'dummy_sent_date')

	def get_dummy_sent_date(self, obj):
		if obj.dummy_sent_date:
			return datetime.datetime.strftime(obj.dummy_sent_date, '%I %b, %Y')
		else:
			return None

	def get_dummy_sent_user(self, obj):
		return obj.dummy_sent_user.username


class ChangesTakenSerializer(serializers.ModelSerializer):
	changes_taken_user = serializers.SerializerMethodField()
	changes_taken_date = serializers.SerializerMethodField()

	class Meta:
		model = ChangesTaken
		fields = ('id', 'changes_taken_user', 'changes_taken_date', 'remarks')

	def get_changes_taken_date(self, obj):
		if obj.changes_taken_date:
			return datetime.datetime.strftime(obj.changes_taken_date, '%I %b, %Y')
		else:
			return None

	def get_changes_taken_user(self, obj):
		return obj.changes_taken_user.username


class ChangesImplementationSerializer(serializers.ModelSerializer):
	start_date = serializers.SerializerMethodField()
	end_date = serializers.SerializerMethodField()
	changes_implementation_user = serializers.SerializerMethodField()

	class Meta:
		model = ChangesImplementation
		fields = ('id', 'changes_implementation_user', 'start_date', 'end_date')

	def get_start_date(self, obj):
		if obj.start_date:
			return datetime.datetime.strftime(obj.start_date, '%I %b, %Y')
		else:
			return None

	def get_end_date(self, obj):
		if obj.end_date:
			return datetime.datetime.strftime(obj.end_date, '%I %b, %Y')
		else:
			return None

	def get_changes_implementation_user(self, obj):
		return obj.changes_implementation_user.username


class BillCreationSerializer(serializers.ModelSerializer):
	bill_creation_user = serializers.SerializerMethodField()
	bill_date = serializers.SerializerMethodField()

	class Meta:
		model = BillCreation
		fields = ('id', 'bill_creation_user', 'bill_number', 'bill_date')

	def get_bill_date(self, obj):
		if obj.bill_date:
			return datetime.datetime.strftime(obj.bill_date, '%I %b, %Y')
		else:
			return None

	def get_bill_creation_user(self, obj):
		return obj.bill_creation_user.username


class DeliverySerializer(serializers.ModelSerializer):
	delivery_user = serializers.SerializerMethodField()
	delivery_date = serializers.SerializerMethodField()

	class Meta:
		model = Delivery
		fields = ('id', 'delivery_user', 'delivery_date')

	def get_delivery_date(self, obj):
		if obj.delivery_date:
			return datetime.datetime.strftime(obj.delivery_date, '%I %b, %Y')
		else:
			return None

	def get_delivery_user(self, obj):
		return obj.delivery_user.username


class PrintingSerializer(serializers.ModelSerializer):
	start_date = serializers.SerializerMethodField()
	end_date = serializers.SerializerMethodField()
	printing_user = serializers.SerializerMethodField()

	class Meta:
		model = Printing
		fields = ('id', 'folder_number', 'printing_user', 'start_date', 'end_date')

	def get_start_date(self, obj):
		if obj.start_date:
			return datetime.datetime.strftime(obj.start_date, '%I %b, %Y')
		else:
			return None

	def get_end_date(self, obj):
		if obj.end_date:
			return datetime.datetime.strftime(obj.end_date, '%I %b, %Y')
		else:
			return None

	def get_printing_user(self, obj):
		return obj.printing_user.username


