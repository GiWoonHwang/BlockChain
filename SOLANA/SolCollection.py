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
# D2oE8PK7zkgNBhPGL6Ro4hctcEStbFZKonZAxStap4zx  모계좌 id 7
# 개인키 4QGtsTrNPD6eLGBWPCQrxEXGihADmTZqXnCvy2x3NgRrW9rTghnB58ALVZsEXsTd3fHWn7ZnTYcztJ394Lohtaeu, 공개키 BQwowTLsifAWXBPwYRVXeCc6kSEE7asGM3V6HEC5v8PK id 8
@csrf_exempt
def havestSolToMain(request):
    try:
        # userID = request.POST.get('userID')
        userinfo = SignUp.objects.get(id = 8)
        print('1.', userinfo) 
        print("------------------------------모계좌 입금--------------------------------")
        Maddr = "D2oE8PK7zkgNBhPGL6Ro4hctcEStbFZKonZAxStap4zx" # 임의의 값
        print('2.', Maddr)
        Uaddr = userinfo.userPubKey
        print('3.', Uaddr)
        UadderPriv = userinfo.userPrivKey
        print('4',UadderPriv)
        signKey = b58decode(UadderPriv)
        print('5',signKey)
        getBalance = client.get_balance(Uaddr)
        print('6',getBalance)
        lamport = getBalance['result']['value']
        print('7',lamport)
        finalLam = int(lamport - 1000000) # 최대 수수료를 뺀 유저의 모든 sol 잔액
        print('8',finalLam)
        ui_balance = round(finalLam*10**(-9),9)
        print('9',ui_balance)
        if ui_balance >= 0.05:
            print('보내는 계좌: ', Uaddr)
            print('모 계좌:   ', Maddr)
            print('보내는 계좌 잔액: ', ui_balance, "SOL")
            # transaction
            transfer_parameters = TransferParams(
                from_pubkey=PublicKey(Uaddr),
                to_pubkey=PublicKey(Maddr),
                lamports=int(ui_balance*(10**9))
            )
            print('10',transfer_parameters)
            # print(transfer_parameters)
            sol_transfer = transfer(transfer_parameters)
            print('11',sol_transfer)
            transaction = Transaction().add(sol_transfer)
            print('12',transaction)
            # transaction sign
            transaction_result = client.send_transaction(transaction, Keypair.from_secret_key(signKey))
            print('13',transaction_result)
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



# id = 7 공개키 : D2oE8PK7zkgNBhPGL6Ro4hctcEStbFZKonZAxStap4zx 개인키 : 4GkW2DwEtfCuMuZi7xSyUKWAwdoAe2dvAtFtLvFcVPjy5pifuAQaZu7haaTaUgYeDzHH8ntMR7YYMrnn5LxVPr2g
# id = 8 공개키 : BQwowTLsifAWXBPwYRVXeCc6kSEE7asGM3V6HEC5v8PK 개인키 : 4QGtsTrNPD6eLGBWPCQrxEXGihADmTZqXnCvy2x3NgRrW9rTghnB58ALVZsEXsTd3fHWn7ZnTYcztJ394Lohtaeu
# id = 9 공개키 : AWBE3maip9q9Cy6ujQyj7VKivW8qVW3SmkwczrHCaXrP 개인키 : 3qPK6iuBTFJsyf7sMzNuXaHrxH1DcYsqDistMEAWkBrmu34gSZPqBGDuUrmbdpRsJ7HZmyRYQ1YNa8HDCNaMJYdu






