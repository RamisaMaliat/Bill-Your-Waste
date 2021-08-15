from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from ConsumerApp.models import *
from ConsumerApp.serializers import *
from django.core.files.storage import default_storage
from django.shortcuts import render
from django.http.response import HttpResponse
from django.contrib.auth.hashers import  make_password
from django.contrib.sessions.models import Session
from django.contrib.auth import authenticate
from django.contrib.auth.models import auth
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from rest_framework.authtoken.models import Token
import sqlite3
import json

# Create your views here.

@csrf_exempt
def confirmOrder(request):
	if request.method=='POST':
		success = False
		try:
			headers_token = request.META['HTTP_AUTHORIZATION'][7:]
			user = Token.objects.get(key=headers_token).user
			print(user)
			data = JSONParser().parse(request)
			address = data['details']
			sellid = data['path'][1:]
			print(address,sellid)

			conn = sqlite3.connect('db.sqlite3')
			cur = conn.cursor()

			query = "select category from sell where id = {var_id} ".format(var_id = sellid)
			cur.execute(query)
			categoryid = cur.fetchone()[0]

			query = "select amount from sell where id = {var_id} ".format(var_id = sellid)
			cur.execute(query)
			amount = cur.fetchone()[0]

			query = "select buyPerGram from category where id = {var_id} ".format(var_id = categoryid)
			cur.execute(query)
			price = float(cur.fetchone()[0])*float(amount)

			query = '''INSERT INTO buy(sellId, sent, price, username, full_address) 
			VALUES ({var_id},0, {var_price}, '{var_user}', '{var_add}'
			) '''.format(var_user=user,var_id=sellid, var_price=price, var_add=address)
			cur.execute(query)
			conn.commit()

			query='''Update sell SET sold = 1 where id = '{var_id}' '''.format(var_id = sellid)
			cur.execute(query)
			conn.commit()

			cur.close()
			conn.close()
			success = True
		except:
			success = False
		return JsonResponse(success, safe=False) 

@csrf_exempt
def sellPosts(request,category):
	if request.method == 'GET':
		headers_token = request.META['HTTP_AUTHORIZATION'][7:]
		print(headers_token)
		user = Token.objects.get(key=headers_token).user
		print(user)
		print(category)
		c_id = category[11:]
		print(user,c_id)
		conn = sqlite3.connect('db.sqlite3')
		cur = conn.cursor()
		query = "select buyPerGram from category where id = {var_cat}".format(var_cat=c_id)
		cur.execute(query)
		price = cur.fetchone()[0]
		print(price)
		cur.close()
		conn.close()
		query = '''SELECT sell.id as ID, title, description, amount, {var_price} as price, category.name as category
		FROM sell, category
		WHERE category.id = sell.category
		and category.id = {var_categoryid} and sold = 0 '''.format(var_categoryid=c_id,var_price=price)
		result = SellModel.objects.raw(query)
		result_serializer = SellSerializer(result, many=True)
		return JsonResponse(result_serializer.data, safe=False)  

@csrf_exempt
def notReceived(request):
	if request.method == 'GET':
		headers_token = request.META['HTTP_AUTHORIZATION'][7:]
		print(headers_token)
		user = Token.objects.get(key=headers_token).user
		print(user)
		query = '''SELECT buy.id as buyId, sellId, buy.username as username, title, description, amount, buy.price as price, category.name as category, buy.full_address as full_address
		FROM sell, category, buy
		WHERE category.id = sell.category and sell.id = buy.sellId
		and buy.username = '{var_user}' and sent = 0 order by buy.id desc'''.format(var_user=user)
		result = NotReceivedModel.objects.raw(query)
		result_serializer = NotReceivedSerializer(result, many=True)
		return JsonResponse(result_serializer.data, safe=False)  

@csrf_exempt
def received(request):
	if request.method == 'GET':
		headers_token = request.META['HTTP_AUTHORIZATION'][7:]
		print(headers_token)
		user = Token.objects.get(key=headers_token).user
		print(user)
		query = '''SELECT buy.id as buyId, sellId, buy.username as username, title, description, amount, buy.price as price, category.name as category, buy.full_address as full_address
		FROM sell, category, buy
		WHERE category.id = sell.category and sell.id = buy.sellId
		and buy.username = '{var_user}' and sent = 1 order by buy.id desc'''.format(var_user=user)
		result = ReceivedModel.objects.raw(query)
		result_serializer = ReceivedSerializer(result, many=True)
		return JsonResponse(result_serializer.data, safe=False) 

def account(request):
	if request.method == 'GET':
		headers_token = request.META['HTTP_AUTHORIZATION'][7:]
		print(headers_token)
		user = Token.objects.get(key=headers_token).user
		print(user)
		query = '''SELECT id as ID, userInfo.username, email, name, contactNumber, accountType, bkash, nagad, bankAccount, paymentMethodDetails
		FROM auth_user, userInfo
		WHERE auth_user.username = userInfo.username
		and auth_user.username = '{var_user}' '''.format(var_user=user)
		result = AccountModel.objects.raw(query)
		result_serializer = AccountSerializer(result, many=True)
		return JsonResponse(result_serializer.data, safe=False) 