//설정에 앱초기화 할때 핀번호 화면
import React,{useState, useEffect, useRef} from 'react';
import { StyleSheet,  Text, View, TouchableOpacity, Alert,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
var password_1 = ""
export default function InitializationScreen({navigation}) {
  const [number, setNumber] = useState(0);

    // number의 값을 증가시키는 함수
    const increaseNumber = (num) => { 
      setNumber(number + 1);
      password_1=password_1+num
    };
    // number의 값을 감소시키는 함수
    const decreaseNumber = () => { 
      setNumber(number - 1);
      password_1=password_1.slice(0, -1);
    };

    const getAlert = (title, info)=>     
    Alert.alert(title,info,[{
      text: "확인",                     
      style: "cancel",
    },
    ],{ cancelable: false });

    useEffect(() => {
      // console.log(number)
      // console.log(password_1)
      if(number==6){ //첫번째 비밀번호 6자리 입력시
        AsyncStorage.getItem(password_1, (err, result) => {
          try{
            if(!result){
              getAlert("비밀번호","비밀번호가 틀렸습니다.")
              setNumber(0); //누른갯수 0으로 고정
              password_1 = "";
            }else{
              AsyncStorage.clear() //로컬스토리지의 모든값 제거
              navigation.reset({routes: [{name: 'Login'}]}) 
              password_1 = ""; //입력한 번호 초기화
            }
          }
          catch{
            navigation.reset({routes: [{name: 'Login'}]}) 
          }
        });
      } else if(number<=0){ //누른갯수가 0이하로 떨어질경우
        setNumber(0); //누른갯수 0으로 고정
      }
    },[number]);

    

    return (
        <View style={styles.container}>
            <View style={styles.main}>
              <Text style={{fontSize:20, fontWeight:"500", marginBottom:20}}>비밀번호 입력</Text>
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