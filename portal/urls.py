from django.conf.urls import url
from portal import views

urlpatterns = [
    url(r'^$', views.HomePage.as_view(), name='home'),
    url(r'^about$', views.AboutPage.as_view(), name='about'),
    url(r'^fetchUserData$', views.fetchUserData.as_view(), name='fetchUserData'),

    #api calls for crud operations
    url(r'^create_order$', views.create_order.as_view(), name='create_order'),
]

