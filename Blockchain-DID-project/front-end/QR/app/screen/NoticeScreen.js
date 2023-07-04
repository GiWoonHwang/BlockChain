// 공지사항 화면
import React from 'react';
import { StyleSheet,  Text, View , SafeAreaView, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function NoticeScreen({navigation}) {

    return (
        <SafeAreaView style={{flex:1, backgroundColor:"#ffff"}}>
            <ScrollView style={styles.container}>
            <Text style={{fontSize:35, marginTop:100, marginBottom:40 ,fontWeight:"800"}}>공지사항</Text>
            <Text style={{fontSize:15,color:"gray",marginBottom:10 }}>2021년 08월 11일 등록</Text>
            <Text style={{fontSize:15,marginBottom:10 }}>안녕하세요.</Text>
            <Text style={{fontSize:15,marginBottom:10,lineHeight:21, marginRight: 30}}>
                ArTo를 이용해주시는 고객 여러분께 진심으로 감사드립니다.
                ArTo의 신원 인증방식이 통신사를 통한 인증방식으로 변경되었습니다.
                변경사항은 2021년 08월 21일 부터 적용됨을 알려드립니다.
            </Text>

            <View style={{ height : 0.5, width : 100+"%", backgroundColor:"#9CA3AF", marginVertical:10}}/>

            <View style={{marginTop:20, marginRight: 30, marginBottom:20}}>
                <View style={{ flexDirection:"row", alignItems:"center"}}>
                    <Ionicons name={'ellipse'} size={10} color={"black"}/>
                    <Text style={{marginLeft:10, fontWeight:"500", lineHeight:21, fontSize:16}}>블록체인, DID 기술을이용한 인증서비스</Text>
                </View>
                <Text style={{marginLeft:20, lineHeight:21}}>
                    DID를 이용하여 회원님의 필요정보만 확인하기 때문에 불필요한 회원의 
                    정보가 세어나가지 않습니다. ArTo는 언제나 회원님의 정보 보안에 힘쓰겠습니다.
                </Text>
            </View>

            <View style={{marginTop:20, marginRight: 30, marginBottom:20}}>
                <View style={{ flexDirection:"row", alignItems:"center"}}>
                    <Ionicons name={'ellipse'} size={10} color={"black"}/>
                    <Text style={{marginLeft:10, fontWeight:"500", lineHeight:21, fontSize:16}}>긍정적이며 안전한 환경 조성</Text>
                </View>
                <Text style={{marginLeft:20, lineHeight:21}}>
                    화장실 출입여부를 기록화하여 성범죄의 역추적에 용이 하게하며,
                    화장실 출입을 성별에 맞게 출입하게 하므로 성범죄, 치안 등 예방하여
                    모든 공중화장실의 대한 신뢰와 안전감을 제공하는 것을 목표로 하고 있습니다.
                </Text>
            </View>

            <View style={{marginTop:20, marginRight: 30, marginBottom:20}}>
                <View style={{ flexDirection:"row", alignItems:"center"}}>
                    <Ionicons name={'ellipse'} size={10} color={"black"}/>
                    <Text style={{marginLeft:10, fontWeight:"500", lineHeight:21, fontSize:16}}>공공 데이터포털을 이용한 화장실 위치제공</Text>
                </View>
                <Text style={{marginLeft:20, lineHeight:21}}>
                    ArTo가 설치되어있는 공중화장실의 위치를 빠르게 제공하고 있습니다. 현재 고객님의 위치에서
                    가장 가까운 공중화장실의 정보와 위치를 제공해 드립니다.
                </Text>
            </View>

            <View style={{marginTop:20, marginRight: 30, marginBottom:20}}>
                <View style={{ flexDirection:"row", alignItems:"center"}}>
                    <Ionicons name={'ellipse'} size={10} color={"black"}/>
                    <Text style={{marginLeft:10, fontWeight:"500", lineHeight:21, fontSize:16}}>서비스 이용에 대한 보장</Text>
                </View>
                <Text style={{marginLeft:20, lineHeight:21}}>
                    다양한 서비스 제공하기위해서 현재 시범적으로 일부 공중화장실에 설치되어있지만,
                    사업을 확장하여 전국의 모든 공중화장실에 설치되도록 각 도시 사업에 추진되도록 
                    발바쁘게 뛰어다니는 ArTo가 되겠습니다.
                </Text>
            </View>
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