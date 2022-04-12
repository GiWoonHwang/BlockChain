스마트 컨트랙트로 해결해야 하는 문제 설정에서부터 코드의 배포에 이르기 까지 원칙이 있다.
시작에 앞서 탈 중앙화 카운터를 알아보자. 카운터는 일상 애플리케이션에서 공통으로 사용된다. 카운터의 예를 몇가지 살펴보면
회전식 개찰구는 놀이공원에 출입하는 사람들의 숫자를 세는 것으로 시스템 타입은 수동
주식 시장 인덱스는 중앙화 시스템에서의 주식의 매출 실적에 따라 오르고 내리는 것으로 시스템 타입은 중앙화 시스템
국가 무역 지표는 다양한 무역 영역을 나타내는 분산된 주체들의 리포트에 기반하여 변동성을 나타냄으로 시스템 타입은 분산 시스템
마지막으로 우리가 살고있는 세계는 태생적으로 탈중앙화 시스템의 좋은 예인데, 총 인구는 전 세계 각 지역에서의 출생과 사망 숫자에 의해 결정 되기 때문에, 시스템 타입은 탈중앙화 시스템이라고 볼 수 있다.

카운터는 단순하지만 스마트 컨트랙트 개발의 다양한 유스케이스를 보여줄 수 있는 좋은 예제이다. 스마트 컨트렉트 설계전 몇가지의 설계원칙이 존재한다.

1. 테스트 체인에서 스마트 컨트랙트를 코딩, 배포, 개발하기 전에 우선 설계부터 진행하여야 하다. 또한 프로덕션 블록체인에 배포하기 전에 철저한 테스트를 거쳐야 한다.
   왜냐하면 스마트 컨트랙트는 변조 불가능하기 때문이다.
2. 시스템 사용자와 유스 케이스를 정의한다. 사용자란 행위와 입력값을 발생시키고, 설계하고 있는 해당 시스템으로부터 그 출력값을 받는 주체다.
3. 데이터 애셋, 피어 참여자, 그들의 역할, 강제할 규칙, 설계하고 있는 시스템에 기록해야 할 트랜잭션을 정의한다.
4. 컨트랙트 이름, 데이터 애샛, 함수, 함수 실행과 데이터 접근을 위한 규칙을 정의하는 컨트랙트 다이어그램을 작성한다.

코드 정의
첫 번째 라인은 코드를 작성하는데 사용한 언어의 버전을 지정한다.
다음으로 데이터 컴포넌트를 정의한다. uint 데이터 타입을 카운터값을 저장하는 식별자를 정의하기 위해 사용하였다. 솔리디티에서는 256비트 값이다
함수는 function 키워드와 함수명에 의해 정의된다.
모든 함수는 public으로 선언되어 있는데 블록체인상에 있는 어떠한 외부의 참여자도 이 함수를 호출할 수 있다는 것을 의미한다.
함수 정의는 return 문을 포함할 수 있는데, 이를 이용해 함수 호출의 결과로 반환될 값을 명시적으로 정의할 수 있다.
이 코드는 get() 함수가 반환값을 가지고 있고, 나머지 함수는 파라미터 값을 받아 변수 value를 갱신하는 역할을 한다.
이들 함수의 호출은 자동적으로 각각 분산 장부상의 트랜잭션으로 기록된다
( get 함수는 view 함수임을 주목하자. 이 함수를 호출하는 것은 블록체인상에 기록되지 않는데, 그 이유는 카운터값 상태를 변화시키지 않기 때문이다)



![image](https://user-images.githubusercontent.com/85157729/162619668-5788ff18-af30-42d1-bdd4-73ae3dbfd36f.png)