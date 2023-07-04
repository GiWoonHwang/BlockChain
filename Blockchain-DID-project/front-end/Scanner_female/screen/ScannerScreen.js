import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button ,TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from "axios"
import CustomButton from '../CustomButton';
var localhost = "52.78.25.173:8080"

export default function ScannerScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState("");
    const [color, setColor] = useState("#fff");
    
     //서버로 did데이터 보내기
      const Post = async (qr, email, location)=> {
        await axios.post(`http://${localhost}/api/scanner`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            qr: qr,
            useremail : email,
            location: location,
            gender : "female"
        })
        //서버에서 받아오는 값
        .then((res) => {
            if(res.data.message==true){
              Approval() //허가된 QR코드
            }
            else if(res.data.message==false){
              ApprovalFailed() //허가되지 않은 QR코드
            }
        })
        //에러 발생시 작동
        .catch((error)=> {
          console.log("인증실패")
            
        })
    }
    //처음사용자의 카메라 접근권한을 요청
    useEffect(() => {
    (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    })();
    }, []);

    //QR찍었을때 어떻게 할것인가
    const handleBarCodeScanned = ({ type, data }) => {
        var data=data.split(",")
        var qr = data[0]; //QR코드
        var email = data[1]; //사용자 이메일
        setScanned(true);
        // var arryNumber = Math.floor (( Math.random() * 37 )); //랜덤한수 0~99
        Post(qr,email,10);
        // console.log(qr,email,arryNumber+1)
    };

    // //허가된 QR코드정보
    const Approval =()=>{
        setColor("#38ef7d");
        setText("승인 되셨습니다");
        setTimeout(() => {
            navigation.navigate('Home', {textValue:true}); //Home에대한 props전달
        }, 1500);
    }

    //허가되지 않은 QR코드정보
    const ApprovalFailed =()=>{
        setColor("#F00000")
        setText("유효하지 않은 QR입니다.")
        setTimeout(() => {
            navigation.navigate('Home'); //Home에대한 props전달
        }, 1500);
    }

    if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
    return <Text>No access to camera</Text>;
    }
    // BarCodeScanner.BarCodePoint ={ x: 100, y: 200} 
    // console.log(`state.Click = ${state.Click}, main.sign = ${main.sign}`)
    return (

              <BarCodeScanner
                  type={BarCodeScanner.Constants.Type.front}
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  style={[StyleSheet.absoluteFill, styles.container]}
                  barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                  onRead={2000}
                  >
                  <View style={styles.layerTop}>
                      <Text style={{color:"#fff", fontSize:17, fontWeight:"500"}}>QR코드를 스캔해주세요</Text>
                      <Text style={{marginTop:30, fontSize:30, fontWeight:"500",color:color, }}>{text}</Text>
                  </View>
                  <View style={styles.layerCenter}>
                      <View style={styles.layerLeft} />
                      <View style={styles.focused} />
                      <View style={styles.layerRight} />
                  </View>
                  <View style={styles.layerBottom}>
                  <CustomButton 
                    title = "HOME"
                    titleColor="#274046"
                    buttonColor='#F2F2F2'
                    onPress={() => navigation.navigate("Home")} 
                  />
                  </View>
                      {scanned && <Text onPress={()=> setScanned(false)} />}
              </BarCodeScanner>

);
}
const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity,
    justifyContent:"center",
    alignItems:"center",
  },
  layerCenter: {
    flex: 3,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    alignItems:"center",
    justifyContent:"flex-end",
    flex: 3,
    backgroundColor: opacity,
  },
}) 