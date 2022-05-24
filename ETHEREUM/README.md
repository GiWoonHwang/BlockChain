geth 설치 

1. go 설치
sudo apt-get -y install golang
go version ( 버전 확인)

2. 이더리움 클라이언트 설치
sudo apt-get -y install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update

3. 이더리움 설치
﻿sudo apt-get -y install ethereum
﻿geth version (설치 확인) 

4. 블록 다운로드
geth(이렇게 실행하면 이더리움 메인넷 풀 노드가 다운로드된다 주의할것)
geth --rinkeby(원하는 테스트체인) --syncmode "light"(노드 모드 설정)

5. geth 콘솔 접속
geth attach /mnt/wallet/rinkeby/geth.ipc(geth.ipc가 존재하는 경로 입력)


web3.py 설치

1. pip install web3

2. 모듈을 import해서 사용 (from web3 import Web3)
