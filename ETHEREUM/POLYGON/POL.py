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

# 1.연결여부 확인
from web3 import Web3, IPCProvider, HTTPProvider

## https://matic-mumbai.chainstacklabs.com
web3 = Web3(HTTPProvider("https://matic-mumbai.chainstacklabs.com"))

isConnected = web3.isConnected()
print("1. 폴리곤 연결여부:", isConnected)

# 2. 지갑만들기
from web3 import Web3, IPCProvider, HTTPProvider
from base64 import b64encode, b64decode
from eth_account import Account
import secrets

web3 = Web3(HTTPProvider("https://matic-mumbai.chainstacklabs.com"))

isConnected = web3.isConnected()

print("1. 폴리곤 연결여부:", isConnected)

priv = secrets.token_hex(32)
private_key = "0x" + priv
print ("2. 생성된 비밀키 남에게 보여주지 말 것 :", private_key)
acct = Account.from_key(private_key)
print("3. 생성된 공개키 지갑주소:", acct.address)

# 3. 계정 전송
from web3 import Web3, IPCProvider, HTTPProvider

# ()
# web3 = Web3(IPCProvider("/home/bstudent/geth_project/rinkeby/geth.ipc"))

## https://matic-mumbai.chainstacklabs.com
web3 = Web3(HTTPProvider("https://matic-mumbai.chainstacklabs.com"))

isConnected = web3.isConnected()
print("1. 폴리곤 연결여부:", isConnected)

Addr = "0xA80C83DE7AFa42792b98bB7A4Bb11368ff878953"
privKey = "0xe25b3533bc0b97759aeeb7a45ce8dc4eb502e1bbc57eb3421e649287a956eb9a" # privkey
AddrChecksum = web3.toChecksumAddress(Addr)
print("2. checkSum - 확인여부 :", AddrChecksum)
print("2.1 privKey - 확인여부 :", privKey)

getGasPrice = web3.eth.gasPrice
print("3. 가스비 - 확인여부 :", getGasPrice)

balanceOfAddr = web3.eth.getBalance(Addr)
print("4. 잔액 - 확인여부 :", balanceOfAddr)

nonce = web3.eth.getTransactionCount(AddrChecksum)
print("4. 논스 - 확인여부 :", nonce)

value = web3.toWei(0.1, 'ether')
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