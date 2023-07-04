//이용내역 화면
import React, { useState, useEffect } from 'react';
import {TouchableOpacity ,Button, StyleSheet,  Text, View, FlatList , Image} from 'react-native';
import Hederbar from '../screen/HederbarSecond'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {Ionicons} from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
var localhost = "52.78.25.173:8080"


var Day =["월","화","수","목","금","토","일"]

function Loding(){
  return(
    <View style={{flex:9, justifyContent:"center", alignItems: 'center',}}>
      <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
        <Progress.CircleSnail color={['#021B79']} size={80} thickness={5}/>
      </View>
    </View>
  )
}

function Noninfo(){
  return(
      <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
          <Text style={{fontSize:20, fontWeight:"400", color:"gray"}}>화장실 이용내역이 없습니다.</Text>
      </View>
  )
}


export default function UsageHistoryScreen({ navigation, route }) {
  const [loading, setLoding] = useState(true); //로딩
  const [infoLoading, setInfoLoading] = useState(true); //정보 있는지 없느지
  const [arry, setArry] = useState([]); //사용내역 
  const [datearry, setDatearry] = useState([]); //현재 날짜

  useEffect(() => {
    AsyncStorage.getAllKeys(  (err, keys) => {
      var key = keys[0]
        if(key){
            AsyncStorage.getItem(key, (err,result) =>{
                result=result.split(", ")
                var email = result[1]
                Post(email);
            })
        }else if(key==null){
        }
    });
  },[]);

  useEffect(() => {
    if(route.params){
      AsyncStorage.getAllKeys(  (err, keys) => {
        var key = keys[0]
          if(key){
              AsyncStorage.getItem(key, (err,result) =>{
                  result=result.split(", ")
                  var email = result[1]
                  Post(email);
              })
          }else if(key==null){
          }
      });
    }
  },[route]);

  const Post = async (email)=> {
    await axios.post(`http://${localhost}/api/usagehistory`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        email: email,
    }).then((res) => {
      if(res.data.message){
        setArry(res.data.message)
        for(var i=0; i<res.data.message.length; i++){
          var date = new Date()//현재날짜
          var formattedDate = date.getFullYear() //현재 년도
          var resultDate = new Date(res.data.message[i].DATE) //가져온 날짜
          var weekday = resultDate.getUTCDay();

          var month = (resultDate.getMonth()+1)
          if(month.toString().length==1){
              month = "0"+month
          }
          var day = resultDate.getDate();
          if(day.toString().length==1){
              day = "0"+day
          }
          var year = resultDate.getFullYear();
          if(year == formattedDate){
            var Dates = month+'/'+day+' ('+Day[weekday]+')'
          }else{
            var Dates = year+'/'+month+'/'+day+' ('+Day[weekday]+')'
          }
          
          datearry.push(Dates) //받아오는 데이터의 날짜만 따로 저장
        }
        setLoding(false)
        setInfoLoading(false)
      }
      if(res.data.message ==false){
        setLoding(false)
      }
    })
    .catch((error)=> {
        console.log(error)
        console.log("이용내역 클라이언트 오류")
    })
  }

  const renderItem = ({ item,index }) => {
    var addressArry= item.address.split(" ")
    var address = addressArry[1]
    var imges

    if(address=="동구") imges = require("../imge/DongGu.png")
    else if(address=="대덕구") imges =require("../imge/Daedeok.png")
    else if(address=="서구") imges =require("../imge/Seogu.png")
    else if(address=="유성구") imges ="../imge/yuseong.png"
    else if(address=="중구") imges =require("../imge/JungGu.png")
    
    return (
        <View style={styles.renderItem}>

          <View style={{marginBottom:5, flexDirection:"row", justifyContent:"space-between"}}>
            <Text style={{fontSize:12, color:"gray"}}>{datearry[index]} {item.state}</Text>
              {item.reviewstate ==false && item.state == "인증 성공"?
              <TouchableOpacity onPress={()=>navigation.navigate("Review",{ props: item})} >
                <View style={{ backgroundColor:"#022B97", padding:6, borderRadius:50}}><Text style={{fontSize:12, color:"#ffff"}}>리뷰 작성하기</Text></View>
              </TouchableOpacity>
              : 
              <View style={{borderColor:"gray", borderWidth:1, padding:5, borderRadius:50}}><Text style={{fontSize:12}}>인증내역</Text></View>
              }
          </View>

          <View style={{flexDirection:"row", alignItems:"center"}}>
            <Image
            style={{height:50,width:50}}
            source={imges}
            />
            <View style={{marginLeft:10}}>
              <TouchableOpacity onPress={()=>navigation.navigate("ToiletInfo",{ props: item})} >
                <Text style={{marginBottom:5, fontSize:16, fontWeight:"600"}}>
                  {item.name}
                  <Ionicons name={'chevron-forward-outline'} style={{fontSize:16, fontWeight:"600"}}/>
                </Text>
              </TouchableOpacity>
              <Text>{item.address}</Text>
            </View>
          </View>
          
        </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{flex:1}}><Hederbar navigations={navigation}/></View>
      {loading? 
        <Loding/>:
        <View style={styles.itembox}>
          {infoLoading? 
            <Noninfo/>:
            <FlatList
            data ={arry}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            />
          }
        </View>
      }
    </View>

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#F6F6F6",
  },
  itembox:{
    flex:9,
  },
  renderItem:{
    marginTop:20,
    padding:25,
    backgroundColor:"#ffff",
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 1, width: 10 },
  }
});