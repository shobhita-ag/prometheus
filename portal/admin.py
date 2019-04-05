from django.contrib import admin
from portal.models import GarmentType, ShootType, ShootSubType, WorkType, WorkSubType, \
						PageQuality, BindingType, Order, PoseCutting, PoseSelection, ChangesTaken, ChangesImplementation, \
						Layout, Shoot, ColorCorrection, Printing, BillCreation, Delivery, DummySent, Client

# Register your models here.

admin.site.register(GarmentType)
admin.site.register(ShootType)
admin.site.register(Order)
admin.site.register(PageQuality)
admin.site.register(BindingType)
admin.site.register(PoseSelection)
admin.site.register(PoseCutting)
admin.site.register(ChangesTaken)
admin.site.register(Layout)
admin.site.register(Delivery)
admin.site.register(Printing)
admin.site.register(ShootSubType)
admin.site.register(WorkType)
admin.site.register(WorkSubType)
admin.site.register(ColorCorrection)
admin.site.register(Shoot)
admin.site.register(BillCreation)
admin.site.register(ChangesImplementation)
admin.site.register(DummySent)
admin.site.register(Client)

