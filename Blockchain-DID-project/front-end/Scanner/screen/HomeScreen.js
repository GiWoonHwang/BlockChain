import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../CustomButton';

const backgroundColorOptions = {
  back:{
    color: ["#0575E6","#021B79"]
},
}
let backgroundColor = backgroundColorOptions["back"].color;
let mainClose = "Close"
let mainOpen = "Open"

export default function HomeScreen({navigation, route}) {
    const [ main, setMain ] = useState({ 
    MainText : false,
  }); 

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
          <Text>

          </Text>
        </View>
        <View style={styles.maintext}>
          <Text style={styles.text}>
            {main.MainText ? mainOpen : mainClose}
          </Text>
        </View> 
          <CustomButton 
          title = "SCAN"
          titleColor="#274046"
          buttonColor='#F2F2F2'
          onPress={() => navigation.navigate("Scanner")} 
          />
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
  },
  maintext:{
    flex: 9,
    justifyContent:"center",
    alignItems: 'center',
  },
  text:{
    color:"#fff",
    fontSize:100
  }
});