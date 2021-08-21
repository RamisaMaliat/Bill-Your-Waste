from django.db import models

# Create your models here.

class NotReceivedModel(models.Model):
   buyId = models.IntegerField(primary_key=True)
   sellId = models.IntegerField()
   username = models.TextField
   title = models.TextField()
   category = models.TextField()
   description = models.TextField()
   amount= models.TextField()
   price= models.TextField()
   full_address = models.TextField()

class SellModel(models.Model):
   ID = models.IntegerField(primary_key=True)
   title = models.TextField()
   category = models.TextField()
   description = models.TextField()
   amount= models.TextField()
   price= models.TextField()

class ReceivedModel(models.Model):
   buyId = models.IntegerField(primary_key=True)
   sellId = models.IntegerField()
   username = models.TextField
   title = models.TextField()
   category = models.TextField()
   description = models.TextField()
   amount= models.TextField()
   price= models.TextField()
   full_address = models.TextField()

class AccountModel(models.Model):
   ID = models.IntegerField(primary_key=True)
   username = models.TextField()
   email = models.TextField()
   name = models.TextField()
   contactNumber = models.TextField()
   accountType = models.TextField()
   bkash = models.IntegerField()
   nagad = models.IntegerField()
   bankAccount = models.IntegerField()
   paymentMethodDetails = models.TextField()
