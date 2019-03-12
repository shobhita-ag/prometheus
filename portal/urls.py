from django.conf.urls import url
from portal import views

urlpatterns = [
	# views for page loading
    url(r'^$', views.HomePage.as_view(), name='home'),
    url(r'^login$', views.Login.as_view(), name='login'),
    url(r'^logout$', views.Logout.as_view(), name='logout'),
    url(r'^dashboard$', views.Dashboard.as_view(), name='dashboard'),
    url(r'^create_edit_order$', views.CreateEditOrder.as_view(), name='create_edit_order'),

    #api calls for crud operations
    url(r'^dashboard/order_data$', views.DashboardOrders.as_view(), name='dashboard_orders'),
    url(r'^create_edit_order/get_order$', views.GetOrder.as_view(), name='get_order'),
    url(r'^create_edit_order/get_drop_down_data$', views.GetDropDownData.as_view(), name='get_drop_down_data'),
    
    #url(r'^create_order$', views.create_order.as_view(), name='create_order'),
]