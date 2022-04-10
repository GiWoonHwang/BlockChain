pragma solidity ^0.6.0; // 버전 번호를 지정한다

contract Counter {
    uint value; // 카운터 값을 위한 공유 데이터
    function initialize (uint x) public { // unit는 데이터 타입을 지정하는것 블록체인은 256비트 값이다.
        value = x;                        // public 이란 블록체인상에 있는 어떠한 외부의 참여자도 이 함수를 호출할 수 있다는것을 의미
    }


    function get() view public returns (uint) { //get 함수는 반환값을 가지고 있다
        return value;
    }

    function increment (uint n) public {
        value = value + n;
        // return ( optional)
    }


    function decrement (uint n) public {
        value = value - n;
    }

    }
