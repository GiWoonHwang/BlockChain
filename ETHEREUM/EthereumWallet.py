import secrets, codecs, os # secrets : 비밀번호를 위한 난수 생성, codecs는 원시코드를 읽기 위함(난수값이나 해쉬값인듯), os : 파이썬이 cmd의 명령어를 이해하고 이를 cmd에 전달할 수 있도록 하는 함수
try:
    import ecdsa # 타원곡선 알고리즘 모듈 RSA알고리즘보다 작은용량, 더 빠른수행능력.  키생성, 인증생성, 확인 방식 제공
    from Crypto.Hash import keccak # 해시함수를 사용하기 위한 모듈  Keccak은 SHA-3
except:
    print("ecdsa, pycryptodome 패키지를 설치해주세요.")
    exit(0)

def gen_private():
    # random hex less than SECP256k1 order
    curve_order = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 # 공개키를 생성하기 위해서는 오리지널 개인키를 기반으로 ECC() 알고리즘을 사용하여 생성합니다.
                                                                                     # 이더리움에서는 sept256k1 알고리즘을 사용하고 있으며 선언된 변수는 _r값이다. 근데 왜 선언하는지는 모르겠음
    while True:
        private_key = secrets.token_hex(32) #32진수의 무작위 문자열을 반환
        if int(private_key, 16) < curve_order:
            return private_key

def gen_public(private_key):
    # apply SECP256k1
    private_key_ = codecs.decode(private_key, "hex") # 난수생성기로 발생된 개인키를 헥사값으로 디코딩 한 후
    public_key_ = (ecdsa.SigningKey.from_string(private_key_, curve=ecdsa.SECP256k1) # 헥사값으로 디코딩 된 개인키에 타원곡선 알고리즘을 적용한다.
                                        .get_verifying_key().to_string())
    public_key = codecs.encode(public_key_, "hex").decode("utf-8") # 256bit의 숫자 두개로 구성된 공개키 생성 utf-8로 디코딩을 해주면 ''가 없어짐
    return public_key

def gen_address(public_key):
    # apply keccak256
    k = keccak.new(digest_bits=256)
    k.update(codecs.decode(public_key, "hex")) # 공개키가 들어있는 변수 k를 디코딩 한 후
    k_hash = k.hexdigest() # 해시처리 하고 싶은 정보를 hexdigest를 사용하여 프린트한다.
    address = "0x" + k_hash[-40:] # last 20bytes
    return address

def clear_console():
    if os.name == "nt": # os 운영체제가 윈도우라면
        os.system("cls") # cls를 누르면 화면이 지워진다
    else:
        os.system("clear")

if __name__ == "__main__": 
   
    while True:
        clear_console()
        print("\n [이더리움 생성기]")
        print("\n Enter를 누르면 지갑이 생성.")
      
    
        private_key = gen_private()
        public_key = gen_public(private_key)
        address = gen_address(public_key)

        print(" Address     =", address)
        print(" Private Key =", private_key)
        print(" Public Key  =", public_key)
        input("\n ")
        
# 개인키는 랜덤 혹은 단어 목록이나 문장을 이용하여 256bit의 숫자를 만들어 사용한다
# 공개키는 개인키를 이용해서 타원곡선 암호 방식으로 생성한다. 공개키는 타원 곡선 상의 한 점이므로 2차원 좌표(x,y)로 구성된다. 256bit의 숫자 두개로 구성된다 Q(공개키) = X(개인키) * G(타원곡선상 임의의 점)
# 공개키 해시는 공개키의 해시 값을 계산해 160bit로 변환한다.
# 지갑 주소는 공개키 해시 값을 Base58Check 인코딩하여 생성한다

# 개인키 -> 공개키 -> 공개키 해시 <=> 지갑주소
