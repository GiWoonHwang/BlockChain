from re import M
from django.shortcuts import render, redirect
from django.template import loader
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, authenticate, logout
from django.http import HttpResponse,HttpResponseRedirect, JsonResponse
from datetime import datetime, timedelta, date
from django.forms.models import model_to_dict
from django.core import serializers
from sqlalchemy import false
from .models import *
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.core import serializers
from django.contrib.auth.hashers import make_password, check_password
import hmac, base64, struct, hashlib, time, requests
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
import json
import time
from importlib.resources import contents
from urllib import response
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
import time
import secrets
from web3 import Web3, HTTPProvider,IPCProvider
from requests.structures import CaseInsensitiveDict
false = False
true = True
web3 = Web3(HTTPProvider("https://rinkeby.infura.io/v3/bdeb52cede8f45a69bbe940293eb1e72")) # 연결여부
abi =[
{"constant":True,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":False,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},
{"constant":True,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":False,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"},{"name":"_release_time","type":"uint256"}],"name":"addTokenLockDate","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},
{"constant":True,"inputs":[{"name":"_sender","type":"address"}],"name":"lockVolumeAddress","outputs":[{"name":"locked","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":False,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},
{"constant":True,"inputs":[],"name":"note","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":True,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":False,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},
{"constant":False,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},
{"constant":False,"inputs":[{"name":"newAdmin","type":"address"}],"name":"setAdmin","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},
{"constant":True,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":True,"inputs":[{"name":"_addr","type":"address"}],"name":"getMinLockedAmount","outputs":[{"name":"locked","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":True,"inputs":[{"name":"_sender","type":"address"},{"name":"_value","type":"uint256"}],"name":"canTransferIfLocked","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":True,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":True,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":True,"inputs":[{"name":"_sender","type":"address"}],"name":"LockTransferAddress","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"view","type":"function"},
{"constant":False,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},
{"constant":False,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},
{"constant":True,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"}],"name":"addTokenLock","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},
{"constant":False,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},
{"constant":True,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":False,"stateMutability":"view","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},
{"payable":True,"stateMutability":"payable","type":"fallback"},
{"anonymous":False,"inputs":[{"indexed":True,"name":"owner","type":"address"},{"indexed":True,"name":"spender","type":"address"},{"indexed":False,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},
{"anonymous":False,"inputs":[{"indexed":True,"name":"to","type":"address"},{"indexed":False,"name":"time","type":"uint256"},{"indexed":False,"name":"amount","type":"uint256"}],"name":"AddTokenLockDate","type":"event"},
{"anonymous":False,"inputs":[{"indexed":True,"name":"to","type":"address"},{"indexed":False,"name":"amount","type":"uint256"}],"name":"AddTokenLock","type":"event"},
{"anonymous":False,"inputs":[{"indexed":True,"name":"burner","type":"address"},{"indexed":False,"name":"amount","type":"uint256"}],"name":"Burn","type":"event"},
{"anonymous":False,"inputs":[{"indexed":True,"name":"previousOwner","type":"address"},{"indexed":True,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
{"anonymous":False,"inputs":[{"indexed":True,"name":"from","type":"address"},{"indexed":True,"name":"to","type":"address"},{"indexed":False,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]





# 집금 flow: 먼저 모계좌에서 유저계좌에 소량의 수수료를 보내준 후, 유저계좌의 모든 토큰을 모계좌로 전송한다.
@csrf_exempt
def collectPando(request):
    # data = json.loads(request.body.decode('utf-8'))
    # print('collectionEth - react에서 받은 data: ', data)
    # userID = data['userID']
    userinfo = SignUp.objects.get(id = 1)
    
    
    
    contract = "0x34bfb68cca8d174192f0e1a63ba3fdf50741ac4e" # 컨트랙트 주소 
    contractChecksum = web3.toChecksumAddress(contract) # 컨트랙트도 조회및 사용을 위해서는 checksum 필요
    tokenContract = web3.eth.contract(contractChecksum,abi=abi) # 토큰 조회를 위한 기본적인 구문

    # UserAddr = "0x4617f23881b99201336A98E398299dBd406bEEb2" # 병훈님께 토큰을 받은 계좌 내 메타마스크 account 1, 비공개키 ""
    UserAddr = userinfo.EthPandoWallet # 유저 지갑주소
    UserAddrChecksum = web3.toChecksumAddress(UserAddr) # 조회할때는 항상 checksum 해줘야함
    private_key = userinfo.EthPandoPriv # 유저 비밀키
    
    motherAddr = "0xA80C83DE7AFa42792b98bB7A4Bb11368ff878953" # 모계좌 내 메타마스크 account2
    motherAddrrtoChecksum = web3.toChecksumAddress(motherAddr) # 조회할때는 항상 checksum 해줘야함

    uservalue = tokenContract.functions.balanceOf(UserAddr).call() # 유저 토큰 잔액 조회
    mothervalue = tokenContract.functions.balanceOf(motherAddr).call() # 엄마 토큰 잔액 조회

    uservalue = float(uservalue) # 잔액 대소관계 비교를 위해 float 씌움
    print("유저잔액얼마?",uservalue)
    if uservalue >= 500: # 집금시킬 최소 토큰 개수

        print("오늘 점심 별로임")
    #  일단 토큰 전송을 위해 모계좌에서 소량의 이더 보내줘야 함
        gas_price = web3.eth.gas_price
        print("가스 시가 얼마누",gas_price )
        multiply_gas_price = gas_price * 21000
        motherAddr = "0xA80C83DE7AFa42792b98bB7A4Bb11368ff878953"
        motherAddrPriv = "" # 엄마계좌 비공개키
        print(f"현재 전송 수수료는?? = {multiply_gas_price} wei")
        nonce = web3.eth.getTransactionCount(motherAddrrtoChecksum)
        tx = {
            'nonce' : nonce,
            'to': UserAddr, # 유저 계좌
            'value': (gas_price * 31000),
            'gas': 21000,
            'gasPrice': gas_price,
            'chainId': 4 
        }
        print("밥 진짜 별로임")
        signed_tx = web3.eth.account.signTransaction(tx, motherAddrPriv)
        tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
        time.sleep(20)
        print("3. 트랜잭션 전송 - 확인여부 :", web3.toHex(tx_hash))
        print('-------------집금전 가스보내주기 Kanryō')
        print("-"*80)
    # 소량 이더 보냈으니 엄마계좌로 토큰 모은다 ---------------------------------------------------------------------------------------------------

    # 토큰 이름하고 심볼조회 한번 해주고
        name=tokenContract.functions.name().call()
        symbol=tokenContract.functions.symbol().call()
        print('2 Name :', name)
        print('3 Symbol :', symbol)

    # 토큰이 소수 몇번째까지로 쪼갤수 있나도 한번 봐주고
        dec=tokenContract.functions.decimals().call()
        print('4 Decimals :',dec)
        dec=10**dec
        supply=tokenContract.functions.totalSupply().call()/dec
        print(f'5 Total Supply : {supply} {symbol}') # 토큰 발행 총량 

        # UserAddr = "0x4617f23881b99201336A98E398299dBd406bEEb2" # 병훈님께 토큰을 받은 계좌 내 메타마스크 account 1, 비공개키 ""
        UserAddrChecksum = web3.toChecksumAddress(UserAddr) # 조회할때는 항상 checksum 해줘야함
        balance=tokenContract.functions.balanceOf(UserAddr).call()/dec # 유저 토큰 몇개야
        print(f"6 my Tokens with the contract : {balance} {symbol}")
        balance = float(balance) - 200 # 900 나중에 지우기

        # private_key = "" # 유저 비공개키
        acct = web3.eth.account.privateKeyToAccount(private_key)

        motherAddr = "0xA80C83DE7AFa42792b98bB7A4Bb11368ff878953" # 모계좌 내 메타마스크 account2
        motherAddrrtoChecksum = web3.toChecksumAddress(motherAddr)
        print('오늘 점심은 닭가슴살')

        nonce = web3.eth.getTransactionCount(UserAddrChecksum)
        transaction = tokenContract.functions.transfer(motherAddrrtoChecksum, web3.toWei(balance, 'ether')).buildTransaction({
        'gas': 200000,
        'gasPrice': web3.eth.gas_price,
        'nonce': nonce})

        print(f"7 transaction result  : {transaction}")

        signed_txn = web3.eth.account.sign_transaction(transaction, private_key) # 보내기 위한 최종서명
        final = web3.eth.sendRawTransaction(signed_txn.rawTransaction) # 해쉬값 추출

        print("8 final result  :", web3.toHex(final)) # 이거들고 이더스캔에서 조회 가능
        userinfo.date_joined = userinfo.date_joined.strftime('%Y-%m-%d-%H:%M:%S')
        userinfo.last_login = userinfo.last_login.strftime('%Y-%m-%d-%H:%M:%S')
        userinfo = model_to_dict(userinfo)
        context = {'value' : '1', 'hash':str(final) }
        return HttpResponse(json.dumps(context))

# 이더스캔에서 토큰리스트 받아와서 저장
@csrf_exempt
def Pandolist(request):
    try:
        # data = json.loads(request.body.decode('utf-8'))
        # userID = data['userID']
        userinfo = SignUp.objects.get(id = 1)
        addr = userinfo.EthPandoWallet
        # addr = "0x4617f23881b99201336A98E398299dBd406bEEb2" # 유저 계좌
        contract = "0x34bfb68cca8d174192f0e1a63ba3fdf50741ac4e" # 토큰에 대한 컨트랙트
        url="https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress="+contract+"&address="+ addr + "&page=1&offset=100&startblock=0&endblock=latest&sort=asc&apikey="
        headers = CaseInsensitiveDict()
        headers["accept"] = "application/json"
        resp = requests.get(url, headers=headers)
        userTxResult = resp.json()
        for i in userTxResult["result"]:
            Hash =  i["hash"]
            print('왜안됨')
            HashCount = PandoToken.objects.filter(TxnHash = Hash).count()
            print('왜안됨')
            
            if HashCount == 0 :
                if i['to'].lower() == userinfo.EthPandoWallet.lower() and i['from'].lower != "0xA80C83DE7AFa42792b98bB7A4Bb11368ff878953": # 모계좌 입니다.
                    useraddr = userinfo.PandoValue
                    print("얼마누",useraddr)
                    useraddr = float(useraddr) + float(i["value"])/1000000000000000000
                    userinfo.PandoValue = str(useraddr)
                    print("지금은 얼마누",userinfo.PandoValue)
                    userinfo.save()
                    Pandoethscan1 = PandoToken(
                        userPK = None, # 나중에는 userID 넣어주야해
                        userAddr = addr,
                        TxnHash = i["hash"],
                        Method = None,
                        DateTimeUTC = i["timeStamp"],
                        From = i["from"],
                        To = i["to"],
                        Quantity = str(float(i["value"])/1000000000000000000),
                        krw = None,
                        Temporary1 = None,
                        Temporary2 = None,
                        Temporary3 = None,
                        Temporary4 = None,
                        Temporary5 = None
                    )
                    Pandoethscan1.save()
                    print("왜실패임")
            else:
                print("나도이제몰라 ~")
        userinfo.date_joined = userinfo.date_joined.strftime('%Y-%m-%d-%H:%M:%S')
        userinfo.last_login = userinfo.last_login.strftime('%Y-%m-%d-%H:%M:%S')
        userinfo = model_to_dict(userinfo)
        context = {'value':'1', 'userinfo': userinfo}
        return HttpResponse(json.dumps(context))

    except Exception as error:
            print("실패")
            context = {'value':'-99'}
            return HttpResponse(json.dumps(context))
        


# TX리스트 보여줌
@csrf_exempt
def PandowalletHistory(request): 
    try:
        # data = json.loads(request.body.decode('utf-8'))
        # print('react에서 받은 data: ', data)
        # userID = data['userID']
        userinfo = PandoToken.objects.get(id = 1)
        dbdata = PandoToken.objects.filter(userPK = 1).order_by('-DateTimeUTC')
        dbdata = serializers.serialize('json', dbdata)
        # print("dbdata >>", dbdata)
        userinfo.date_joined = userinfo.date_joined.strftime('%Y-%m-%d-%H:%M:%S')
        userinfo.last_login = userinfo.last_login.strftime('%Y-%m-%d-%H:%M:%S')
        userinfo = model_to_dict(userinfo)
        context = {'value' : '1', 'dbdata': dbdata}
        print("!23")
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('error')
        context = {'value' : '-99'}
        return HttpResponse(json.dumps(context))

# 테스트
@csrf_exempt
def UpdateKrwpando():
    try:
        # userID = '3'
        userinfo = PandoToken.objects.filter(userPK = '1')

        for row in userinfo:
            Quantity = row.Quantity
            Quantity = int(Quantity)
            krw = Quantity * 130
            row.krw = krw
            row.save()
        userinfo.save()
        
        userinfo.date_joined = userinfo.date_joined.strftime('%Y-%m-%d-%H:%M:%S')
        userinfo.last_login = userinfo.last_login.strftime('%Y-%m-%d-%H:%M:%S')
        userinfo = model_to_dict(userinfo)
        context = {'value' : '1'}
        return HttpResponse(json.dumps(context))
    
    except Exception as error:
        print('error')
        context = {'value' : '-99'}
        return HttpResponse(json.dumps(context))


