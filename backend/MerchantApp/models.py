from django.db import models

# Create your models here.

class NotCollectedModel(models.Model):
   ID = models.IntegerField(primary_key=True)
   username = models.TextField
   title = models.TextField()
   category = models.TextField()
   description = models.TextField()
   amount= models.TextField()
   price= models.TextField()
   full_address = models.TextField()

class CollectedModel(models.Model):
   ID = models.IntegerField(primary_key=True)
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

class CategoryModel(models.Model):
    CategoryID = models.IntegerField(primary_key=True)
    CategoryName = models.TextField()
    SellPrice = models.TextField()
    BuyPrice = models.TextField()
    description = models.TextField()

