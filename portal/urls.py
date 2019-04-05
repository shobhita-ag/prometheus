from django.conf.urls import url
from portal import views

urlpatterns = [
	# views for page loading
    url(r'^$', views.HomePage.as_view(), name='home'),
    url(r'^login$', views.Login.as_view(), name='login'),
    url(r'^logout$', views.Logout.as_view(), name='logout'),
    url(r'^dashboard$', views.Dashboard.as_view(), name='dashboard'),
    url(r'^create_edit_order$', views.CreateEditOrder.as_view(), name='create_edit_order'),
    url(r'^render_dialog$', views.RenderDialog.as_view(), name='render_dialog'),

    #api calls for crud operations
    url(r'^dashboard/order_data$', views.DashboardOrders.as_view(), name='dashboard_orders'),
    url(r'^create_edit_order/get_order$', views.GetOrder.as_view(), name='get_order'),
    url(r'^create_edit_order/get_drop_down_data$', views.GetDropDownData.as_view(), name='get_drop_down_data'),
    url(r'^get_next_status$', views.getNextStatus.as_view(), name='get_next_status'),
    url(r'^get_dialog_data$', views.GetDialogData.as_view(), name='get_dialog_data'),
    url(r'^get_order_full_view$', views.GetOrderFullView.as_view(), name='get_order_full_view'),
    url(r'^get_clients$', views.GetClients.as_view(), name='get_clients')
    
    
    #url(r'^create_order$', views.create_order.as_view(), name='create_order'),
]