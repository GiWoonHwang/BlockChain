from re import M
from web3 import Web3, IPCProvider
from django.shortcuts import render, redirect
from django.template import loader
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, authenticate, logout
from django.http import HttpResponse,HttpResponseRedirect, JsonResponse
from datetime import datetime, timedelta, date
from django.forms.models import model_to_dict
from django.core import serializers
from .models import *
from .forms import *
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.core import serializers
from django.contrib.auth.hashers import make_password, check_password
import hmac, base64, struct, hashlib, time, requests
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
import json




# 집금 : 모계좌 전송 코드
@csrf_exempt
def harvestEthToMain(request):
    try:
        print("web3 - 연결여부 :", web3.isConnected())
        # userID = request.POST.get('userID')
        # userinfo = SignUp.objects.get(userPK= '1')
        userinfo = SignUptest.objects.get(id= '1')
        print("------------------------------모계좌 입금--------------------------------")
        # Maddr = "0xe93C7E9f22C3480fd27AaA37156062023A31D97a"
        Maddr = "0x05dB9490F94ccff2810f9A54946f3CDA42118fd8"
        Uaddr = userinfo.ethAddr
        MaddrCheckSumAddr =  web3.toChecksumAddress(Maddr)
        UaddrCheckSumAddr =  web3.toChecksumAddress(Uaddr)
        queryUaddr = web3.eth.getBalance(UaddrCheckSumAddr)
        wei2EthUaddr = queryUaddr / 1000000000000000000
        if wei2EthUaddr >= 0.05:
            print('보내는 계좌: ', UaddrCheckSumAddr)
            print('모 계좌:   ', MaddrCheckSumAddr)
            print('보내는 계좌 잔액: ', wei2EthUaddr, "ETH")
            realValueOfUaddr = queryUaddr - 2000000000000000
            getPrice = web3.eth.gasPrice
            totalGas = int(getPrice * 21000)
            sendTx = web3.geth.personal.sendTransaction({
                "from": UaddrCheckSumAddr,
                "gasPrice": getPrice,
                "gas": "21000",
                "to": MaddrCheckSumAddr,
                "value": realValueOfUaddr,
                "data": ""
            }, 'asd123!')
            print(sendTx)
            time.sleep(20)
            print('보내는 계좌: ', UaddrCheckSumAddr)
            print('모 계좌:   ', MaddrCheckSumAddr)
            # userinfo2 = UserEthWallet.objects.get(userPK= '2')
            # plusDB = MaddrCheckSumAddr
            # userinfo2.Balance = plusDB
        else:
            print("유저가 집금되기 부족한 잔액을 가지고 있습니다.")
        context = {'value' : '1'}
        return HttpResponse(json.dump(context))
    except Exception as error:
        print('error')
        context = {'value' : '-99'}
        return HttpResponse(json.dumps(context))
    
