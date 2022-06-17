from re import M
from django.shortcuts import render, redirect
from django.template import loader
# from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, authenticate, logout
from django.http import HttpResponse,HttpResponseRedirect, JsonResponse
from datetime import datetime, timedelta, date
from django.forms.models import model_to_dict
from django.core import serializers
# from .models import *
# from .forms import *
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.core import serializers
from django.contrib.auth.hashers import make_password, check_password
import hmac, base64, struct, hashlib, time, requests
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
import json
import time
from base64 import b64encode, b64decode
import secrets
from web3 import Web3, IPCProvider, HTTPProvider
from eth_account import Account

## https://matic-mumbai.chainstacklabs.com
# 연결 여부 확인
web3 = Web3(HTTPProvider("https://matic-mumbai.chainstacklabs.com"))

isConnected = web3.isConnected()
print("폴리곤 연결여부:", isConnected)

# 폴리곤 지갑 생성
@csrf_exempt
def PolnewAccount(request):
    try:
        # userID = request.POST.get('userID')
        # userinfo = SignUp.objects.get(id = userID )
        
        userinfo = SignUp.objects.get(id = '3')
        priv = secrets.token_hex(32) # 난수생성
        private_key = "0x" + priv # 난수를 통해 비밀키 생성
        print ("2. 생성된 비밀키 남에게 보여주지 말 것 :", private_key)
        acct = Account.from_key(private_key) # 공개키 생성
        print("3. 생성된 공개키 지갑주소:", acct.address) # 주소 생성
        userinfo.polAddr = acct
        userinfo.polPubKey = private_key
        
    
    except Exception as error:
        print('error')
        context = {'value' : '-99'}
        return HttpResponse(json.dumps(context))

# 폴리곤 잔액 조회 
@csrf_exempt
def PolUserPolbal(request):
    try:
        userID = request.POST.get('userID')
        userinfo = SignUp.objects.get(userPK = userID)
        userinfo = SignUp.objects.get(id = '3')
        Addr = userinfo.polAddr
        AddrChecksum = web3.toChecksumAddress(Addr)
        
        print('체크', AddrChecksum)
        
        balanceOfAddr = web3.eth.getBalance(AddrChecksum)
        value = web3.fromWei(balanceOfAddr,'ether')
        print(value)
        context = {'value' : '1', 'value' : value}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('error')
        context = {'value' : '-99'}
        return HttpResponse(json.dumps(context))

# 폴리곤 송금  
@csrf_exempt
def PolsendPolUser(request):
    try:
        # userID = request.POST.get('userID')
        # userinfo = SignUp.objects.get(userPK= userID)
        userinfo = SignUp.objects.get(id = '3')
        Addr = userinfo.polAddr
        privKey = userinfo.polPubKey # privkey
        PolValue = request.POST.get('PolValue')
        AddrChecksum = web3.toChecksumAddress(Addr)
        print("2. checkSum - 확인여부 :", AddrChecksum)
        print("2.1 privKey - 확인여부 :", privKey)

        getGasPrice = web3.eth.gasPrice
        print("3. 가스비 - 확인여부 :", getGasPrice)

        balanceOfAddr = web3.eth.getBalance(Addr)
        print("4. 잔액 - 확인여부 :", balanceOfAddr)

        nonce = web3.eth.getTransactionCount(AddrChecksum)
        print("4. 논스 - 확인여부 :", nonce)

        
        
        value = web3.toWei(PolValue, 'ether')
        print("5. 보내는금액 - 확인여부 :", value)

        tx = {'nonce': nonce,
            'to': '0x4617f23881b99201336A98E398299dBd406bEEb2',
            'value': value,
            'gas': 21000,
            'gasPrice': getGasPrice,
            'chainId': 80001
        }

        signed_tx = web3.eth.account.signTransaction(tx, privKey)
        print("6. 트랜잭션 - 확인여부 :", signed_tx)

        tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
        print("7. 트랜잭션 전송 - 확인여부 :", web3.toHex(tx_hash))
        context = {'value' : '1'}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('error')
        context = {'value' : '-99'}
        return HttpResponse(json.dumps(context))
