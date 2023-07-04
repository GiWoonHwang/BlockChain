//홈 화면에서 클릭시 나오는 QR코드 화면
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet,  Text, View, TouchableOpacity, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import axios from 'axios'
var localhost = "52.78.25.173:8080"


export default function QRcodeScreen({navigation, route}) {
  const [count, setCount] = useState(60);
  const [timeout, setTimeout] = useState(true);
  const [did, setDid] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [vp, setVP] =useState(undefined);
  const [vpstate, setVPstate] = useState(true); //블록체인서버로 부터 vp가 왔는지
  const savedCallback = useRef();
  
    //경고창
    const getAlert = (title, info)=>                           
    Alert.alert(title,info,[{
        text: "확인",                     
        style: "cancel"
    },
    ],{ cancelable: false });

  useEffect(() => {
    AsyncStorage.getAllKeys( (err, keys) => {
      var key = keys[0]
        if(key){
            AsyncStorage.getItem(key, (err,result) =>{
                result=result.split(", ")
                setDid(result[0])
                setEmail(result[1])
                VPpost(result[0], result[1])
            })
        }else if(key==null){
        }
    });
  },[]);

  //리셋버튼
  function reset() {
    VPpost(did,email)
    setCount(60) //초리셋
    setTimeout(true)
  }

  //남은시간이 0초일때
  useEffect(() => {
    if(count==0){
      setTimeout(false)
    }  
  },[count]);
  
  //0초전까지 1씩감소
  function callback() {
    if(count>0 && vpstate ==false){
      setCount(count - 1);
    }
  }
  
  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    let id = setInterval(tick, 1000);
    return () => clearInterval(id);
  },[]);

  //VP 발급하기 위해 서버로 통신
  const VPpost = async (newdid, newemail)=> {
    if(newdid !=undefined && newemail != undefined){
      setVPstate(true)
      await axios.post(`http://${localhost}/api/vp`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        id: newemail,
        did: newdid,
      }).then((res) => {
        if(res.data.message){
          console.log(res.data.message) //vp를 가리키는 jwt
          setVP(res.data.message)
          setVPstate(false)
        }else if(res.data.message ==false){
          getAlert("오류발생", "다시시도 해주세요")
        }
      })
      .catch((error)=> {
          console.log(error)
          getAlert("오류발생", "다시시도 해주세요")
      })
    }
  }

  return (
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={{flex:1,flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
              <Text>남은시간</Text>
              <Text style={{color:"red", paddingLeft:5}}>{count}초</Text>
            </View>
            <View style={{flex:9, justifyContent:"center"}}>
            {vpstate?
              <Progress.CircleSnail color={['#021B79']} size={100} thickness={5}/>
              :   
              <QRCode 
                value={timeout ? vp+","+email: "시간초과"+","+email}
                size={250}
                logoBackgroundColor='#ffff'
              />
            }
            </View>
          </View>
          <View style={styles.mainBottom}>
            <TouchableOpacity style={{backgroundColor:"#021B79",borderColor:"#021B79",borderWidth:1, borderRadius:50, padding:10}} onPress={()=>reset()}>
              <Ionicons name={'refresh-outline'} size={30} color={"#ffff"}/>
            </TouchableOpacity>
          </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff",
    justifyContent: 'center',
  },
  main:{
    flex:2,
    justifyContent: 'center',
    alignItems:"center",
  },
  mainBottom:{
    flex:2,
    justifyContent: "center",
    alignItems:"center"
  }
});