# 집금 : 계정 간 거래
@csrf_exempt
def ethWithdraw(request):
    try:
        userPK = request.POST.get('userPk') # 유저마다 정해지는 고유의 값, 보내는 사람의 pk값이 할당됨
        userAddr = request.POST.get('userAddr') # 보내는 사람 주소
        toAddr = request.POST.get('toAddr') # 유저가 입력한 주소
        volume = request.POST.get('volume') # 수수료를 적용해서 받는사람이 실제 받는 값
        ExethValue = request.POST.get('ExethValue') # 유저가 ui에 보낸다고 입력한 값
        userinfo = SignUptest.objects.filter(ethAddr = toAddr).count()
        if userinfo == 1:  # 내부계좌전송
            userTo = SignUptest.object.get(ethAddr = toAddr) # 만약 유저가 송금할 계좌가 앱에서 만든 계좌면
            ToethVal = float(userTo.ethValue) # 일단 DB에 있는 송금계좌 잔액 가져와
            ToethVal1 = float(volume) + ToethVal # 그리고 db에 유저가 보내겠다고 한 금액을 더해줘
            print('받는사람 계좌 DB에 찍혀야 하는 금액',ToethVal1 )
            userTo.ethValue = str(ToethVal1) # 받는사람 DB 이더 잔액에 들어가야 할 금액 = 기존금액 + 유저가 인터페이스에 보내겠다고 한 금액

            user = SignUptest.objects.get(id = userPK) # 보낸다고 한 사람의 고유 pk값
            SendUserEthbal = float(user.ethValue)  # 보내는 유저의 기존 가지고 있던 잔액
            SendUserEthbal1 = SendUserEthbal - float(ExethValue) # 그러면 보내는 유저 DB에서는 기존에 있던 값에서 보낸다고한 값을 빼줘야 한다
            user.ethValue = str(SendUserEthbal1) # 결국 보내는 사람의 잔액 =  기존 db에 있는 잔액 - ui에 보내겠다고한 잔액이 
            user.save()
            userTo.save()
            now = datetime.now()
            now = now.strftime('%Y-%m-%d %H:%M:%S')
            userethwallSave = EthScan(
                userPK = userPK,
                userAddr = userAddr,
                # submitDate = datetime.now(),
                #status = None,
                blockHash = None,
                blockNumber = None,
                confirmations = None,
                contractAddress = None,
                cumulativeGasUsed = None,
                fromAddr = userAddr,
                gas = None,
                gasPrice = None,
                gasUsed = 21000,
                hash = None,
                input = None,
                isError = None,
                nonce = None,
                timeStamp = now,
                to = toAddr,
                transactionIndex = None,
                txreceipt_status = None,
                volume = volume,
            )
            userethwallSave.save()
        elif userinfo == 0:
            print("------------------------------출금--------------------------------")
            Maddr = '모계좌 주소'
            Uaddr = toAddr # 유저가 입력한 외부계좌
            MaddrCheckSumAddr = web3.toChecksumAddress(Maddr)
            UaddrCheckSumAddr = web3.toChecksumAddress(Uaddr)
            moAddr = web3.eth.getBalance(MaddrCheckSumAddr) # 모계좌의 잔액 조쇠
            getPrice = web3.eth.gasPrice;
            addrEth = float(ExethValue) * 1000000000000000000 # ExethValue는 유저가 보낸다고한 금액 wei이기 때문에 ethr로 바꿔줘야한다
            addrEth = int(addrEth) 
            addrEth = int(addrEth - 2000000000000000) # 이게 아마 변동되는 시가의 평균을 고려해서 반영한 wei
            totalGas = int(getPrice * 21000) # 요건 왜 곱하더라 ? 가스비에 21000을 곱했다
            sendTx = web3.geth.personal.sendTransaction({
                "from": MaddrCheckSumAddr,
                "gasPrice": getPrice,
                "gas": "21000",
                "to": UaddrCheckSumAddr,
                "value": addrEth,
                "data": ""
            }, 'asd123!')
            print('모 계좌:     ', Maddr)
            print('받는 계좌:   ', Uaddr)
            print('       |------------------(영수증)-------------------|')
            print('             모 계좌 잔액:     ', web3.fromWei(moAddr, 'ether'))
            print('             보내는 금액:      ', web3.fromWei(addrEth, 'ether'))
            print('                    ++++++++++++++++++++++')
            print('             가스비:           ', web3.fromWei(totalGas, 'ether'))
            print('       |---------------------------------------------|')

            user = SignUptest.objects.get(id = userPK) # 보낸다고 한 사람 (from계좌의 고유 id값 불러옴)
            SendUserEthbal = float(user.ethValue) # 보낸다고 한 유저의 DB에 찍혀있는 잔액
            SendUserEthbal1 = SendUserEthbal - float(ExethValue) # 보낸다고 한 사람 db = 기존 찍혀있는 잔액 - 보내겠다고 입력한 값
            user.ethValue = SendUserEthbal # 거래 후 보내는사람 db에 찍혀있어야 하는 최종 금액
            user.save()
            now = datetime.now()
            now = now.strftime('%Y-%m-%d %H:%M:%S')
            userethwallSave = EthScan(
                userPK = userPK,
                userAddr = userAddr,
                # submitDate = datetime.now(),
                #status = None,
                blockHash = None,
                blockNumber = None,
                confirmations = None,
                contractAddress = None,
                cumulativeGasUsed = None,
                fromAddr = userAddr,
                gas = None,
                gasPrice = None,
                gasUsed = 21000,
                hash = None,
                input = None,
                isError = None,
                nonce = None,
                timeStamp = now,
                to = toAddr,
                transactionIndex = None,
                txreceipt_status = None,
                volume = volume,
            )
            userethwallSave.save()
            print("-----------------------------------------------------------------")
        context = {'value':'1'}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print(error)
        context = {'value':'-99'}
        return HttpResponse(json.dumps(context))