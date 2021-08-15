from django.conf.urls import url, include
from django.urls import path
from . import views

urlpatterns = [
    path('consumer/notReceived',views.notReceived,name=''),
    path('consumer/confirmOrder',views.confirmOrder,name=''),
    path('consumer/received',views.received,name=''),
    path('consumer/account',views.account,name=''),
    path('consumer/<slug:category>',views.sellPosts,name=''),
    
]