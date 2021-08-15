from rest_framework import serializers
from ConsumerApp.models import *

class NotReceivedSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotReceivedModel
        fields = ('sellId',
                  'buyId',
                  'username',
                  'title',
                  'category',
                  'description',
                  'amount',
                  'price',
                  'full_address')

class SellSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellModel
        fields = ('ID',
                  'title',
                  'category',
                  'description',
                  'amount',
                  'price')

class ReceivedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceivedModel
        fields = ('sellId',
                  'buyId',
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