#  집금 : 계정 간 거래
@csrf_exempt
def solWithdraw(request):
    try:
        # userPK = request.POST.get('userPk') # 유저마다 정해지는 고유의 값, 보내는 사람의 pk값이 할당됨
        userPK = 8
        # userAddr = request.POST.get('userAddr') # 보내는 사람 주소
        
        # toAddr = request.POST.get('toAddr') # 유저가 입력한 주소
        toAddr = 'AWBE3maip9q9Cy6ujQyj7VKivW8qVW3SmkwczrHCaXrP' # id=9번으로 보내준다.
        toAddr = '4NwS4ezQ3tU4sX26KUmwzKxQwpgwBFMuGYp6U5TBPvc3' # 외부계좌
        print(toAddr)
        # volume = request.POST.get('volume') # 수수료를 적용해서 받는사람이 실제 받는 값
        volume = 0.05
        # ExsolValue = request.POST.get('ExsolValue') # 유저가 ui에 보낸다고 입력한 값
        ExsolValue = 0.05
        
        
        
        userinfo = SignUp.objects.filter(userPubKey = toAddr).count() # 유저가 입력한 주소가 db에 있는 주소인지 확인
        
        print('0', userinfo)
        if userinfo == 1:
            userTo = SignUp.objects.get(userPubKey = toAddr) # 만약 유저가 송금할 계좌가 앱에서 만든 계좌면
            print('1', userTo)
            
            TosolVal = float(userTo.solValue) # 일단 DB에 있는 송금계좌 잔액 가져온다
            print('2',TosolVal)
            
            TosolVal1 = float(ExsolValue) + TosolVal # 그리고 db에 유저가 보내겠다고 한 금액을 더해준다
            print('받는사람 계좌 DB에 찍혀야 하는 금액',TosolVal1 )
            
            userTo.solValue = str(TosolVal1) # 받는사람 DB 솔라나 잔액에 들어가야 할 금액 = 기존금액 + 유저가 인터페이스에 보내겠다고 한 금액
            print('3', userTo)
            
            user = SignUp.objects.get(id = userPK) # 보낸다고 한 사람의 고유 pk값
            print('4', user)
            
            SendUsersolbal = float(user.solValue)  # 보내는 유저의 기존 가지고 있던 잔액
            print('5',SendUsersolbal)
            
            SendUsersolbal1 = SendUsersolbal - float(ExsolValue) # 그러면 보내는 유저 DB에서는 기존에 있던 값에서 보낸다고한 값을 빼줘야 한다
            print('6', SendUsersolbal1)
            
            user.solValue = str(SendUsersolbal1) # 결국 보내는 사람의 잔액 =  기존 db에 있는 잔액 - ui에 보내겠다고한 잔액
            user.save()
            userTo.save()
            now = datetime.now()
            now = now.strftime('%Y-%m-%d %H:%M:%S')
            test = SolScan(
                userPK = userPK,
                userAddr = None, # 수동이라 일단 none
                lamport = 5000,
                fee =None,
                signer =None,
                fromAddr =None,
                by =None, # 수동이라 일단 none
                slot = None,
                status =None,
                to =toAddr,
                txHash = None,
                volume = None,
            )
            test.save()
            print('7')
# 내부계좌에서 외부계좌로 
        elif userinfo == 0:
            print("------------------------------출금--------------------------------")
            Maddr = 'D2oE8PK7zkgNBhPGL6Ro4hctcEStbFZKonZAxStap4zx'  #모계좌
            userinfo = SignUp.objects.get(id = '7') # 모계좌는 고정이니까 받아올 필요가 있나? id 7번값이 모계좌라고 가정
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
            print(intSol)
            intSol1 = intSol - float(ExsolValue)
            print(intSol1)
            user.solValue = str(intSol1)
            user.save()
            now = datetime.now()
            now = now.strftime('%Y-%m-%d %H:%M:%S')
            test = SolScan(
                userPK = userPK,
                userAddr = None,
                lamport = 5000,
                fee =None,
                signer =None,
                fromAddr =None,
                by =None,
                slot = None,
                status =None,
                to =toAddr,
                txHash = None,
                volume = None,
            )
            test.save()
            print('clear')
            print("-----------------------------------------------------------------")
        context = {'value':'1'}
        return HttpResponse(json.dumps(context))

    except Exception as error:
        print('error')
        context = {'valule':'-99'}
        return HttpResponse(json.dumps(context))
