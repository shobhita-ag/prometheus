from django.db import models
from django_fsm import FSMIntegerField, transition
from model_utils.models import TimeStampedModel
from django.conf import settings

# Create your models here.

class GarmentType(TimeStampedModel):
	type_name = models.CharField(max_length=128)

	def __unicode__(self):
		return self.type_name


class ShootType(TimeStampedModel):
	type_name = models.CharField(max_length=128)

	def __unicode__(self):
		return self.type_name


class ShootSubType(TimeStampedModel):
	shoot_type = models.ForeignKey(ShootType)
	sub_type_name = models.CharField(max_length=128)

	def __unicode__(self):
		return self.shoot_type.type_name + " - " + self.sub_type_name


class WorkType(TimeStampedModel):
	type_name = models.CharField(max_length=128)

	def __unicode__(self):
		return self.type_name


class WorkSubType(TimeStampedModel):
	work_type = models.ForeignKey(WorkType)
	sub_type_name = models.CharField(max_length=128)

	def __unicode__(self):
		return self.work_type.type_name + " - " + self.sub_type_name


class PageQuality(TimeStampedModel):
	quality_name = models.CharField(max_length=128)

	def __unicode__(self):
		return self.quality_name


class BindingType(TimeStampedModel):
	type_name = models.CharField(max_length=128)

	def __unicode__(self):
		return self.type_name


class Order(TimeStampedModel):
	client_name = models.CharField(max_length=128)
	incoming_date = models.DateField()
	client_challan_number = models.CharField(max_length=128, null=True)
	garment_type = models.ForeignKey(GarmentType)
	garment_count = models.IntegerField()
	shoot_type = models.ForeignKey(ShootType, null=True)
	shoot_sub_type = models.ForeignKey(ShootSubType, null=True)
	has_blouse_stitch = models.NullBooleanField(null=True)
	work_type = models.ForeignKey(WorkType)
	size = models.ForeignKey(WorkSubType, null=True)
	page_count = models.IntegerField(null=True)
	outer_page_quality = models.ForeignKey(PageQuality, related_name='outer_page_quality', null=True)
	inner_page_quality = models.ForeignKey(PageQuality, related_name='inner_page_quality', null=True)
	binding_type = models.ForeignKey(BindingType, null=True)
	book_name = models.CharField(max_length=128, null=True)
	book_quantity = models.IntegerField(null=True)
	has_photo_lamination = models.NullBooleanField(null=True)

	STATUS_CHOICES = (
		(1, "Order Created"),
		(2, "Sent to Shooting"),
		(3, "Shooting Completed"),
		(4, "Pose Selection Started"),
		(5, "Pose Selection Completed"),
		(6, "Pose Cutting Started"),
		(7, "Pose Cutting Completed"),
		(8, "Layout Creation Started"),
		(9, "Layout Creation Completed"),
		(10, "Color Correction Started"),
		(11, "Color Correction Completed"),
		(12, "Dummy Sent to Client"),
		(13, "Changes Taken"),
		(14, "Changes Implementation Started"),
		(15, "Changes Implementation Completed"),
		(16, "Printing Started"),
		(17, "Printing Completed"),
		(18, "Bill Created"),
		(19, "Delivery Done"),
	)

	status = FSMIntegerField(default=1, choices=STATUS_CHOICES)

	@transition(field=status, source=[1, 13, 14, 15], target=2)
	def send_to_shooting(self):
		pass

	@transition(field=status, source=2, target=3)
	def shooting_completed(self):
		pass

	@transition(field=status, source=3, target=4) 
	def pose_selection_started(self):
		pass

	@transition(field=status, source=4, target=5)
	def pose_selection_completed(self):
		pass

	@transition(field=status, source=5, target=6)
	def pose_cutting_started(self):
		pass   

	@transition(field=status, source=6, target=7)
	def pose_cutting_completed(self):
		pass

	@transition(field=status, source=7, target=8)
	def layout_creation_completed(self):
		pass

	@transition(field=status, source=8, target=9)
	def layout_creation_completed(self):
		pass

	@transition(field=status, source=9, target=10)
	def color_correction_started(self):
		pass

	@transition(field=status, source=10, target=11)
	def color_correction_completed(self):
		pass      

	@transition(field=status, source=11, target=12)
	def dummy_sent_to_client(self):
		pass

	@transition(field=status, source=12, target=13)
	def take_feedback_changes(self):
		pass

	@transition(field=status, source=13, target=14)
	def feedback_changes_started(self):
		pass

	@transition(field=status, source=14, target=15)
	def feedback_changes_completed(self):
		pass

	@transition(field=status, source=15, target=16)
	def printing_started(self):
		pass

	@transition(field=status, source=16, target=17)
	def printing_completed(self):
		pass  

	@transition(field=status, source=17, target=18)
	def bill_created(self):
		pass

	@transition(field=status, source=18, target=19)
	def delivered(self):
		pass

	def get_next_state(self, request_user):
		from portal.helper import get_next_status
		return get_next_status(self, request_user)
												
	def __unicode__(self):
		return self.client_name + " - " + self.client_challan_number


