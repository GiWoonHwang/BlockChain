// 화장실 위치화면
import React, { useState, useEffect } from 'react';
import { StyleSheet,  Text, View, TouchableOpacity } from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout }from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';
import axios from "axios"
var localhost = "52.78.25.173:8080"

function Loding(){
  return(
    <View style={{flex:1, justifyContent:"center", alignItems: 'center',}}>
      <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
        <Progress.CircleSnail color={['#021B79']} size={80} thickness={5}/>
      </View>
    </View>
  )
}

export default function LocationScreen({navigation, route}) {
  const [loding, setLoding] = useState(true); //현재 위치 가져오기 전
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
              setLoding(false)
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
        {loding? <Loding/>:(
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff",
    flexDirection:'row',
  },
  containers: {
    flex:1,
    zIndex:-1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});