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

# 집금 : 모계좌 전송 코드
@csrf_exempt
def havestSolToMain(request):
    try:
        userID = request.POST.get('userID')
        userinfo = SignUp.objects.get(id = userID) 
        print("------------------------------모계좌 입금--------------------------------")
        Maddr = "0x05dB9490F94ccff2810f9A54946f3CDA42118fd8" # 임의의 값
        Uaddr = userinfo.userPubKey
        UadderPriv = Uaddr.userPrivKey
        signKey = b58decode(UadderPriv) 
        getBalance = client.get_balance(Uaddr)
        lamport = getBalance['result']['value'] 
        ui_balance = round(lamport*10**(-9),9)
        if ui_balance >= 0.05:
            print('보내는 계좌: ', Uaddr)
            print('모 계좌:   ', Maddr)
            print('보내는 계좌 잔액: ', ui_balance, "SOL")
            # transaction
            transfer_parameters = TransferParams(
            from_pubkey=PublicKey(Uaddr),
            to_pubkey=PublicKey(Maddr),
            lamports=int(lamport*(10**9))
            )
            # print(transfer_parameters)
            sol_transfer = transfer(transfer_parameters)
            transaction = Transaction().add(sol_transfer)
            # transaction sign
            transaction_result = client.send_transaction(transaction, Keypair.from_secret_key(signKey))
            print(transaction_result)
            # 완료된 tx체크 
            context = {'value' : '1','transaction_result':transaction_result}
            return HttpResponse(json.dumps(context))
        else:
            print("유저가 집금되기 부족한 잔액을 가지고 있습니다.")
        context = {'value' : '1'}
        return HttpResponse(json.dump(context))
    except Exception as error:
        print('error')
        context = {'valule':'-99'}
        return HttpResponse(json.dumps(context))

# 집금 : 계정 간 거래
@csrf_exempt
def solWithdraw(request):
    try:
        userPK = request.POST.get('userPk') # 유저마다 정해지는 고유의 값, 보내는 사람의 pk값이 할당됨
        userAddr = request.POST.get('userAddr') # 보내는 사람 주소
        toAddr = request.POST.get('toAddr') # 유저가 입력한 주소
        volume = request.POST.get('volume') # 수수료를 적용해서 받는사람이 실제 받는 값
        ExsolValue = request.POST.get('ExsolValue') # 유저가 ui에 보낸다고 입력한 값
        userinfo = SignUp.objects.filter(solAddr = toAddr).count() # 유저가 입력한 주소가 db에 있는 주소인지 확인
        if userinfo == 1:
            userTo = SignUp.object.get(solAddr = toAddr) # 만약 유저가 송금할 계좌가 앱에서 만든 계좌면
            TosolVal = float(userTo.solValue) # 일단 DB에 있는 송금계좌 잔액 가져온다
            TosolVal1 = float(volume) + TosolVal # 그리고 db에 유저가 보내겠다고 한 금액을 더해준다
            print('받는사람 계좌 DB에 찍혀야 하는 금액',TosolVal1 )
            userTo.solValue = str(TosolVal1) # 받는사람 DB 솔라나 잔액에 들어가야 할 금액 = 기존금액 + 유저가 인터페이스에 보내겠다고 한 금액

            user = SignUp.objects.get(id = userPK) # 보낸다고 한 사람의 고유 pk값
            SendUsersolbal = float(user.solValue)  # 보내는 유저의 기존 가지고 있던 잔액
            SendUsersolbal1 = SendUsersolbal - float(ExsolValue) # 그러면 보내는 유저 DB에서는 기존에 있던 값에서 보낸다고한 값을 빼줘야 한다
            user.solValue = str(SendUsersolbal1) # 결국 보내는 사람의 잔액 =  기존 db에 있는 잔액 - ui에 보내겠다고한 잔액
            user.save()
            userTo.save()
            now = datetime.now()
            now = now.strftime('%Y-%m-%d %H:%M:%S')
            test = SolScan(
                userPK = userPK,
                userAddr = userAddr,
                lamport = 5000,
                fee =None,
                signer =None,
                fromAddr =None,
                by =userAddr,
                slot = None,
                status =None,
                to =toAddr,
                txHash = None,
                volume = None,
            )
            test.save()
            
# 내부계좌에서 외부계좌로 
        elif userinfo == 0:
            print("------------------------------출금--------------------------------")
            Maddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'  #모계좌
            userinfo = SignUp.objects.get(id = '2') # 모계좌는 고정이니까 받아올 필요가 있나? 2번값이 모계좌라고 가정
            fromAddr = userinfo.userPubKey  # 모계좌의 공개키
            fromAddrPriv = userinfo.userPrivKey # 모계좌의 비밀키
            Uaddr = toAddr  #유저가 입력한 계좌
            signKey = b58decode(fromAddrPriv) 
            sol_amount = ExsolValue # 유저가 보내겠다고 UI에 입력한 값
            
            # transaction
            transfer_parameters = TransferParams(
            from_pubkey=PublicKey(fromAddr),
            to_pubkey=PublicKey(Uaddr),
            lamports=int(sol_amount*(10**9))
            )
            
            # print(transfer_parameters)
            sol_transfer = transfer(transfer_parameters)
            transaction = Transaction().add(sol_transfer)
            
            # transaction sign
            transaction_result = client.send_transaction(transaction, Keypair.from_secret_key(signKey))
            print(transaction_result)
            
            # 완료된 tx체크 
            context = {'value' : '1','transaction_result':transaction_result}
    
            # 잔액조회 
            getBalance = client.get_balance(fromAddr)
            lamports = getBalance['result']['value'] 
            ui_balance = round(lamports*10**(-9),9) 
    
            print('모 계좌:     ', Maddr)
            print('받는 계좌:   ', Uaddr)
            print('       |------------------(영수증)-------------------|')
            print('             모 계좌 잔액:     ', ui_balance, 'sol')
            print('             보내는 금액:      ', ExsolValue, 'sol')
            print('                    ++++++++++++++++++++++')
            print('             가스비:           ', 5000, 'lamport')
            print('       |---------------------------------------------|')
            user = SignUp.objects.get(id = userPK) # 보낸다고 한사람 db 금액 뺴주기
            intSol = float(user.solValue)
            intSol1 = intSol - float(ExsolValue)
            user.solValue = str(intSol1)
            user.save()
            now = datetime.now()
            now = now.strftime('%Y-%m-%d %H:%M:%S')
            test = SolScan(
                userPK = userPK,
                userAddr = userAddr,
                lamport = 5000,
                fee =None,
                signer =None,
                fromAddr =None,
                by =userAddr,
                slot = None,
                status =None,
                to =toAddr,
                txHash = None,
                volume = None,
            )
            test.save()
    
            print("-----------------------------------------------------------------")
        context = {'value':'1'}
        return HttpResponse(json.dumps(context))

    except Exception as error:
        print('error')
        context = {'valule':'-99'}
        return HttpResponse(json.dumps(context))