class Shoot(TimeStampedModel):
	order = models.ForeignKey(Order)

	LOCATION_CHOICES = (
		(1, "Our Studio"),
		(2, "Outside Studio"),
	)

	shooting_location = models.IntegerField(choices=LOCATION_CHOICES, default=1)
	studio_name = models.CharField(max_length=128, null=True, blank=True)
	model_name = models.CharField(max_length=128)
	shoot_date = models.DateField(null=True)
	shoot_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	start_date = models.DateField(null=True)
	end_date = models.DateField(null=True)

	def __unicode__(self):
		return self.order


class PoseSelection(TimeStampedModel):
	order = models.ForeignKey(Order)
	pose_selection_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	start_date = models.DateField(null=True)
	end_date = models.DateField(null=True)

	def __unicode__(self):
		return self.order


class PoseCutting(TimeStampedModel):
	order = models.ForeignKey(Order)
	pose_cutting_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	number_of_poses = models.IntegerField()
	start_date = models.DateField(null=True)
	end_date = models.DateField(null=True)

	def __unicode__(self):
		return self.order


class Layout(TimeStampedModel):
	order = models.ForeignKey(Order)
	layout_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	start_date = models.DateField(null=True)
	end_date = models.DateField(null=True)

	def __unicode__(self):
		return self.order


class ColorCorrection(TimeStampedModel):
	order = models.ForeignKey(Order)
	color_correction_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	start_date = models.DateField(null=True)
	end_date = models.DateField(null=True)

	def __unicode__(self):
		return self.order


class DummySent(TimeStampedModel):
	order = models.ForeignKey(Order)
	dummy_sent_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	dummy_sent_date = models.DateField(null=True)

	def __unicode__(self):
		return self.order


class ChangesTaken(TimeStampedModel):
	order = models.ForeignKey(Order)
	changes_taken_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	changes_taken_date = models.DateField(null=True)
	remarks = models.CharField(max_length=128, null=True)

	def __unicode__(self):
		return self.order


class ChangesImplementation(TimeStampedModel):
	order = models.ForeignKey(Order)
	changes_implementation_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	start_date = models.DateField(null=True)
	end_date = models.DateField(null=True)

	def __unicode__(self):
		return self.order	


class Printing(TimeStampedModel):
	order = models.ForeignKey(Order)
	folder_number = models.CharField(max_length=128)
	printing_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	start_date = models.DateField(null=True)
	end_date = models.DateField(null=True)

	def __unicode__(self):
		return self.order


class BillCreation(TimeStampedModel):
	order = models.ForeignKey(Order)
	bill_creation_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	bill_number = models.CharField(max_length=128)
	bill_date = models.DateField()

	def __unicode__(self):
		return self.order	


class Delivery(TimeStampedModel):
	order = models.ForeignKey(Order)
	delivery_user = models.ForeignKey(settings.AUTH_USER_MODEL)
	delivery_date = models.DateField(null=True)

	def __unicode__(self):
		return self.order

