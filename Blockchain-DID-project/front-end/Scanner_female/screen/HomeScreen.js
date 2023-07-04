import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../CustomButton';
import axios from "axios"
import {Ionicons} from '@expo/vector-icons';

var localhost = "52.78.25.173:8080"

const backgroundColorOptions = {
  back:{
    color: ["#ff5e62","#ff9966","#fffbd5"]
  },
}
let backgroundColor = backgroundColorOptions["back"].color;
let mainClose = "LOCK"
let mainOpen = "OPEN"

export default function HomeScreen({navigation, route}) {
  const [ main, setMain ] = useState({ 
    MainText : false,
  }); 
  const [toiletname,setToiletname]=useState(" ");
  const [toiletaddress,setToiletaddress]=useState(" ");


    //이용내역 화면에서 전달받은 화장실 주소로 서버에보냄
    useEffect(() => {
      (async()=>{ 
          await axios.post(`http://${localhost}/api/scannerlocation`, {
          headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          },
          location : 10
          }).then((res) => {
          if(res.data.message ){
            setToiletaddress(res.data.message[0].address);

            setToiletname(res.data.message[0].name);
          }
          })
          .catch((error)=> {
              console.log(error)
              console.log("화장실 위치 클라이언트 오류")
          })
      })();
  }, []);

  //인증후 5초뒤 다시 문잠김
  useEffect(() => {
      if(main.MainText){
      setTimeout(() => {
          setMain({...main,   MainText : false}); 
      }, 2000);
    }
  },[main.MainText]);


  try{
    if(route.params==null){
      console.log("스캔전")
    }
    else if(route.params.textValue==true){
      setMain({...main,   MainText : true}); 
      route.params=false
    }
  }catch{
    console.log("QR코드에서 전달받은 값오류")
  }

  return (
      <LinearGradient colors={backgroundColor} style={styles.container}>
        <View style={styles.header}> 
            <Text style={{color:"#ffff", fontSize:35, fontWeight:"800", marginBottom:10}}>여자 화장실</Text>
            <Text style={{color:"#ffff", fontSize:15}}>
                <Ionicons name={'location'} style={{fontSize:18,marginRight:10, color:"#fff"}}/> 
                {toiletaddress} ({toiletname})
            </Text>
        </View>
        <View style={styles.maintext}>
          <Text style={styles.text}>
            {main.MainText ? mainOpen : mainClose}
          </Text>
        </View>
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <CustomButton 
            // title = {<Ionicons name={'scan-outline'} style={{fontSize:50,marginRight:10, color:"black", fontWeight:"900"}}/>} 
            title = "SCAN" 
            titleColor="#274046"
            buttonColor='#F2F2F2'
            onPress={() => navigation.navigate("Scanner")} 
            />
        </View>
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  header: {
    flex: 1,
    justifyContent:"center",
    alignItems: 'center',
    marginTop:50,


  },
  maintext:{
    flex: 9,
    justifyContent:"center",
    alignItems: 'center',
    
  },
  text:{
    color:"#fff",
    fontSize:100,
    fontWeight:"600",
    textShadowColor:'#585858',
    textShadowOffset:{width: 5, height: 5},
    textShadowRadius:10,
  }
});