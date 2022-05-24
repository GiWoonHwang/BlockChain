from web3 import Web3

#이더
#IPCProvider:
web3 = Web3(Web3.IPCProvider('/mnt/wallet/rinkeby/geth.ipc'))
# a = web3.isConnected()
# print(a)

print("web3 - 연결여부 : ", web3.isConnected())

addr = web3.geth.personal.newAccount('asd123!') #계좌 생성
print('addr: ', addr) #생성된 계좌 정보
print("연결된 계좌 목록: ", web3.geth.personal.list_wallets()) #위에 코드로 생성된 지갑 리스트 조회 (keystore : UTC files)

# 1. 처음 생성한 지갑 정보 할당

fromAddr = 0x35a760709e12a13bb1575d2bD82253eE5Db53192 

# 2. 할당된 지갑 유효한지 체크
fromAddrChecksum = web3.toChecksumAddress(fromAddr)
balanceOfFromAddr = web3.eth.getBalance(fromAddrChecksum)
weiToEth = web3.fromWei(balanceOfFromAddr, 'ether')
print("유저 지갑의 잔액 조회: ", weiToEth , "ETH")

# 3. 두 번째 계좌 할당
toAddr = 0xBa8baDc428363a0136Ac15Bb0ee7f0b944901190

# 4. 두 번째 계좌 CheckSum
toAddrChecksum = web3.toChecksumAddress(toAddr)
balnceOftoAddr = web3.eth.getBalance(toAddrChecksum)
weiToEth1 = web3.fromWei(balnceOftoAddr, 'ether')
print("모 계좌 지갑의 잔액은 : ", weiToEth1, "ETH")

# 5. sendTransaction 할 때 넣을 정보 만들기

# 5.1 gas fee 얻어내기
getGasPrice = web3.eth.gasPrice

# 5.2 nonce 값도 얻어내기 
nonce = web3.eth.getTransactionCount(fromAddrChecksum)


# 5.3 보낼 잔액을 정하기
value = web3.toWei(0.1, "ether")

# 6. transaction code

sendTx = web3.geth.personal.sendTransaction({
    "nonce": nonce,
    "from": fromAddrChecksum,
    "gasPrice": getGasPrice,
    "to": toAddrChecksum,
    "value": value,
    "data": ""
}, 'asd123!')

# 7. fromAddrChecksum unlock 
unLock = web3.geth.personal.unlockAccount(fromAddrChecksum, "asd123!", 10)
print(unLock)

# 8. fromAddrChecksum lock 
lock = web3.geth.personal.lockAccount(fromAddrChecksum)
print(lock)

# 9. tx전송까지 잠시 대기
time.sleep(30)

# 10. 전송 완료 후 from,to 계좌 잔액 조회

afterBalFrom = web3.eth.getBalance(fromAddrChecksum)
afterBalTo = web3.eth.getBalance(toAddrChecksum)

print("from계좌 잔액 : ", web3.fromWei(afterBalFrom, 'ether'), "ETH")
print("from계좌 잔액 : ", web3.fromWei(afterBalTo, 'ether'), "ETH")