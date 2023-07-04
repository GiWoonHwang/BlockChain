//홈 화면
import React, { useState, useEffect } from 'react';
import { IconButton } from 'react-native-paper';
import {TouchableOpacity ,Button, StyleSheet,  Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Hederbar from '../screen/Hederbar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {Ionicons} from '@expo/vector-icons';

var localhost = "52.78.25.173:8080"

const backgroundColorOptions = {
  option_blue:{
  color: ["#0575E6","#021B79"]
},
}

export default function HomeScreen({ navigation, route }) {
  let backgroundColor = backgroundColorOptions["option_blue"].color;
  const [namedb, setNamedb] = useState(" ");
  const [emaildb , setEmaildb] = useState(" ");

  useEffect(() => {
    AsyncStorage.getAllKeys(  (err, keys) => {
      var key = keys[0]
        if(key){
            AsyncStorage.getItem(key, (err,result) =>{
                result=result.split(", ")
                var did = result[0]
                var email = result[1]
                Post(email);
            })
        }else if(key==null){
        }
    });
  },[]);

  const maskingName = (strName)=> {
    if (strName.length > 2) {
      var originName = strName.split('');
      originName.forEach(function(name, i) {
        if (i == 0 || i == originName.length - 1) return;
        originName[i] = '*';
      });
      var joinName = originName.join();
      setNamedb(joinName.replace(/,/g, ''))
    } else {
      var pattern = /.$/; // 정규식
      setNamedb(strName.replace(pattern, '*'))
    }
  };

  const maskingEmail = (strEmail)=> {
      var originName = strEmail.split('');
      var index = 0 //초기 0
      originName.forEach(function(name, i) {
        if ( name=="@" ){
          originName[i] = '\n@';
          index = i
        }
      });
      originName.forEach(function(name, i) {
        if(i+4>index && i<index){
          originName[i] = '*';
          
        }
      });
      var joinName = originName.join();
      setEmaildb(joinName.replace(/,/g, ''))
  };

  const Post = async (email)=> {
    await axios.post(`http://${localhost}/api/userinfo`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        email: email,
    }).then((res) => {
      if(res.data.message){
        // console.log(res.data.message)
        maskingName(res.data.message.name)
        maskingEmail(res.data.message.email)
      }
    })
    .catch((error)=> {
        console.log(error)
        console.log("홈 클라이언트 오류")
    })
  }

  return (
        <View style={styles.container}>
        <Hederbar navigations={navigation}/>
        <TouchableOpacity style={styles.QR} onPress={()=>navigation.navigate("QRcode") } >
          <View style={{flex:1}}>
            <View style={styles.QR_1_back} >
              <LinearGradient colors={backgroundColor} style={styles.QR_1} >
                <Text style={styles.QRText}>ArTo</Text>
                {/* <Ionicons name={'checkmark-circle-outline'} size={30} color={"#38ef7d"} style={{position:"absolute", top:10, right:10}}>
                  <Text style={{fontSize:10}}>인증</Text>
                </Ionicons> */}
                <Text style={{position:"absolute", top:10, right:10, color:"#38ef7d", fontSize:10}}>
                  신원인증
                  <Ionicons name={'checkmark-circle-outline'} size={30} color={"#38ef7d"} style={{position:"absolute", top:10, right:10}}/>
                </Text>

                <Text style={styles.QR_1_text_1}>
                  본인인증 증명서
                </Text>
                <Text style={styles.QR_1_text_2}>
                  ArTo
                </Text>
              </LinearGradient>
            </View>
            <View style={styles.QR_2}>
              <View style={{flex:1}}>
                <Text style={styles.QR_2_texttitle}>
                  인증여부
                </Text>
                <Text style={{fontSize:25, fontWeight: "700"}}>
                  승인
                </Text>
              </View>
              <View style={{flex:1, paddingLeft:40, overflow:"hidden",}}>
                <Text style={styles.QR_2_texttitle}>
                  성명
                </Text>
                <Text style={{fontSize:13, fontWeight: "700", marginBottom:20}}>
                  {namedb}
                </Text>
                <Text style={styles.QR_2_texttitle}>
                  이메일
                </Text>
                <Text style={{fontSize:13, fontWeight: "700",}}>
                  {emaildb}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
    </View>

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#F6F6F6",
    alignItems: 'center',
    justifyContent: 'center',
  },
  QR: {
    width: 70+"%",
    height: 75+"%",
    borderRadius: 16,
    backgroundColor:"#fff",
    shadowOpacity: 0.75,
    shadowRadius: 7,
    shadowColor: 'gray',
    shadowOffset: { height: 10, width: 3 },
    marginTop:50,
  },
  QR_1_back: {
    flex:3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  QR_1:{
    flex:1,
    padding:20,
    justifyContent: 'flex-end',
  },
  QR_1_text_1: {
    fontSize:26,
    fontWeight: "900",
    color:"#fff",
    textShadowColor: "gray",
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 2
  },
  QR_1_text_2: {
    fontSize:13,
    marginTop:10,
    fontWeight: "700",
    color:"#fff",

  },
  QR_2: {
    flex:1,
    padding: 20,
    backgroundColor:"#ffff",
    borderBottomEndRadius: 16,
    borderBottomLeftRadius: 16,
    flexDirection:"row",
  },
  QR_2_texttitle: {
    color:"#616161",
    fontSize: 13,
    marginBottom:5,
  },
  QRText:{
    color:"#0577F6", 
    transform: [{ rotate: '90deg'}],
    fontSize:100,
    fontWeight:"700",
    position:"absolute",
    top:15,
    left:-50
  }
});