from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.HomePage.as_view(), name='home'),
    url(r'^about$', views.AboutPage.as_view(), name='about'),
    url(r'^fetchUserData$', views.fetchUserData.as_view(), name='fetchUserData'),
]

