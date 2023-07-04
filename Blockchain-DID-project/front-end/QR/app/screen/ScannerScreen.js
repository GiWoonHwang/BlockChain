import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button ,TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Progress from 'react-native-progress';
import { Dimensions } from 'react-native';
var localhost = "52.78.25.173:8080"

function Loding(){
    return(
      <View style={{flex:9, justifyContent:"center", alignItems: 'center',}}>
        <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
          <Progress.CircleSnail color={['#021B79']} size={80} thickness={5}/>
        </View>
      </View>
    )
  }


export default function ScannerScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [toiletinfo, setToiletinfo] =  useState("검증된 정보가 없습니다.");
    const [toiletaddress, setToiletaddress] = useState("");
    const [toilettype, setToilettype] = useState("");
    const [toiletname, setToiletname] = useState("");
    const [toiletphone, setToiletphone] = useState("");
    const [text, setText] = useState("QR코드를 스캔해주세요");
    const [color, setColor] = useState("#fff");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [scnnestate, setScnnestate]= useState(true);
    const [send, setSend] = useState("");

    useEffect(() => {
        AsyncStorage.getAllKeys(  (err, keys) => {
            var key = keys[0]
            if(key){
                AsyncStorage.getItem(key, (err,result) =>{
                    result=result.split(", ")
                    setEmail(result[1])
                    setLoading(false)
                })
            }else if(key==null){
            }
        });
    },[]);

     //서버로 did데이터 보내기
    const Post = async (data)=> {
        await axios.post(`http://${localhost}/api/appscanner`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            data: 10,
            email: email
        })
        //서버에서 받아오는 값
        .then((res) => {
            if(res.data.message==true){
                setSend(res.data.toiletinfo)
                setToiletaddress(res.data.toiletinfo.address)
                setToilettype(res.data.toiletinfo.type)
                setToiletname(res.data.toiletinfo.name)
                setToiletphone(res.data.toiletinfo.phone)
                setScnnestate(false)
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
        setScanned(true);
        Post(data);
    };

    // //허가된 QR코드정보
    const Approval =()=>{
        setColor("#38ef7d");
        setText("승인 되셨습니다");
        setTimeout(() => {
            setColor("#ffff");
            setText("QR코드를 스캔해주세요");
            setScanned(false)
        }, 1500);
    }

    //허가되지 않은 QR코드정보
    const ApprovalFailed =()=>{
        setColor("#F00000")
        setText("유효하지 않은 QR입니다")
        setTimeout(() => {
            setColor("#ffff");
            setText("QR코드를 스캔해주세요");
            setScanned(false)
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
    <View style={{flex:1}}>
        {loading?<Loding/>:  
            <BarCodeScanner
                type={BarCodeScanner.Constants.Type.back}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={[StyleSheet.absoluteFill, styles.container]}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                onRead={2000}
                >
                <View style={{flex:1,alignItems:"center", justifyContent:"center"}}>
                    <Text style={{color:color, backgroundColor:"rgba(0, 0, 0, .6)",padding:10, borderRadius:20, paddingRight:30, paddingLeft:30, fontWeight:"600"}}>{text}</Text>
                </View>
                <View style={{flex:1}}></View>
                <View style={styles.Bottom}>
                    <View style={{flex:1,padding:20}}>
                        <View><Text style={{fontSize:25, fontWeight:"600"}}>화장실 정보</Text></View>
                        <View style={{flex:2, alignItems:"center", justifyContent:"center"}}>
                            {scnnestate?<Text>{toiletinfo}</Text>:
                            <TouchableOpacity style={{alignItems:"center"}} onPress={()=> navigation.navigate("ToiletInfo",{ props: send})}>
                                <Text style={{marginBottom:8, color:"gray"}}>{toilettype}</Text>
                                <Text style={{marginBottom:10, fontWeight:"600", fontSize:23}}>{toiletname}</Text>
                                <Text style={{marginBottom:8}}>{toiletphone}</Text>
                                <Text style={{marginBottom:8}}>{toiletaddress}</Text>
                            </TouchableOpacity>}
                        </View>
                    </View>
                </View>
                    {scanned && <Text onPress={()=> setScanned(false)} />}
            </BarCodeScanner>
        }
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    Bottom:{
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height/3,
        position:"absolute",
        bottom:0,
        justifyContent:"flex-end",
        backgroundColor: "#ffff",
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        marginBottom:0
    }
}) 