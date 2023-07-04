// 회원가입후 비밀번호 설정 화면
import React,{useState, useEffect, useRef} from 'react';
import { StyleSheet,  Text, View, TouchableOpacity, Alert,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
// var localhost = "172.30.1.27:8080"
var localhost = "52.78.25.173:8080"

var password_1 ="";
var password_2 = "";
var route_email=""

export default function PinNumSignupScreen({navigation, route}) {
    const [number, setNumber] = useState(0);
    const [text, setText] = useState("입력");
    const [next, setNext] = useState(false);
    const [did, setDID] = useState("");
    const [loding, setLoding] = useState(true);
    const [didset, setDidset] = useState(false);

    //이메일 한번만 가져오기
    useEffect(() => {
      if(loding==true&&route.value){
        route_email =route.value //route로받은 이메일
      }
      return () => setLoding(false); //한번만 가져오기위해
    },[]);

    //서버에서 가져온 did값을 로컬스토리지에 저장
    useEffect(() => {
      if(didset==true){
        AsyncStorage.setItem(password_1, did+`, ${route_email}`, (error) => {
          if(error){
            console.log(error)
            navigation.reset({routes: [{name: 'Login'}]}) //홈 으로이동
            getAlert("오류발생","죄송합니다. 다시 시도해주세요.")
            password_1 = ""
            password_2 = ""
            setDidset(false)
          }
        });
          console.log("key: "+password_1+"  value: "+ did+`, ${route_email}` );
          navigation.reset({routes: [{name: 'Tab'}]}) //홈 으로이동
          password_1 = ""
          password_2 = ""
          setDidset(false)
      }
    },[didset]);

    //서버로 회원이메일 전송
    const Post = async (email)=> {
      await axios.post(`http://${localhost}/api/didfind`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        email: email,
      }).then((res) => {
        if(res.data.message == false){
          getAlert("로그인오류", "로그인부터 다시 시작해주세요")
          navigation.reset({routes: [{name: 'Login'}]}) //홈 으로이동
          password_1 = ""
          password_2 = ""
          setDidset(false)
        }else{
          setDID(res.data.message); //서버에서 보낸 did값으로 변경
          setDidset(true)//로컬스토리지 저장으로 이동
        }
      })
      .catch((error)=> {
          console.log(error)
          console.log("did 제공 클라이언트 오류")
      })
    }

    //로컬스토리지에 키가없느지 확인
    const local = ()=>{
      let key=""
      AsyncStorage.getAllKeys((err, keys) => {
        key = keys[0] // 로컬스토리지 첫번째key
        //key가 있으면
        if(key){
          getAlert("비밀번호"," 비밀번호가 존재합니다. 로그인해주세요.") //경고창
          navigation.reset({routes: [{name: 'Login'}]}) //홈 으로이동
          password_1 = ""
          password_2 = ""
          setDidset(false)
        }
        //key가 없으면
        else if(key==null){
          //회원이메일을 서버로 보냄
          Post(route_email)
        }
      });
    }

    //경고창
    const getAlert = (title, info)=>                           
    Alert.alert(title,info,[{
        text: "확인",                     
        style: "cancel"
    },
    ],{ cancelable: false });

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

    //비밀번호가 동일한지 비교하는 함수
    const compare = () =>{
        if(password_1 == password_2){
          //로컬 저장소에 핀번호 저장
          local()
        }
        else if(password_1 != password_2){
          //로컬 저장소에 핀번호 확인하려고 검색
          AsyncStorage.getItem(password_1, (err, result) => {
            console.log(result); // User1 출력
          });
          password_1 = ""
          password_2 = ""
          setNext(false) //다시 비밀번호입력으로 변경
          setText("입력") //입력으로 바꿈
          getAlert("비밀번호가 맞지않습니다","다시확인해주세요.")
        }
    }

    useEffect(() => {
      if(number==6 && next==false){ //첫번째 비밀번호 6자리 입력시
          setNumber(0); //눌렀던 갯수를 초기화
          setNext(true) //비밀번호 재입력으로 변경
          setText("재입력") //비밀번호 재입력으로 변경
      } else if(number<=0){ //누른갯수가 0이하로 떨어질경우
        setNumber(0); //누른갯수 0으로 고정
      }

      if(number==6 && next==true){
          setNumber(0); //눌렀던 갯수를 초기화
          compare() //비밀번호가 동일한지 비교하는 함수
      }else if(number<=0){ //누른갯수가 0이하로 떨어질경우
        setNumber(0); //누른갯수 0으로 고정
      }
    },[number]);

    return (
        <View style={styles.container}>
            <View style={styles.main}>
              <Text style={{fontSize:20, fontWeight:"500", marginBottom:20}}>비밀번호 {text}</Text>
              <Text style={{color:"gray"}}>비밀번호 6자리를 입력해주세요.</Text>
              <View style={{flexDirection:"row", marginTop:30}}>
                {number>=1 ?<Icon style={{margin:10}} name={"circle"} size={20} color={"#021B79"}/> : <Icon style={{margin:10}} name={"circle-outline"} size={20} color={"#021B79"}/>}
                {number>=2 ?<Icon style={{margin:10}} name={"circle"} size={20} color={"#021B79"}/> : <Icon style={{margin:10}} name={"circle-outline"} size={20} color={"#021B79"}/>}
                {number>=3 ?<Icon style={{margin:10}} name={"circle"} size={20} color={"#021B79"}/> : <Icon style={{margin:10}} name={"circle-outline"} size={20} color={"#021B79"}/>}
                {number>=4 ?<Icon style={{margin:10}} name={"circle"} size={20} color={"#021B79"}/> : <Icon style={{margin:10}} name={"circle-outline"} size={20} color={"#021B79"}/>}
                {number>=5 ?<Icon style={{margin:10}} name={"circle"} size={20} color={"#021B79"}/> : <Icon style={{margin:10}} name={"circle-outline"} size={20} color={"#021B79"}/>}
                {number>=6 ?<Icon style={{margin:10}} name={"circle"} size={20} color={"#021B79"}/> : <Icon style={{margin:10}} name={"circle-outline"} size={20} color={"#021B79"}/>} 
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
              <View style={styles.mainNumber}>
                <TouchableOpacity onPress={()=>increaseNumber(4)}  style={styles.number}>
                  <Text style={{fontSize:20}}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>increaseNumber(5)} style={styles.number}>
                  <Text style={{fontSize:20}}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>increaseNumber(6)} style={styles.number}>
                  <Text style={{fontSize:20}}>6</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.mainNumber}>
                <TouchableOpacity onPress={()=>increaseNumber(7)}  style={styles.number}>
                  <Text style={{fontSize:20}}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>increaseNumber(8)} style={styles.number}>
                  <Text style={{fontSize:20}}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>increaseNumber(9)} style={styles.number}>
                  <Text style={{fontSize:20}}>9</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.mainNumber}>
                <TouchableOpacity  style={styles.number}>
                  <Text style={{fontSize:20}}></Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>increaseNumber(0)} style={styles.number}>
                  <Text style={{fontSize:20}}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={decreaseNumber} style={styles.number}>
                  <Icon name={"arrow-left-thick"} size={30} color={"#021B79"}/>
                </TouchableOpacity>
              </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff",
    alignItems: 'center',
    justifyContent: 'center',
  },
  main:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainNumber:{
    flexDirection:"row",
  },
  number:{
    width:100,
    justifyContent:"center",
    alignItems:"center",
    padding:30
  }
});