//설정화면의 비밀번호 설정 화면
import React,{useState, useEffect, useRef} from 'react';
import { StyleSheet,  Text, View, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';


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