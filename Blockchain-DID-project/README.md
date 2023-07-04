# ArTo [전국안전 화장실] :toilet:

## **개요**
- 공중화장실 출입시 성별에 따른 출입을 제한하는 앱 :restroom:
- 공중화장실 성범죄 예방과 사용률 증진을 위해서 제작되었습니다.

## **목차**

- [주요화면](#1-주요화면)
- [주요기능](#2-주요기능)
- [설계흐름](#3-설계흐름)
- [코드리뷰](#4-코드리뷰)
- [문제해결](#5-문제해결)
- [개선방안](#6-개선방안)
- [사용기술](#7-사용기술)

---
## **1. 주요화면** :iphone:

<img width="150px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133968341-da9116d5-fbc8-4fb0-8ce9-17043f62c054.jpg">
</img>
<img width="150px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/136162861-42197e3a-c934-444b-8054-fac65e2b89a2.jpg">
</img>
<img width="150px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133968327-87b4180c-7266-4dad-aba2-44ba4c26f624.jpg">
</img>
<img width="150px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133968182-867130eb-5f2c-4d69-bb60-39ff24afd0f1.jpg">
</img>
<img width="150px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133969536-79084a37-be46-4032-8ca9-e600dd0e842d.jpg">
</img>
<img width="150px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133968288-eedca8db-4ae6-4e2d-a480-b37ef0a68c35.jpg">
</img>
<img width="150px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133968298-8cb084df-9366-4edf-94f5-63c95a5b83c8.jpg">
</img>
<img width="150px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133968356-5d386fad-cab4-454b-a6bd-6d7baaf3a109.jpg"> 
</img>
<img width="150px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133968347-c87ea1ab-c042-4cd3-aeea-4ebc68339992.jpg">
</img>
<img width="150px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133968221-ff9fee95-2389-495f-8f3d-93cdf8129ee3.jpg">
</img>


## **2. 주요기능** :computer:

- 회원가입 
- 로그인
- 로그인시 핀번호를 설정
- 회원 email과 did값으로 스캔할 QR생성
- 개인 정보수정과 아이디, 비밀번호찾기
- 공공데이터 포털을 이용하여 지도에 화장실 위치 제공
- 지도에서 화장실 이름 클릭시 화장실정보 페이지로 이동
- 이용한 화장실만 리뷰작성
- Server를 AWS에서 올리고 public IP를 사용하기 
- AWS에 올린 Server와 MariaDB 연동하기
- termius에서 PM2로 지속적인 서비스하기

---

## **3. 플로우차트** :surfer:

- 회원가입시 블록체인 서버로 부터 DID발급 과정
<img width="500px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133993552-fddf9c05-4f37-4829-92f5-7c917523da00.PNG">
</img>

- QR생성시 블록체인 서버로 부터 VP발급 과정
<img width="500px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133993557-5d1c9993-5a4b-4e70-8082-f3f181d445ce.PNG">
</img>

- QR스캔시 QR에 데이터인 VP값을 블록체인 서버에서 검증하는 과정
<img width="500px" height="300px" 
src="https://user-images.githubusercontent.com/75786010/133993567-a0297a4d-c988-4998-b258-18fae17424b9.PNG">
</img>

---

## **4. 코드리뷰** :page_facing_up:
- [회원가입-Client](#회원가입-클라이언트)
- [회원가입-Server](#회원가입-서버)
- [로그인-Client](#로그인-클라이언트)
- [로그인-Server](#로그인-서버)
- [핀번호 설정](#핀번호-설정)
- [화장실정보-Upload](#화장실-정보-업로드)
- [지도-Client](#지도-클라이언트)
<br>

### 회원가입 클라이언트

> 휴대폰인증을 통해서 통신사에서 성별값을 가져오려고 했으나 비용발생으로 인해 임의의 값으로 대채<br> 회원 정보를 POST방식으로 Server에 전송

```js
//서버로 회원정보 전달
const Post = async (name, email, gender, phone, password)=> {
    await axios.post(`http://${localhost}/api/signup`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        name: name,
        email: email,
        gender: gender,
        phone : phone,
        password :password
    }).then((res) => {
        //회원가입 성공
        if(res.data.message == true){
            setEmaildb(true)
            navigation.reset({routes: [{name: 'PinNumSignup', value:email}]}) //스택을 초기화하여 드래그해도 다시 로그인페이지로 못오게함
        }
        //회원가입 실패
        else if(res.data.message == false){
            setEmaildb(false)
        }
    })
    .catch((error)=> {
        console.log(error)
        console.log("회원가입 클라이언트 오류")
    })
}
// 입력창에서 가입클릭시
<Formik
    initialValues={{name:'', email:'', phone:''password:''confirmPassword:'' }}
    onSubmit={ (values)=>{ // 가입클릭시
        var arryNumber = Math.floor (( Math.random() * 2 ));
        var gender = arraygGender[arryNumber];
        //결과값 오브젝트를 배열로 변환함
        let result_map = Object.keys(values).map(function (key{ 
            return [String(key), values[key]]; 
        });
        var count =0 //정보입력 갯수
        for(var i=0; i<result_map.length; i++){
            if(result_map[i][1]){
                count= count+1
            }
            if(count==5){
                Signup_3 =true //모든정보 기입완료 
            }
        }
        //비밀번호의 길이와 동일한지 확인
        if(values.password.length>=5 && values.confirmPassworlength>=5){
            if(values.password == values.confirmPassword){
                Signup_2 =true 
            }
        }
        //모든 정보를 입력하지 않으면
        if(count <5){
            getAlert("정보입력","모든 정보를 입력해 주세요.")
        }
        //인증 안하고 가입하기 누르면
        else if(Signup_1 == false){
            getAlert("실명인증","휴대전화로 본인인증부탁 드립니")
        }
        //비밀번호가 틀리면 
        else if(values.password != values.confirmPassword){
            getAlert("비밀번호","비밀번호가 동일하지 않습니다.")
        }
        //비밀번호길이가 5자 이하일 경우 
        else if(values.password.length<5 || valueconfirmPassword.length<5){
            getAlert("비밀번호","비밀번호 길이가 5자 이상인확인해주세요.")
        }
        //회원가입조건 완료(서버에 보냄)
        else if(Signup_1 && Signup_2 && Signup_3){
            Post(values.name, values.email, gender, valuephone, values.password) //서버에 post형식으로 전달
        }
    }}
>
```

<br>

### 회원가입 서버

> POST방식으로 요청되면 중복된 email이 있는지 확인<br> 블록체인서버로부터 DID발급받은후 회원정보를 DB에저장후 회원가입 성공

```js
//회원가입 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var axios = require('axios');
var crypto = require("crypto");

//블록체인서버로 회원정보 보내기
const Post = async (name, email, gender, phone, password)=> {
    await axios.post(`http://127.0.0.1:5000/VC`, {
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        },
        name: name,
        email: email,
        gender: gender,
        phone: phone,
    }).then((res) => {
        //블록체인서버에서 DID발급해주면
        if(res.data.did){
            var did = res.data.did;
            mysql.query('INSERT INTO signup(name,email,gender,phone,PASSWORD, did) VALUES(?,?,?,?,?,?)',
            [name, email, gender, phone, password, did],
            function(error, result){
                //DB등록 완료
                if(!error){
                    console.log("DID저장 성공")
                }
                //DB등록 실패
                else{
                    console.log("DID저장 실패")
                }
            });
        }
    })
    .catch((error)=> {
        console.log(error)
        console.log("블록체인 서버 오류")
    })
}

router.post('/', (req, res) =>{
    var name = req.body.name
    var email =req.body.email
    var gender =req.body.gender
    var phone =req.body.phone 
    var password =req.body.password

    // //password 암호화
    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'abcdefghijklmnop'.repeat(2) // Must be 256 bits (32 characters)
    const IV_LENGTH = 16 // For AES, this is always 16
    function encrypt(password) {
        const iv = crypto.randomBytes(IV_LENGTH)
        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            Buffer.from(ENCRYPTION_KEY),
            iv,
        )
        const encrypted = cipher.update(password)
    
        return (
            iv.toString('hex') +
            ':' +
            Buffer.concat([encrypted, cipher.final()]).toString('hex')
        )
    }
    const encryptResult = encrypt(password) //password 암호화

    

    //입력한 이메일이 존재하는지 확인
    mysql.query('SELECT * FROM signup WHERE email= ? ',
    [email],
    async function(error, result){
        //정상검색
        if(!error){
            //동일한 이메일이 없는경우
            if(result[0] ==undefined){
                //회원가입정보를 DB에 등록
                await Post(name, email, gender, phone, encryptResult); //블록체인서버로 회원정보 보내기
                //블록체인서버에서 VC or vp 값을 받아오면 검색
                mysql.query('SELECT * FROM signup WHERE email=?',
                [email],
                function(error, result){
                    if(!error){
                        if(result[0]){
                            res.json({message:true})
                        }
                    }else if(error){
                        res.json({ message: false}) 
                    }
                });
            } 
            //동일한 이메일이 있는경우
            else if(result[0].email == email){
                res.json({ message: false}) //클라이언트로 전달
            }
        }
        //검색실패
        else{
            console.log("회원가입 서버오류")
            res.json({ message: false}) //클라이언트로 전달
        }
    });

});
// 라우터를 모듈화
module.exports= router;
```

<br>

### 로그인 클라이언트

> 로그인 정보를 입력후 로그인버튼을 클릭시 작성한 정보를 POST방식으로 Server에 전송

```js
//서버로 회원정보 전달
const Post = async (email,password)=> {
    await axios.post(`http://${localhost}/api/login`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        email: email,
        password :password
    }).then((res) => {
        //회원정보 존재
        if(res.data.message == true){
          //스택을 초기화하여 로그인페이지로 못오게함
            navigation.reset({routes: [{name: 'PinNumSignup', value:email]}) 
        } 
        //회원정보 없음
        else if(res.data.message == false){
            getAlert("로그인실패","이메일, 패스워드를 다시 확인해주세요.")
        }
    })
    .catch((error)=> {
        console.log(error)
        console.log("로그인 클라이언트 오류")
    })
}

//입력후 로그인 버튼 클릭시
<Formik
    initialValues={{email: '',password: '' }}
    onSubmit={ async(values)=>{ Post(values.email, values.password) }}
>
```
<br>

### 로그인 서버

> POST로 요청된 값중 email이 존재하는지 DB로 검색하고 존재한다면, 해당 email의 password와 입력한 패스워드가 동일한지 비교<br> 비교하는 과정에서 DB의 password를 복호화 하여 입력된 password와 비교

```js
  //로그인 서버
var express = require("express");
var router = express.Router(); 
var mysql= require("./mysql");
var crypto = require("crypto");

var decrypt= (password)=> {
    // //password 복호화
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'abcdefghijklmnop'.repeat(2) // Must be 256 bits (32 characters)
  const IV_LENGTH = 16 // For AES, this is always 16
  const passwordParts = password.split(':')
  const iv = Buffer.from(passwordParts.shift(), 'hex')
  const encryptedpassword = Buffer.from(passwordParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv,
    )
    const decrypted = decipher.update(encryptedpassword)
    
    return Buffer.concat([decrypted, decipher.final()]).toString()
}

router.post('/', (req,res)=>{
  var email = req.body.email;
  var password = req.body.password;
  mysql.query('SELECT * FROM signup WHERE email=?',
  [email],
  function(error, result){
      //DB등록 완료
      if(!error){
        if(result[0]){
          if(decrypt(result[0].PASSWORD)==password){
                res.json({ message: true}) //클라이언트로 전달
          }else if(decrypt(result[0].PASSWORD)!=password){
            res.json({ message: false}) //클라이언트로 전달
          }
        }
        else if(result[0]==undefined){
          res.json({ message: false}) //클라이언트로 전달
        } 
      }
      //DB등록 실패
      else{
        res.json({ message: false}) //클라이언트로 전달
        console.log("로그인 서버오류")
      }
  });
});
module.exports= router;
```

<br>

### 핀번호 설정

> 로그인 또는 회원가입시 AsyncStorage에 저장되어있는 email값의 key를 핀번호로 재설정

```js
var password_1 = "";
var password_2 = "";

export default function PinNumSettingScreen({navigation, route}) {
    const [number, setNumber] = useState(0);
    const [text, setText] = useState("현재 비밀번호 확인");
    const [next, setNext] = useState(false);
    const [value, setValue] = useState(false);

    //경고창
    const getAlert = (title, info)=>                           
    Alert.alert(title,info,[{
        text: "확인",                     
        style: "cancel"
    },
    ],{ cancelable: false });

    //로컬스토리지의 key값을 재설정
    const setlocal =()=>{
        AsyncStorage.clear() //로컬스토리지의 모든값 제거
        AsyncStorage.setItem(password_2, value, (error) => {
            if(error){
                navigation.reset({routes: [{name: 'Login'}]}) //홈 으로이동
                getAlert("오류발생","죄송합니다. 다시 시도해주세요.")
                password_1 = ""
                password_2 = ""
            }
        });
        password_1 = ""
        password_2 = ""
        setValue("") //초기화
        setNext(false) //비밀번호 입력상태 초기화
        navigation.goBack();
    }

    //로컬스토리지의 키와 동일하면 값을 불러옴 
    const getlocal =()=>{
        AsyncStorage.getItem(password_1,(error, result) =>{
            if(result){
                password_1 = ""//입력한 비밀번호 초기화
                password_2 = ""//입력한 비밀번호 초기화
                setValue(result) //기존의 로컬스토리지 값
                setNext(true) //비밀번호 재입력으로 변경
                setText("비밀번호 설정") //비밀번호 재입력으로 변경
            }
            else if(result==null){
                password_1 = ""//입력한 비밀번호 초기화
                getAlert("비밀번호", "비밀번호가 일지하지 않습니다.")
            }
        })
    }

    // number의 값을 증가시키는 함수
    const increaseNumber = (num) => { 
        setNumber(number + 1);
        if(!next){
            password_1=password_1+num
        }else if(next){
            password_2=password_2+num
        }
    };
    
    // number의 값을 감소시키는 함수
    const decreaseNumber = () => { 
        setNumber(number - 1);
        if(!next){
            password_1=password_1.slice(0, -1);
        }else if(next){
            password_2=password_2.slice(0, -1);
        }
    };

    //번호를 누를때마다 실행
    useEffect(() => {
        //password_1 입력
        if(number==6 && next==false){ //첫번째 비밀번호 6자리 입력시
            setNumber(0); //눌렀던 갯수를 초기화
            getlocal()
        }
        //입력한 번호가 없는데 지울때
        else if(number<=0){ 
            setNumber(0); //누른갯수 0으로 고정
        }

        //password_2 입력
        if(number==6 && next==true){
            setNumber(0); //눌렀던 갯수를 초기화
            setlocal()
        }
        //입력한 번호가 없는데 지울때
        else if(number<=0){ 
        setNumber(0); //누른갯수 0으로 고정
        }
    },[number]);

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Text style={{fontSize:20, fontWeight:"500", marginBottom:20}}>{text}</Text>
                <Text style={{color:"gray"}}>비밀번호 6자리를 입력해주세요.</Text>
                <View style={{flexDirection:"row", marginTop:30}}>
                    {number>=1 ?<Icon style={{margin:10}} name={"circle"} size={20} color={"#021B79"}/> : <Icon style={{margin:10}} name={"circle-outline"} size={20} color={"#021B79"}/>}

                    ......

                </View>
            </View>
            <View style={{flex:1, marginBottom:50}}>
              <View style={styles.mainNumber}>
                <TouchableOpacity onPress={()=>increaseNumber(1)}  style={styles.number}>
                  <Text style={{fontSize:20}}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>increaseNumber(2)} style={styles.number}>
                  <Text style={{fontSize:20}}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>increaseNumber(3)} style={styles.number}>
                  <Text style={{fontSize:20}}>3</Text>
                </TouchableOpacity>
              </View>
              
              ......

            </View>
        </View>
    );
}
```

<br>

### 화장실 정보 업로드

> 공공데이터포털에서 대전의 공중화장실의 필요한 정보들을 DB에 저장

```js
    var dbinsert = async(type, name, address, phone, latitude, longitude)=>{
        try{    
            mysql.query('SELECT * FROM toilet WHERE name= ?',
            [name],
            async function(error, result){
                //저장된 값이 아니여야하며, 주소가 존재해야함
                if(result[0]==undefined&&address){
                    mysql.query('INSERT INTO toilet(type,name,address,phone,latitude,longitude) VALUES(?,?,?,?,?,?)',
                    [type, name, address, phone, latitude, longitude],
                    function(error, result){
                        //DB등록 완료
                        if(!error){
                            console.log("저장 성공")
                        }
                        //DB등록 실패
                        else{
                            console.log("저장 실패")
                        }
                    });

                }
            })
        }catch{
            console.log("좌표값이없음")
        }
    }

    (async()=>{ 
        var page=0;
        while(1){
            console.log("page: "+page)
            try{
                var data= await axios.get("http://api.data.go.kr/openapi/tn_pubr_public_toilet_api?ServiceKey=OlDGkmbp8C%2Bztten1nGiHbPFDPNcnYLYqAHJonB%2BQjdwhfJaaE2Mj8TsA9R%2BDgz5D8bYR9VOR%2BRaZtf0iZPkhg%3D%3D&pageNo="+page+"&numOfRows=100&type=json&instt_code=6300000"); 
                var data2=await axios.get("http://api.data.go.kr/openapi/tn_pubr_public_toilet_api?ServiceKey=OlDGkmbp8C%2Bztten1nGiHbPFDPNcnYLYqAHJonB%2BQjdwhfJaaE2Mj8TsA9R%2BDgz5D8bYR9VOR%2BRaZtf0iZPkhg%3D%3D&pageNo="+page+"&numOfRows=100&type=json&instt_code=3680000");
                var item =await data.data.response.body.items //페이지당 여러 화장실의 정보 
                var item2=await data2.data.response.body.items //
                page=page+1;
            }catch{
                //페이지 리로드
                mysql.query("SELECT * from toilet",
                function(error, result){
                    if(!error){
                            res.render("toilet", { data: result });
                    }
                });
                break;
            }
            if(data.data.response.body==undefined && data2.data.response.body== undefined){
                //페이지 리로드
                mysql.query("SELECT * from toilet",
                function(error, result){
                    if(!error){
                            res.render("toilet", { data: result });
                    }
                });
                break;
            }else if(data.data.response.body){
                //모든 화장실의 정보만큼 반복
                (async()=>{    
                    for(var i=0; i<item.length; i++){
                        var type = await item[i].toiletType     //화장실 타입
                        var address =await item[i].rdnmadr      //화장실주소
                        var phone =await item[i].phoneNumber    //화장실주소
                        var name =await item[i].toiletNm        //화장실이름
                        var latitude = item[i].latitude
                        var longitude = item[i].longitude
                        //화장실 DB에정보저장
                        await dbinsert(type, name, address, phone, latitude, longitude)
                    }
                    for(var i=0; i<item2.length; i++){
                        var _type = await item2[i].toiletType     //화장실 타입
                        var _address =await item2[i].rdnmadr      //화장실주소
                        var _phone =await item2[i].phoneNumber    //화장실주소
                        var _name =await item2[i].toiletNm        //화장실이름
                        var _latitude = item2[i].latitude
                        var _longitude = item2[i].longitude
                        //화장실 DB에정보저장
                        await dbinsert(_type, _name, _address, _phone, _latitude, _longitude)
                    }
                })()
            }
        }
    })();
```
<br>

### 지도 클라이언트
> DB에저장된 공중화장실정보와 현재위치를 마커로 표시<br> 공중화장실 마커의 이름을 클리시 화장실의 자세한 정보와 리뷰등을 볼 수 있음 

```js
function Loading(){
  return(
    <View style={{flex:1, justifyContent:"center", alignItems: 'center',}}>
      <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
        <Progress.CircleSnail color={['#021B79']} size={80} thickness={5}/>
      </View>
    </View>
  )
}

export default function LocationScreen({navigation, route}) {
  const [Loading, setLoading] = useState(true); //현재 위치 가져오기 전
  const [latitude, setLatitude] = useState(0); //현재위치 위도
  const [longitude, setLongitude] = useState(0); //현재위치 경도
  const [latitudeArry, setLatitudeArry] = useState([]); //화장실 위도
  const [longitudeArry, setLongitudeArry] = useState([]); //화장실 경도
  const [nameArry, setNameArry] = useState([]); //화장실 이름
  const [addressArry, setAddressArry]= useState([]); //화장실 주소

  useEffect(() => {
      var interval =setInterval(function(){
          if(route.params.value != false){
              setLatitude(route.params.value[0]) //현재위치 x좌표 업데이트
              setLongitude(route.params.value[1]) //현재위치 y좌표 업데이트
              setLoading(false)
              clearInterval(interval);
          }
      }, 1000);
  },[]);

  //서버로부터 화장실 위치정보를 요청
  useEffect(() => {
    (async()=>{ 
      await axios.post(`http://${localhost}/api/toiletlocation`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
      }).then((res) => {
        if(res.data.let && res.data.long && res.data.name){
          setAddressArry(res.data.address)
          setLatitudeArry(res.data.let); 
          setLongitudeArry(res.data.long); 
          setNameArry(res.data.name)
        }
      })
      .catch((error)=> {
          console.log(error)
          console.log("화장실 위치 클라이언트 오류")
        })
    })();
  }, []);

  const Post = async (toiletaddress)=> {
    await axios.post(`http://${localhost}/api/toiletinfo`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        address: toiletaddress,
    }).then((res) => {
      if(res.data.message){
          navigation.navigate("ToiletInfo",{ props: res.data.message[0]})
      }
    })
    .catch((error)=> {
        console.log(error)
        console.log("이용내역 클라이언트 오류")
    })
  }


    return (
      <View style={styles.container}>
        {Loading? <Loading/>:(
          <View style={styles.containers}> 
            <MapView 
              style={{flex:1,width:100+"%"}} 
              provider={PROVIDER_GOOGLE} 
              initialRegion={{
                longitude: longitude,
                latitude: latitude,
                latitudeDelta: 0.0052,
                longitudeDelta: 0.0051,
              }}
              >

              <Marker coordinate={{longitude: longitude, latitude: latitude}} title="현재위치" />
            {(latitudeArry.map((user, index)=>(
                  <Marker
                  coordinate={{ longitude: Number(longitudeArry[index]), latitude: Number(latitudeArry[index]) }}
                  key={index}
                  hideCallout={false}
                  image={require('../imge/icon.png')}
                  >
                    <Callout onPress= {()=>Post(addressArry[index])} style={{padding:5, borderRadius:5, borderWidth:1,}}>
                        <Text style={{fontSize:17, fontWeight:"500", marginBottom:3}}>{nameArry[index]}</Text>
                        <Text style={{color:"gray"}}>{addressArry[index]}</Text>
                      </Callout>
                  </Marker>
              
              )) )}

            </MapView>
          </View>
        )}
      </View>

    );
}
```

---

## **5. 문제해결**  :pushpin:

- 일부페이지를 넘길때 메모리누수 오류가 발생 하였습니다. 이유는 전페이지에서 상태값이 변하였고 상태값의 변화에 의해서 페이지의 변화가 있기때문이였습니다. 이를 해결하기 위해서 전페이지에서 상태값을 리턴(초기화)시켜 문제를 해결 하였습니다.

<br>

- 공공데이터포털에서 공중화장실의 정보를 받아올때, 수많은 공중화장실의 정보가 밀려들어와 일부 공중화장실의 정보가 누락되는 문제가 발생 하였습니다. 이때, 해당 기능을 수행할때 비동기처리 하여 모든 공중화장실 정보를 정상적으로 가져올 수 있었습니다.

<br>

- 비동기처리를 통해 지도의 현재위치를 가져왔지만, 지도 로딩 시간이 길어지는 문제점이 발생하였습니다. 그래서 앱 실행과 동시에 현재위치값을 가져오게 하여 지도의 로딩 시간을 줄일 수 있었습니다.

<br>

- 회원가입시 Password의 값을 암호화 하였지만 동일한 값을 입력하였을 경우 암호값이 동일한 문제점이 발생하여, 암복호화 하는 알고리즘에 IV를 추가하여 임의성을 추가 하였습니다. 이 임의성은 암호화가 매번 다른 결과를 만들수 있도록 도와 줍니다.

---

## **6. 개선방안** :pushpin:

- 상태값 변화에대한 오류를 개선하기 위해서 리덕스와 리듀스를 사용하여 하나의 페이지에서 상태값을 관리하기
- AWS 인스턴스 IP의 도메인을 발급받아 IP가 아닌 도메인이름으로 API를 호출 해보기
- 리뷰작성시 찍은사진을 추가하여 DB에 사진파일도 저장해보기
---

## **7. 사용기술**  :smile:

<img width="150px" height="150px" src="https://user-images.githubusercontent.com/75786010/113030512-a4d76b80-91c8-11eb-96c7-0c6dd787b9aa.JPG"></img>
<img width="150px" height="150px" src="https://user-images.githubusercontent.com/75786010/133992365-8cc14029-59ce-4a69-b00d-73377687db55.PNG"></img>
<img width="150px" height="150px" src="https://user-images.githubusercontent.com/75786010/133992198-a83100f4-1aeb-4e23-b49a-3b60cc02c663.PNG"></img>
<img width="150px" height="150px" src="https://user-images.githubusercontent.com/75786010/133992185-252e0d4d-8795-4c5f-ba7b-35a4a231eefa.PNG"></img>
<img width="150px" height="150px" src="https://user-images.githubusercontent.com/75786010/133992188-4bc8c4ed-4492-4ef9-9d8f-f4adb934e004.PNG"></img>
---

### 실행환경
- [x] Expo :thumbsup:
- [x] ios :thumbsup:
- [x] Android :thumbsup:
