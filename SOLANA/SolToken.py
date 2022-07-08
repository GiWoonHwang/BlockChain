# 6. 토큰어카운트 조회 -> 잔액 조회 수동 코드
# getbalance라고 생각하면 이해하기 쉽다
@csrf_exempt
def getBalanceToken(request):
    try:
        test = client.is_connected()
        print("1. 솔라나 연결여부:" ,test) # 기본적안 연결 확인
        
        
        # userID = request.POST.get('userID')
        # print("2. 현재 유저의 id: ",userID)
        
        # userinfo = SignUp.objects.get(id = userID)
        # print("3. 현재 유저의 정보 :",userinfo)
        # 유저의토큰어카운트 = userinfo.유저의 토큰어카운트주소
        
        userTokenAcc = "9nLtXAAG6DGUBmnETGSfWpq9iWfDQ21c7X8tXVjYP584" # db로부터 가져온 유저의 토큰 account
        print("2. 현재 유저의 토큰어카운트 :",userTokenAcc)
        
        
        result = client.get_token_account_balance(userTokenAcc)  # 토큰 잔액 조회
        
        ui_tokenVal = result['result']['value']['uiAmount']  # 실제 토큰 수량 추출
        print("3. 현재 유저의 토큰 잔액은? : ", ui_tokenVal)
        
        context = {'value' : '1','ui_tokenVal' : 'ui_tokenVal'}
        return HttpResponse(json.dumps(context))
    
    except Exception as error:
        print('실패')
        context = {'valule':'-99'}
        return HttpResponse(json.dumps(context))
    

# 7. 토큰 전송 -> 수동 코드
@csrf_exempt
def tokenTransfer(request):
    try:
        from spl.token.constants import TOKEN_PROGRAM_ID
        from spl.token.instructions import transfer_checked, TransferCheckedParams
        test = client.is_connected()
        print("1. 솔라나 연결여부:" ,test)
        
        
        tokenAccOwner = "Fjnn1URmdWwrCqeWVWZKsSYiJCKBj8ZVdKsPLMcDaxv3" # 토큰소유자의 지갑 공개키이다. 
        mintPubkey = "JS3FiJxtv5CYURf7oC9eMPzq21uz1PpsvW9MFfzZDsi" # mint 고정값 최초 토큰발행자로부터 얻어오는 값 (mint address)
        fromAddr = "9nLtXAAG6DGUBmnETGSfWpq9iWfDQ21c7X8tXVjYP584" # 보내는 사람의 토큰 account
        fromAddrPriv = "237Vv8DrGKK8GqyBmSMdhuBtqFi4nUgGMYjYad5NYQiAE5rPYkqVzqDYPcu26Ts9NdJ6SYHWSD52BcukQMZBoKAf" # 보내는 사람의 비밀키이다 나중에 이걸 변환해서 서명함
        fromAddrKeypair = b58decode(fromAddrPriv) # 개인키를 변환하는 과정 1
        
        toAddr = "9ugbQD7cFc2TnrXmXcyPEbnMaUFCtgLqjEzb3PFK7pem" # 받는사람의 token account
        print("2. b58decode privkey: ", fromAddrKeypair)
        
        signer = Keypair.from_secret_key(fromAddrKeypair) # 개인키를 변환하여 서명한다.
        print("3. signkey: ", signer)
        
        amount = float(100)  # 100토큰
        print("4. amount: ", amount)
        
        transfer_amount = int(amount*(10**9)) # 4. amount = 유저가 token 출금페이지에서 입력한 금액: 토큰은 sol단위이다. 따라서 -> lamports 단위로 변경필요 -> amount 값
        print("5. transfer_amount: ", transfer_amount)
        
        # transaction 시작
        transaction = Transaction()
        transaction.add(transfer_checked(
            TransferCheckedParams(
                amount=transfer_amount,  # 램포트 단위로 변경한 토큰의 갯수
                decimals=9, # 소수점 
                dest=PublicKey(toAddr), # 받는 사람의 토큰어카운트 주소
                mint=PublicKey(mintPubkey), #  고유한 mint address
                owner=PublicKey(tokenAccOwner), # 보내는 사람(토큰소유자)의 지갑 공개키
                program_id=TOKEN_PROGRAM_ID, # 솔라나 시스템 고유값
                source=PublicKey(fromAddr), # 보내는 사람의 토큰 account를 넣어준다.
                )))
        print("6. transaction: ", transaction)
        
        transaction_result = client.send_transaction(transaction, signer)
        print("7. transaction_result: ", transaction_result)
        
        resultOfTxHash = transaction_result['result'] # 이 값을 링크에 넣으면 바로 솔스캔에서 조회 가능
        print("8. resultOfTxHash: ", resultOfTxHash)
        print(f"성공한 txHash = https://solscan.io/tx/{resultOfTxHash}?cluster=devnet")
        context = {'value' : '1'}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('실패')
        context = {'valule':'-99'}
        return HttpResponse(json.dumps(context))

# solscan.io (https://solscan.io/tx/%7BresultOfTxHash%7D?cluster=devnet)
# Solana transaction details | Solscan
# Solana detailed transaction info for signature {resultOfTxHash}

