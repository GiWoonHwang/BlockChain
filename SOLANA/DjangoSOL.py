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
import time
from requests.structures import CaseInsensitiveDict
from solana.rpc.api import Client
import solana
from solana.account import  Account 
from base58 import b58encode, b58decode
from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.system_program import TransferParams, transfer
from solana.transaction import Transaction

from web3 import Web3, HTTPProvider, IPCProvider

web3 = Web3(IPCProvider("/mnt/wallet/rinkeby/geth.ipc"))


client = Client("https://api.devnet.solana.com")


# 지갑 생성
@csrf_exempt
def solNewAccount(request):
    try:
        test = client.is_connected()
        print(test)
        # userID = request.POST.get('userID')
        userinfo = UserSolWallet.objects.get(userPK = '1')
        # # 1. 계좌생성
        account = Account() # 기본 setting
        # print(account)
        secretKey = account.secret_key() # account로 부터  비밀키 생성
        # print(secretKey) 
        bytesaccount = bytes(account.public_key()) # 어카운트로 생성된 값에 bytes화 시킴
        # print(bytesaccount) 
        address_public = b58encode(bytesaccount).decode() # 바이트화 된 account를 인코딩하면 공개키(주소)가 된다
        print(address_public)
        make_privateKey = secretKey + bytesaccount # 비밀키를 만드는 과정. 시크릿키와 바이트화된 account를 더한다
        # print(make_privateKey)
        realprivate_key = b58encode(make_privateKey).decode()  # 뒤에 더한 값을 인코딩하면 비밀키가 만들어진다.
        print(realprivate_key)
        userinfo.userPubKey = address_public
        userinfo.userPrivKey = realprivate_key
        userinfo.save()
        context = {'value' : '1'}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('error')
        context = {'valule':'-99'}
        return HttpResponse(json.dumps(context))

# 조회
@csrf_exempt
def UserSolbal(request):
    try:
        # userID = request.POST.get('userID')
        userinfo = UserSolWallet.objects.get(userPK = '1')
        addr = userinfo.userPubKey
        getBalance = client.get_balance(addr) 
        lamports = getBalance['result']['value'] 
        ui_balance = round(lamports*10**(-9),9) 
        print(ui_balance)
        context = {'value' : '1'}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('error')
        context = {'valule':'-99'}
        return HttpResponse(json.dumps(context))

# 다른 계좌로 송금  
@csrf_exempt
def sendSolUser(request):
    try:
        # userID = request.POST.get('userID')
        userinfo = UserSolWallet.objects.get(userPK = '1')
        fromAddr = userinfo.userPubKey 
        fromAddrPriv = userinfo.userPrivKey
        toAddr = "AsDHpXLGxHeHNWxpqEZHoMC2LpWjJznfWrm8nTz9FvDn"
        signKey = b58decode(fromAddrPriv) 
        sol_amount = 0.1
        # transaction
        transfer_parameters = TransferParams(
        from_pubkey=PublicKey(fromAddr),
        to_pubkey=PublicKey(toAddr),
        lamports=int(sol_amount*(10**9))
        )
        # print(transfer_parameters)
        sol_transfer = transfer(transfer_parameters)
        transaction = Transaction().add(sol_transfer)
        # transaction sign
        transaction_result = client.send_transaction(transaction, Keypair.from_secret_key(signKey))
        print(transaction_result)
        # 완료된 tx체크 
        context = {'value' : '1'}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('error')
        context = {'valule':'-99'}
        return HttpResponse(json.dumps(context))