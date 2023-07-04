// 설정화면
import React, { useState ,useEffect} from 'react';
import { StyleSheet,  Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
var localhost = "52.78.25.173:8080"


export default function SetingScreen({navigation}) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const toggleTheme = ()=>{
      setIsDarkTheme(!isDarkTheme)
  }

  // 여기부터 Post함수까지 set메뉴(db에 회원정보 가져옴)
  const [namedb, setNamedb] = useState(" ");
  const [emaildb , setEmaildb] = useState(" ");
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
          originName[i] = '@';
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


  const getAlert = (title, info)=>                           
  Alert.alert(title,info,[{
      text: "취소",                     
      style: "cancel",
  },{
    text: "확인",                     
    style: "cancel",
    onPress: () => {navigation.navigate("Initialization")}
  }
  ],{ cancelable: false });
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={{fontSize:30, fontWeight:"900", marginVertical:3, paddingLeft:30, marginBottom:20}}>설정</Text>
          </View>
          <View style={styles.userinfo}>
            <Text style={{fontWeight:"500", fontSize:25, marginBottom:10}}>{namedb} 님</Text>
            <Text style={{color:"gray", marginBottom:20}}>{emaildb}</Text>
            <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate("ModifyInformation")}>
              <Text style={{color:"gray", marginRight:3}}>내 정보 수정</Text>
              <Ionicons name={"chevron-forward-outline"} size={15} color={"gray"} />
            </TouchableOpacity>
          </View>
          <View style={styles.setting}>
            <View style={{ flex:1, borderBottomColor: "gray", borderBottomWidth: 0.3, justifyContent:"flex-end"}}>
              <Text style={{color:"gray",paddingLeft:30,marginBottom:10}}>일반</Text>
            </View>
            <View style={styles.settingInfo}>
              <TouchableOpacity style={{flexDirection:"row", justifyContent:"space-between"}} onPress={()=>navigation.navigate("PinNumSetting")}>
                  <Text style={{paddingLeft:30, fontSize:18}}>비밀번호 설정</Text>
                  <Ionicons name={"chevron-forward-outline"} size={20} color={"gray"} style={{paddingRight:30}}/>
              </TouchableOpacity>
            </View>
            <View style={styles.settingInfo}>
              <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                  <Text style={{paddingLeft:30, fontSize:18}}>비밀번호 활성화</Text>
                  <TouchableOpacity onPress={()=> {toggleTheme()}} style={{paddingRight:30}}>
                    <View pointerEvents="none">
                      <Switch value={isDarkTheme} trackColor={{  true: "#021B79" }} style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}/>
                    </View>
                  </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex:1, borderBottomColor: "gray", borderBottomWidth: 0.3, justifyContent:"flex-end"}}>
              <Text style={{color:"gray",paddingLeft:30,marginBottom:10}}>앱정보</Text>
            </View>
            <View style={styles.settingInfo}>
              <TouchableOpacity style={{flexDirection:"row", justifyContent:"space-between"}} onPress={()=>navigation.navigate("Notice")}>
                  <Text style={{paddingLeft:30, fontSize:18}}>공지사항</Text>
                  <Ionicons name={"chevron-forward-outline"} size={20} color={"gray"} style={{paddingRight:30}}/>
              </TouchableOpacity>
            </View>
            <View style={styles.settingInfo}>
              <TouchableOpacity style={{flexDirection:"row", justifyContent:"space-between"}} onPress={()=>navigation.navigate("TermsofService")}>
                  <Text style={{paddingLeft:30, fontSize:18}}>개인정보 약관 동의</Text>
                  <Ionicons name={"chevron-forward-outline"} size={20} color={"gray"} style={{paddingRight:30}}/>
              </TouchableOpacity>
            </View>
            <View style={styles.settingInfo}>
              <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                  <Text style={{paddingLeft:30, fontSize:18}}>앱 버전</Text>
                  <Text style={{paddingRight:30, fontSize:15, color:"gray"}}>1.0.2</Text>
              </View>
            </View>
            <View style={{flex:1, justifyContent:"center"}}>
              <TouchableOpacity style={{flexDirection:"row", justifyContent:"space-between"}} onPress={()=>getAlert("초기화","정말로 삭제하시겠습니까?")}>
                  <Text style={{paddingLeft:30, fontSize:18, color:"red"}}>로그아웃</Text>
                  <Ionicons name={"chevron-forward-outline"} size={20} color={"gray"} style={{paddingRight:30}}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bottm}>
            <Text style={{color:"gray",marginBottom:10}}>전국 안전화장실</Text>
            <Text >&copy; 2021 | Created, ArTo</Text>
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
  header: {
    flex: 1.5,
    width:100+"%",
    borderBottomColor: "gray",
    borderBottomWidth: 0.3,
    justifyContent:"flex-end"
  },
  userinfo: {
    flex: 2,
    width:100+"%",
    borderBottomColor: "gray",
    borderBottomWidth: 0.3,
    paddingLeft:30,
    justifyContent:"center",
  },
  setting: {
    flex: 5,
    width:100+"%",
    borderBottomColor: "gray",
    borderBottomWidth: 0.3
  },
  settingInfo:{
    flex:1,
    borderBottomColor: "gray",
    borderBottomWidth: 0.3,
    justifyContent:"center",
  },
  bottm: {
    flex: 2,
    width:100+"%",
    justifyContent:"center",
    paddingLeft:30
  },
});

