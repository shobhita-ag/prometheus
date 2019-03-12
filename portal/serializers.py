from rest_framework import serializers

from portal.models import GarmentType, ShootType, ShootSubType, WorkType, WorkSubType, \
						PageQuality, BindingType, Order, PoseCutting, PoseSelection, ChangesTaken, ChangesImplementation, \
						Layout, Shoot, ColorCorrection, Printing, BillCreation, Delivery, DummySent


class OrderSummarySerializer(serializers.ModelSerializer):

	incoming_date = serializers.SerializerMethodField()
	garment_type = serializers.SerializerMethodField()
	work_type = serializers.SerializerMethodField()
	status = serializers.SerializerMethodField()

	class Meta:
		model = Order
		fields = ('id', 'client_name', 'incoming_date', 'client_challan_number', 'garment_type', 'work_type', 'status')
	
	def get_incoming_date(self, obj):
		return str(obj.incoming_date)

	def get_garment_type(self, obj):
		return obj.garment_type.type_name

	def get_work_type(self, obj):
		return obj.work_type.type_name

	def get_status(self, obj):
		return obj.get_status_display()


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
		return str(obj.incoming_date)

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



