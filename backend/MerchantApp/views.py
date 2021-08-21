from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from MerchantApp.models import *
from MerchantApp.serializers import *
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
def notCollected(request):
	if request.method == 'GET':
		headers_token = request.META['HTTP_AUTHORIZATION'][7:]
		print(headers_token)
		user = Token.objects.get(key=headers_token).user
		print(user)
		query = '''SELECT sell.id as ID, username, title, description, amount, price, category.name as category, full_address
		FROM sell, category
		WHERE category.id = sell.category
		and username = '{var_user}' and collected = 0 order by sell.id desc'''.format(var_user=user)
		result = NotCollectedModel.objects.raw(query)
		result_serializer = NotCollectedSerializer(result, many=True)
		return JsonResponse(result_serializer.data, safe=False)  

@csrf_exempt
def collected(request):
	if request.method == 'GET':
		headers_token = request.META['HTTP_AUTHORIZATION'][7:]
		print(headers_token)
		user = Token.objects.get(key=headers_token).user
		print(user)
		query = '''SELECT sell.id as ID, username, title, description, amount, price, category.name as category, full_address
		FROM sell, category
		WHERE category.id = sell.category
		and username = '{var_user}' and collected = 1 order by sell.id desc'''.format(var_user=user)
		result = CollectedModel.objects.raw(query)
		result_serializer = CollectedSerializer(result, many=True)
		return JsonResponse(result_serializer.data, safe=False) 

@csrf_exempt
def totalDue(request):
	result = 0
	if request.method == 'GET':
		try:
			headers_token = request.META['HTTP_AUTHORIZATION'][7:]
			print(headers_token)
			user = Token.objects.get(key=headers_token).user
			print(user)
			conn = sqlite3.connect('db.sqlite3')
			cur = conn.cursor()
			query = '''SELECT sum(price)
			FROM sell
			WHERE username = '{var_user}' and collected=0 '''.format(var_user=user)
			cur.execute(query)
			result = cur.fetchone()[0] 
			cur.close()
			conn.close()
		except:
			result = 0
	return JsonResponse(result, safe=False)  

@csrf_exempt
def totalReceived(request):
	result = 0
	if request.method == 'GET':
		try:
			headers_token = request.META['HTTP_AUTHORIZATION'][7:]
			print(headers_token)
			user = Token.objects.get(key=headers_token).user
			print(user)
			conn = sqlite3.connect('db.sqlite3')
			cur = conn.cursor()
			query = '''SELECT sum(price)
			FROM sell
			WHERE username = '{var_user}' and collected=1 '''.format(var_user=user)
			cur.execute(query)
			result = cur.fetchone()[0] 
			cur.close()
			conn.close()
		except:
			result = 0
	return JsonResponse(result, safe=False)  

@csrf_exempt
def askCategory(request):
	headers_token = request.META['HTTP_AUTHORIZATION'][7:]
	print(headers_token)
	user = Token.objects.get(key=headers_token).user
	print(user)
	name_map = {'id': 'CategoryID', 'name': 'CategoryName', 'sellPerGram':'SellPrice', 'buyPerGram':'BuyPrice', 'about':'description'}
	if request.method == 'GET':
		categories = CategoryModel.objects.raw('SELECT * FROM category', translations=name_map)
		categories_serializer = CategorySerializer(categories, many=True)
		return JsonResponse(categories_serializer.data, safe=False)

@csrf_exempt
def getCategory(request):
	headers_token = request.META['HTTP_AUTHORIZATION'][7:]
	print(headers_token)
	user = Token.objects.get(key=headers_token).user
	data = JSONParser().parse(request)
	path = data['path']
	c_id = path[13:]
	print(user,path,c_id)
	name_map = {'id': 'CategoryID', 'name': 'CategoryName', 'sellPerGram':'SellPrice', 'buyPerGram':'BuyPrice', 'about':'description'}
	query = 'SELECT * FROM category where id = '+c_id
	categories = CategoryModel.objects.raw(query, translations=name_map)
	categories_serializer = CategorySerializer(categories, many=True)
	return JsonResponse(categories_serializer.data, safe=False)

@csrf_exempt
def sell(request):
	if request.method=='POST':
		success = False
		try:
			headers_token = request.META['HTTP_AUTHORIZATION'][7:]
			user = Token.objects.get(key=headers_token).user
			print(user)
			data = JSONParser().parse(request)
			title = data['title']
			description = data['description']
			amount = data['amount']
			address = data['address']
			category = data['category']
			print(user,title,description,amount,address,category)
			conn = sqlite3.connect('db.sqlite3')
			cur = conn.cursor()
			query = "select sellPerGram from category where id = {var_cat}".format(var_cat=category)
			cur.execute(query)
			price = float(cur.fetchone()[0])*float(amount)
			print(user,title,description,amount,address,category,price)
			query = '''INSERT INTO sell(username, title, description, amount, full_address, category, price) 
			VALUES ('{var_user}','{var_title}', '{var_description}', {var_amount}, '{var_add}', '{var_cat}', {var_price} 
			) '''.format(var_user=user,var_title=title, var_description=description, var_amount=amount, var_add=address, var_cat=category, var_price=price)
			cur.execute(query)
			conn.commit()
			cur.close()
			conn.close()
			success = True
		except:
			success = False
		return JsonResponse(success, safe=False) 

@csrf_exempt
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