# 8. 토큰어카운트 생성 -> initialize 전 단계   ==> 9번 과정에서 전부 해결 해주기 때문에 생략한다.
# @csrf_exempt
# def createTokenAccount(request):
#     try:
#         import solana.system_program as sp
#         from spl.token.constants import TOKEN_PROGRAM_ID
#         test = client.is_connected()
#         print("1. 솔라나 연결여부:" ,test)
#         # userID = request.POST.get('userID')
#         # print("2. 현재 유저의 id: ",userID)
#         # userinfo = SignUp.objects.get(id = userID)
#         # print("3. 현재 유저의 정보 :",userinfo)
#         # 유저의토큰어카운트 = userinfo.유저의 토큰어카운트주소
#         feePayerAddr = "4NwS4ezQ3tU4sX26KUmwzKxQwpgwBFMuGYp6U5TBPvc3" 
#         feePayerPriv = "621yVKGcYBMudqUT9AkHpAohXjunWAWMtXz1NyCjK4wa5NCW886kD5z9AL8wRyjxpqB7LwYPMEaw8444da3roMRu" # DB에 있는 유저별 privKey 
#         feePayerKeypair = b58decode(feePayerPriv)
#         feePayer = Keypair.from_secret_key(feePayerKeypair)
#         print("1. feePayer: ", feePayer)
#         # 새로 생성한 account
#         account = Account()
#         secretKey = account.secret_key()
#         bytesaccount = bytes(account.public_key())
#         address_public = b58encode(bytesaccount).decode()
#         make_privateKey = secretKey + bytesaccount
#         realprivate_key = b58encode(make_privateKey).decode()
#         print(realprivate_key)
#         newAccountKeypair = b58decode(realprivate_key)
#         feePayer2 = Keypair.from_secret_key(newAccountKeypair)
#         print("2. feePayer2: ", feePayer2)
#         # 최소 rent fee 계산
#         fee = client.get_minimum_balance_for_rent_exemption(165)["result"]
#         print("3. 생성한 token account에 rent fee: ", fee)
#         # 트랜잭션 진행
#         params = sp.CreateAccountParams(
#             from_pubkey=PublicKey(feePayerAddr),
#             new_account_pubkey=PublicKey(address_public),
#             lamports=fee,
#             space=165,
#             program_id=TOKEN_PROGRAM_ID
#         )
#         print("4. params 값 : ", params)
#         transaction = Transaction()
#         transaction.add(
#             sp.create_account(params)
#         )
#         print("4. transaction 값 : ", transaction)
#         result = client.send_transaction(transaction, feePayer, feePayer2)
#         resultOfTxn = result['result']
#         print(f"5.txHash = https://solscan.io/tx/{resultOfTxn}?cluster=devnet")
#         context = {'value' : '1'}
#         return HttpResponse(json.dumps(context))
#     except Exception as error:
#         print('실패')
#         context = {'valule':'-99'}
#         return HttpResponse(json.dumps(context))


# 9. 토큰어카운트 생성 -> initialize 까지 해서 mint address, owner 변경가능   
@csrf_exempt
def createAssociateTokenAcc(request):
    try:
        import spl.token.instructions as spl_token
        test = client.is_connected()
        print("1. 솔라나 연결여부:" ,test)
        
        # userID = request.POST.get('userID')
        # print("2. 현재 유저의 id: ",userID)
        # userinfo = SignUp.objects.get(id = userID)
        # print("3. 현재 유저의 정보 :",userinfo)
        # 유저의토큰어카운트 = userinfo.유저의 토큰어카운트주소
        
        feePayerWalletAddr = "4NwS4ezQ3tU4sX26KUmwzKxQwpgwBFMuGYp6U5TBPvc3" # feePayer : mint address의 주인, 가스비랑 랜트비 등등을 지불할 계좌 주소
        feePayerPriv = "621yVKGcYBMudqUT9AkHpAohXjunWAWMtXz1NyCjK4wa5NCW886kD5z9AL8wRyjxpqB7LwYPMEaw8444da3roMRu" # feePayer : mint address 주인의 privkey, , 가스비랑 랜트비 등등을 지불할 계좌 주소의 비밀키
        feePayerKeypair = b58decode(feePayerPriv) 
        feePayer = Keypair.from_secret_key(feePayerKeypair)
        
        # 새로 생성한 account
        owner1 = 'AsDHpXLGxHeHNWxpqEZHoMC2LpWjJznfWrm8nTz9FvDn' # userinfo.userPubKey  # 토큰받을사람의 지갑주소
        ownerPub = PublicKey(owner1) # Publickey로 감싸주는 토큰시스템의 타입선언
        mint1 = 'JS3FiJxtv5CYURf7oC9eMPzq21uz1PpsvW9MFfzZDsi' # 고정값 mintaddr이다. 고정값임
        mintPub = PublicKey(mint1)
        
        # transaction 시작
        transaction = Transaction()
        create_txn = spl_token.create_associated_token_account(
            payer=feePayerWalletAddr, owner=ownerPub, mint=mintPub
        )
        transaction.add(create_txn)
        print("4. transaction 값 : ", transaction)
        
        result = client.send_transaction(transaction, feePayer)
        resultOfTxn = result['result']
        print(f"5.txHash = https://solscan.io/tx/{resultOfTxn}?cluster=devnet")
        context = {'value' : '1'}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('실패')
        context = {'valule':'-99'}
        return HttpResponse(json.dumps(context))