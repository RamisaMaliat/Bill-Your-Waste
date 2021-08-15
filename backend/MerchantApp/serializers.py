from rest_framework import serializers
from MerchantApp.models import *

class NotCollectedSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotCollectedModel
        fields = ('ID',
                  'username',
                  'title',
                  'category',
                  'description',
                  'amount',
                  'price',
                  'full_address')

class CollectedSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectedModel
        fields = ('ID',
                  'username',
                  'title',
                  'category',
                  'description',
                  'amount',
                  'price',
                  'full_address')
                  
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountModel
        fields = ('ID',
                  'username',
                  'email',
                  'name',
                  'contactNumber',
                  'accountType',
                  'bkash',
                  'nagad',
                  'bankAccount',
                  'paymentMethodDetails'
                  )

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryModel
        fields = ('CategoryID',
                  'CategoryName',
                  'SellPrice',
                  'BuyPrice',
                  'description')

