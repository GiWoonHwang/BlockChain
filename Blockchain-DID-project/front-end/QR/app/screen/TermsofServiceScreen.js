//설정화면에서 개인정보 약간 동의 화면
import React from 'react';
import { StyleSheet,  Text, View , SafeAreaView, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function TermsofServiceScreen({navigation}) {

    return (
        <SafeAreaView style={{flex:1, backgroundColor:"#ffff"}}>
            <ScrollView style={styles.container}>
            <Text style={{fontSize:35, marginTop:100, marginBottom:40 ,fontWeight:"800"}}>이용 약관</Text>
            <Text style={{fontSize:15,marginBottom:20 }}>ArTo 오신 것을 환영합니다! </Text>
            <Text style={{fontSize:15,marginBottom:20,lineHeight:21, marginRight: 30}}>
            당사가 명시적으로 별도의 약관(본 약관이 아님)이 적용된다고 밝히지 않는 한 본 이용 약관(또는 '약관')이 
            귀하의 ArTo 사용에 적용되며 아래 설명된 ArTo 서비스('서비스')에 대한 정보를 제공합니다. 
            귀하가 ArTo 계정을 만들거나 ArTo 이용하는 경우, 귀하는 본 약관에 동의하는 것으로 간주됩니다. 
            이외의 서비스 약관은 이 서비스에 적용되지 않습니다. 
            </Text>

            <Text style={{fontSize:15,marginBottom:20,lineHeight:21, marginRight: 30}}>
            ArTo 서비스는 통신사에서 신원인증을 통해 귀하에게 제공하는 제품 중 하나입니다. 
            따라서 본 이용 약관은 귀하와 ArTo, 통신사 계약에 해당됩니다.
            </Text>
        
            <Text style={{fontSize:15,marginBottom:20,lineHeight:21, marginRight: 30}}>
            서비스를 이용해주신 고객님께 감사드립니다.
            </Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 100,
    backgroundColor:"#fff",
    marginLeft: 30,
  },

});