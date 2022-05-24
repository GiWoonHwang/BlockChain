import solana
from solana.rpc.api import Client
from solana.account import Account
from base58 import b58encode, b58decode
from solana.keypair import Keypair
from solana.publickey import PublicKey
# from private import private_key
from solana.system_program import *
from solana.transaction import Transaction 
# # 솔라나에서 program이란 컨트랙트를 의미한다. program은 system과 일반 프로그램으로 다시 나뉜다. system은 솔라나가 기본적으로 내장되어 있는 프로그램이다. 일반 프로그램은 유저들이 rust언어로 만든 컨트랙트
# # 앵커를 통해 빌드해서 솔라나 네트워크에 올리면 프로그램 id가 할당이 된다.

# # 솔라나
client = Client("https://api.devnet.solana.com")

# test = client.is_connected()
# print(test)


# # 1. 계좌생성
account = Account() # 기본 setting
# print(account)

secretKey = account.secret_key()
# print(secretKey)  # account로 부터  비밀키 생성

bytesaccount = bytes(account.public_key())
# print(bytesaccount)  # 어카운트로 생성된 값에 bytes화 시킴

address_public = b58encode(bytesaccount).decode() # 바이트화 된 account를 인코딩하면 공개키(주소)가 된다
# print(address_public)

make_privateKey = secretKey + bytesaccount # 비밀키를 만드는 과정. 시크릿키와 바이트화된 account를 더한다
# print(make_privateKey)

realprivate_key = b58encode(make_privateKey).decode()  # 뒤에 더한 값을 인코딩하면 비밀키가 만들어진다.
# print(realprivate_key)

# 2. 생성된 계좌 조회
addr = '2eovytuCZKMujb2v27wsLz4DGeYxVQykMtoBv5JjQWmE' # 생성된 공개키 = 주소
fromaddrPriv = '49TU8Pr3PuT2SuTgx6QTXwzcSu7H9cKjkqvrK7uGkCrofb1xQ3gpWGuPWederGXZ8Hc1txinQiSm4bLk1VzEzkA4' # 비밀키
getBalance = client.get_balance(addr) # 지갑 잔금 확인/ 지갑 조회
lamports = getBalance['result']['value'] # 딕셔너리로 되어 있는 값 중 잔액만 뽑아낸다.
transformSol = round(lamports*10**(-9),9) # lanports를 솔라나로 바꾼다. (wei를 eth로 바꾸는 것과 동일함)
# print(transformSol)

# 3. 생성된 계좌로 외부 지갑에 송금 
fromAddr = "2eovytuCZKMujb2v27wsLz4DGeYxVQykMtoBv5JjQWmE"
toAddr = "AsDHpXLGxHeHNWxpqEZHoMC2LpWjJznfWrm8nTz9FvDn"
fromaddpri = "49TU8Pr3PuT2SuTgx6QTXwzcSu7H9cKjkqvrK7uGkCrofb1xQ3gpWGuPWederGXZ8Hc1txinQiSm4bLk1VzEzkA4"
signKey = b58decode(fromaddpri) 
sol_amount = 0.1

transfer_parameters = TransferParams(
    from_pubkey=PublicKey(fromAddr),
    to_pubkey=PublicKey(toAddr),
    lamports=int(sol_amount*(10**9))
)
sol_transfer = transfer(transfer_parameters)
transaction = Transaction().add(sol_transfer)

transaction_result = client.send_transaction(transaction, Keypair.from_secret_key(signKey))

print(transaction_result)

# 4. 계좌 조회

getBalance = client.get_balance("2eovytuCZKMujb2v27wsLz4DGeYxVQykMtoBv5JjQWmE") # 계좌의 잔액 조회
userLamports = getBalance['result']['value'] # 딕셔너리 값이기 때문에 필요한 값만 추출
# print(userLamports)
ui_balance = round(userLamports*10**(-9),9) # lamport 단위기 때문이 Sol 단위로 변경
# print(ui_balance, 'SOL')

