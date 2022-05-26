from web3 import Web3
from django.shortcuts import render, redirect
from django.template import loader
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, authenticate, logout
from django.http import HttpResponse,HttpResponseRedirect, JsonResponse
from datetime import datetime, timedelta, date
from django.forms.models import model_to_dict
from django.core import serializers
from .models import *
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


web3 = Web3(Web3.IPCProvider('/mnt/pandoWallet/rinkeby/geth.ipc'))



@csrf_exempt
def newAccount(request):
    try:
        print("web3 - 연결여부 :", web3.isConnected())
        userID = request.POST.get('userID')
        userinfo = UserEthWallet.objects.get(userPK = '2')
        account = web3.geth.personal.newAccount('asd123!')
        userinfo.userPubKey = account
        userinfo.save()
        print("유저 생성: ", userinfo.userPubKey)
        context = {'value' : '1'}
        return HttpResponse(json.dump(context))
    except Exception as error:
        print('error')
        context = {'value' : '-99'}
        return HttpResponse(json.dumps(context))

@csrf_exempt
def UserEthbal(request):
    try:
        # userID = request.POST.get('userID')
        userinfo = UserEthWallet.objects.get(userPK = '2')
        Addr = userinfo.userPubKey
        AddrChecksum = web3.toChecksumAddress(Addr)
        print(AddrChecksum)
        balanceOfAddr = web3.eth.getBalance(AddrChecksum)
        value = web3.fromWei(balanceOfAddr,'ether')
        print(value)
        context = {'value' : '1'}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('error')
        context = {'value' : '-99'}
        return HttpResponse(json.dumps(context))
    
@csrf_exempt
def sendEthUser(request):
    try:
        print("web3 - 연결여부 :", web3.isConnected())
        # userID = request.POST.get('userID')
        userinfo = UserEthWallet.objects.get(userPK= '2')
        getGasPrice = web3.eth.gasPrice
        Addr = userinfo.userPubKey
        AddrChecksum = web3.toChecksumAddress(Addr)
        # print(AddrChecksum)
        balanceOfAddr = web3.eth.getBalance(Addr)
        # print(balanceOfAddr)
        nonce = web3.eth.getTransactionCount(AddrChecksum)
        # print(nonce)
        value = web3.toWei(0.1, 'ether')
        # print(value)
        sendTx = web3.geth.personal.sendTransaction({
            'nonce':nonce,
            'from' : AddrChecksum,
            'gasPrice' : getGasPrice,
            'to' : '0x91a422C27d162020633B42b91a0FeA13aB6282a1',
            'value' : value,
            'data' : ''
        }, 'asd123!')        
        unLock = web3.geth.personal.unlockAccount(AddrChecksum,'asd123!',10)
        lock = web3.geth.personal.lockAccount(AddrChecksum)
        time.sleep(10)
        afterBal = web3.eth.getBalance(AddrChecksum)
        value = web3.fromWei(afterBal,'ether')
        print('잔액은', value, 'ETH')
        context = {'value' : '1'}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('error')
        context = {'value' : '-99'}
        return HttpResponse(json.dumps(context))