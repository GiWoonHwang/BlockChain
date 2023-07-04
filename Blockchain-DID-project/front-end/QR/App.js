import Loading from "./app/page/Loading";
import Login from "./app/page/Login";
import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location'
import AnimatedSplash from "react-native-animated-splash-screen";

export default function App() {

    const [ state, setState ] = useState({ 
    isLoading: false, //로딩중
  }); 
  const [loding, setLoding] = useState(true); //현재 위치 가져오기 전
  const [latitude, setLatitude] = useState(0); //현재위치 위도
  const [longitude, setLongitude] = useState(0); //현재위치 경도

  //현재 휴대폰 주인의 위치를 가져옴
  useEffect(() => {
  (async () => { 
      try{
          await Location.requestForegroundPermissionsAsync();
          const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync();
          setLatitude(latitude) //현재위치 x좌표 업데이트
          setLongitude(longitude) //현재위치 y좌표 업데이트
          setLoding(false)
      }catch(err){
          console.log("위치에러")
      }
  })();
  }, []);


  useEffect(() => {
    setTimeout(() => {
      setState({...state,   isLoading : true}); 
    }, 2000);
    },[]);

    return (
      
      <AnimatedSplash
        translucent={true}
        isLoaded={state.isLoading }
        backgroundColor={"#0575E6","#021B79"}
        logoHeight={600}
        logoWidth={600}
        customComponent ={<Loading/>}
      >
        {loding?<Login/>:<Login props={{latitude,longitude}}/>}
      </AnimatedSplash>
    );

  // if(state.isLoading ==true){
  //   return <Loading/>
  // } else if(state.isLoading ==false){
  //   return  (loding?<Login/>:<Login props={{latitude,longitude}}/>)
  // }
}
