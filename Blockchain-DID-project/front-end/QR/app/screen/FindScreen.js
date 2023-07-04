// 비밀번호/ 이메일 찾기 화면
import React,{useState, useEffect} from 'react';
import { StyleSheet,  Text, View, TextInput, TouchableOpacity, Alert , SafeAreaView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import {Octicons, Ionicons} from '@expo/vector-icons';
import axios from 'axios'
var localhost = "52.78.25.173:8080"

export default function FindScreen({navigation}) {

    return(
        <SafeAreaView style={{flex:1, backgroundColor:"#ffffff"}}>
        <View style={styles.styledContainer}>
            <StatusBar style={"dark"}/>
            <View style={styles.InnerContainer}>
                <Formik
                    initialValues={{email:'', phone:''}}
                    onSubmit={ (values)=>{}}
                >
                    {({handleChange, handleBlur, handleSubmit, values})=>(
                        <View style={{width:90+"%"}}>
                            
                                <MyTextInput
                                    label = "휴대전화"
                                    icon = "device-mobile"
                                    placeholder=" "
                                    placeholderTextColor={"#9CA3AF"}
                                    onChangeText={handleChange('phone')}
                                    onBlur={handleBlur('phone')}
                                    value={values.phone}
                                    isDate={true}
                                />
                                <MyTextInput
                                    label = "이메일"
                                    icon = "mail"
                                    placeholder=" "
                                    placeholderTextColor={"#9CA3AF"}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                    isDate={false}
                                />

                            <View style={styles.Line}></View>
                            <View style={styles.ExtraView}>
                                <Text style={styles.ExtraText}>
                                    Did you find the account?
                                </Text>
                                <TouchableOpacity style={styles.TextLink} onPress={()=>navigation.navigate("Login")}>
                                    <Text style={styles.TextLinkContent}>
                                        Login
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </View >
        </View>
        </SafeAreaView>
    );
}

const MyTextInput = ({label, icon, isDate, ...props})=>{
    const [text, setText] = useState("찾기");

    //경고창
    const getAlert = (title, info)=>                           
    Alert.alert(title,info,[{
        text: "확인",                   
        style: "cancel"
    },
    ],{ cancelable: false });

    //전화번호를 서버에보냄
    const PhonePost = async (phoneNumber)=> {
        await axios.post(`http://${localhost}/api/emailfind`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            phone: phoneNumber,
        }).then((res) => {
            if(res.data.message){
                
                setText(": "+res.data.message.email)
            }else if(res.data.message==false){
                getAlert("오류", "존재하지 않은 회원입니다.")
            }
        })
        .catch((error)=> {
            console.log(error)
            console.log("이메일 찾기 클라이언트 오류")
        })
    } 

    //이메일을 서버에보냄
    const EmailPost = async (email)=> {
        await axios.post(`http://${localhost}/api/passwordfind`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            email: email,
        }).then((res) => {
            if(res.data.message==true){
                getAlert("전송완료", "작성해주신 메일주소로 비밀번호를 전송하였습니다.")
            }else if(res.data.message==false){
                getAlert("전송실패", "존재하지 않는 이메일 입니다.")
            }
        })
        .catch((error)=> {
            console.log(error)
            console.log("비밀번호 찾기 클라이언트 오류")
        })
    } 

    //확인버튼
    const certification= ()=>{
        //이메일 찾기
        if(isDate){
            var phone = props.value //휴대폰번호
            var phoneNumber = Number(phone) //휴대전화를 숫자로 변환
            var phoneDecimalPoint =  Number.isInteger(phoneNumber) //phoneNumber가 정수면 true, 아니면 false
            if(!phoneNumber || phoneDecimalPoint==false){
                getAlert("휴대전화", "올바른 번호가 아닙니다.")
            }else if(phoneNumber&&phoneDecimalPoint==true){
                PhonePost(props.value.toString())
            }
        } 
        //비밀번호 찾기
        else if(!isDate){
            var email = props.value
            EmailPost(email)
        }
    }

    return(
        <View style={styles.box}>
            <Text style={styles.PageTitle}>{isDate?`이메일 ${text}`:"비밀번호 찾기"}</Text>
        <View>
            <View style={styles.LeftIcon}>
                <Octicons name={icon} size={30} color={"#021B79"}/>
            </View>
            <Text style={styles.InputLabel}>{label}</Text>
                <View style={{flexDirection:"row"}} >
                    <TextInput style={styles.PhoneInputStyle} {...props}/>
                    <TouchableOpacity style={styles.PhoneButtonStyle} onPress={certification}>
                        <Text style={{color:"#ffffff", fontSize:16, fontWeight:"300" }}>
                            확인
                        </Text>
                    </TouchableOpacity>
                </View>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    styledContainer: {
        flex: 1,
        padding: 25,
        backgroundColor: "#ffffff",
        marginTop: -50
    },
    InnerContainer: {
        flex: 1,
        width: 100+"%",
        alignItems:"center",
        justifyContent: "center"
    },
    PageTitle:{
        fontSize: 25,
        fontWeight: "700",
        color:"black",
        paddingTop:10,
        marginBottom:20,
        marginTop:20,
        textAlign:"center",
        alignItems:"center",
        justifyContent:"center"
    },
    PhoneInputStyle:{
        backgroundColor: "#E5E7EB",
        padding: 15,
        paddingLeft :55,
        paddingRight: 55,
        borderRadius: 5,
        fontSize: 16,
        height: 60,
        marginVertical:3,
        marginBottom: 10,
        color: "#1F2937",
        width:75+"%"
    },
    PhoneButtonStyle:{
        flex:1,
        backgroundColor: "#021B79",
        marginLeft: 20,
        borderRadius: 10,
        fontSize: 16,
        height: 60,
        marginVertical:3,
        marginBottom: 10,
        width: 20 +"%",
        alignItems: "center",
        justifyContent: "center"
    },
    InputLabel:{
        // text
        color: "#1F2937",
        fontSize: 13,
        textAlign: "left",
    },
    LeftIcon:{
        // view
        left:15,
        top:30,
         // top:38,
        position: "absolute",
        zIndex: 1
    },
    ButtonText :{
        //text
        color: "#ffffff",
        fontSize:16
    },
    Line : {
        //view
        height : 1,
        width : 100+"%",
        backgroundColor: "#9CA3AF",
        marginVertical:10
    },
    ExtraView:{
        //view
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    ExtraText:{
        //text
        justifyContent: "center",
        alignContent: "center",
        color : "#1F2937",
        fontSize: 15,
    },
    TextLink:{
        // TouchableOpacity
        justifyContent: "center",
        alignItems: "center",
        marginLeft:10
    },
    TextLinkContent:{
        //text
        color: "#0575E6",
        fontSize : 15,
    },
    box:{
        width:100+"%",
        backgroundColor:"red",
        marginBottom:30,
        justifyContent:"center",
        padding:10,
        paddingBottom:15,
        borderRadius: 16,
        backgroundColor:"#fff",
        shadowOpacity: 0.75,
        shadowRadius: 7,
        shadowColor: 'gray',
        shadowOffset: { height: 5, width: 3 },
    }
});

