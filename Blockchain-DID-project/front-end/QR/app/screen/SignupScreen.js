// 회원가입 화면
import React,{useState, useEffect} from 'react';
import { StyleSheet,  Text, View, TextInput, TouchableOpacity, Alert , SafeAreaView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import {Octicons, Ionicons} from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import Constants from 'expo-constants';
import axios from 'axios'
import { Dimensions } from 'react-native';

// var localhost = "172.30.1.27:8080"
var localhost = "52.78.25.173:8080"
const StatusBarHeights = Constants.statusBarHeight;
var Signup_1 = false; //실명인증 여부
var Signup_2 = false; //비밀번호 동일 여부
var Signup_3 = false; //모든정보 기입 여부
var arraygGender = ["male", "female"]

export default function SignupScreen({navigation}) {
    const [hidePassword, setHidePassword] = useState(false);
    const [emaildb, setEmaildb] = useState(true);
    const [didstate, setDidstate] = useState(true); //블록체인서버로 부터 did가 왔는지
    
    const getAlert = (title, info)=>                           
    Alert.alert(title,info,[{
        text: "확인",                     
        style: "cancel"
    },
    ],{ cancelable: false });
    
    
    useEffect(() => {
        if(didstate==false){
            console.log("로딩중")
        }
    },[didstate]);

    useEffect(() => {
        if(emaildb==false){
            getAlert("이메일확인","이미 존재하는 회원의 이메일입니다.")
            setEmaildb(true)
        }
    },[emaildb]);

    //서버로 회원정보 전달
    const Post = async (name, email, gender, phone, password)=> {
        await axios.post(`http://${localhost}/api/signup`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            name: name,
            email: email,
            gender: gender,
            phone : phone,
            password :password
        }).then((res) => {
            //회원가입 성공
            if(res.data.message == true){
                setDidstate(true) //did정보 받아오기 끝
                setEmaildb(true)
                navigation.reset({routes: [{name: 'PinNumSignup', value: email}]}) //스택을 초기화하여 드래그해도 다시 로그인페이지로 못오게함
            }
            //회원가입 실패
            else if(res.data.message == false){
                setDidstate(true) //did정보 받아오기 끝
                setEmaildb(false)
            }
        })
        .catch((error)=> {
            console.log(error)
            console.log("회원가입 클라이언트 오류")
        })
    }

    return(
        <SafeAreaView style={{flex:1, backgroundColor:"#ffffff"}}>
{didstate?<Text/> :<View style={{
            flex:1, position:"absolute", zIndex:3, backgroundColor:"rgba(0, 0, 0, .6)", width:100, height:Dimensions.get('window').height, width:Dimensions.get('window').width
        }}>
            <View style={{
            alignItems:"center",
            justifyContent:"center",
            backgroundColor:"#fff", 
            shadowOpacity: 0.75,
            shadowRadius: 7,
            shadowColor: 'gray',
            shadowOffset: { height: 10, width: 3 },
            borderRadius:10,
            top:Dimensions.get('window').height-550,
            left:Dimensions.get('window').width-300,
            width:200,
            height:180,
            }}>
                <Progress.CircleSnail color={['#021B79']} size={60} thickness={3}/>
                <Text style={{marginTop:20}}>로딩중</Text>
            </View>
        </View>}

        <View style={styles.styledContainer}>
            
            <StatusBar style={"dark"}/>
            <View style={styles.InnerContainer}>
                <Text style={styles.PageTitle}>회원가입</Text>
                <Text style={styles.PageSubTitle}>ArTo</Text>
                <Formik
                    initialValues={{name:'', email:'', phone:'', password:'', confirmPassword:'' }}
                    onSubmit={ (values)=>{ // 가입클릭시
                        var arryNumber = Math.floor (( Math.random() * 2 ));
                        var gender = arraygGender[arryNumber];
                        //결과값 오브젝트를 배열로 변환함
                        let result_map = Object.keys(values).map(function (key) { 
                            return [String(key), values[key]]; 
                        });
                        var count =0 //정보입력 갯수
                        for(var i=0; i<result_map.length; i++){
                            if(result_map[i][1]){
                                count= count+1
                            }
                            if(count==5){
                                Signup_3 =true //모든정보 기입완료 
                            }
                        }

                        //비밀번호의 길이와 동일한지 확인
                        if(values.password.length>=5 && values.confirmPassword.length>=5){
                            if(values.password == values.confirmPassword){
                                Signup_2 =true 
                            }
                        }

                        //모든 정보를 입력하지 않으면
                        if(count <5){
                            getAlert("정보입력","모든 정보를 입력해 주세요.")
                        }
                        //인증 안하고 가입하기 누르면
                        else if(Signup_1 == false){
                            getAlert("실명인증","휴대전화로 본인인증부탁 드립니다.")
                        }
                        //비밀번호가 틀리면 
                        else if(values.password != values.confirmPassword){
                            getAlert("비밀번호","비밀번호가 동일하지 않습니다.")
                        }
                        //비밀번호길이가 5자 이하일 경우 
                        else if(values.password.length<5 || values.confirmPassword.length<5){
                            getAlert("비밀번호","비밀번호 길이가 5자 이상인지 확인해주세요.")
                        }
                        //회원가입조건 완료(서버에 보냄)
                        else if(Signup_1 && Signup_2 && Signup_3){
                            setDidstate(false)
                            Post(values.name, values.email, gender, values.phone, values.password) //서버에 post형식으로 전달
                        }
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values})=>(
                        <View style={{width:90+"%"}}>
                            <MyTextInput
                                label = "이름"
                                icon = "person"
                                placeholder="강동원"
                                placeholderTextColor={"#9CA3AF"}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                            />

                            <MyTextInput
                                label = "이메일"
                                icon = "mail"
                                placeholder="kang@gmail.com"
                                placeholderTextColor={"#9CA3AF"}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                            />

                            <MyTextInput
                                label = "휴대전화"
                                icon = "device-mobile"
                                placeholder="01044250544"
                                placeholderTextColor={"#9CA3AF"}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                value={values.phone}
                                isDate={true}
                            />

                            <MyTextInput
                                label = "PASSWORD"
                                icon = "lock"
                                placeholder="* * * * * * * *  (5자 이상)"
                                placeholderTextColor={"#9CA3AF"}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={!hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />

                            <MyTextInput
                                label = "비밀번호 확인"
                                icon = "lock"
                                placeholder="* * * * * * * *  (5자 이상)"
                                placeholderTextColor={"#9CA3AF"}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                secureTextEntry={!hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <Text style={styles.MsgBox}></Text>
                            <TouchableOpacity style={styles.StyledButton} onPress={handleSubmit}>
                                <Text style={styles.ButtonText}>
                                    가입하기
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.Line}></View>
                            <View style={styles.ExtraView}>
                                <Text style={styles.ExtraText}>
                                    Already have an account?
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

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, isDate, ...props})=>{
    const [text, setText] = useState(true)
    const [ temp, setTemp ] = useState({ 
        title: false, //인증되면 체크 아이콘으로 변경
    });

    //경고창
    const getAlert = (title, info, bool, inputText)=>                           
    Alert.alert(title,info,[{
        text: "확인",
        onPress: () => {Signup_1=bool, setText(inputText), setTemp({...temp,   title : bool})},                     
        style: "cancel"
    },
    ],{ cancelable: false });


    //휴대혼 번호 서버로 인증
    const Postcertification = async (phoneNumber)=> {
        await axios.post(`http://${localhost}/api/certification`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            phone : phoneNumber,
        }).then((res) => {
            if(res.data.message == true){
                getAlert("실명인증", "인증완료", true, false)
            } else if(res.data.message == false){
                getAlert("실명인증", "이미 가입된 번호입니다.", false, true)
            }
        })
        .catch((error)=> {
            console.log(error)
            console.log("휴대폰인증 클라이언트 오류")
        })
    }    

    // 인증버튼
    const certification= ()=>{
        if(isDate){
            var phone = props.value //휴대폰번호
            var phoneLength = phone.length //휴대전화 길이
            var phoneNumber = Number(phone) //휴대전화를 숫자로 변환
            var phoneDecimalPoint =  Number.isInteger(phoneNumber) //phoneNumber가 정수면 true, 아니면 false
             // 휴대전화가 맞는지 or 틀린지
            if(phoneNumber&&phoneDecimalPoint&&phoneLength==11){
                Postcertification(phone)
            }else{
                getAlert("실명인증", "인증실패", false, true)
            }
        }
    }

    return(
        <View>
            {/* 아이콘 */}
            <View style={styles.LeftIcon}>
                <Octicons name={icon} size={30} color={"#021B79"}/>
            </View>
            {/* 입려창 상단 텍스트 */}
            <Text style={styles.InputLabel}>{label}</Text>
            {/*입력창 */}
            {!isDate && <TextInput style={styles.InputStyle} {...props}/>}
            {isDate && (
                <View style={{flexDirection:"row"}} >
                    <TextInput style={styles.PhoneInputStyle} editable={text} {...props}/>
                    <TouchableOpacity style={styles.PhoneButtonStyle} onPress={certification}>
                        <Text style={{color:"#ffffff", fontSize:16, fontWeight:"300" }}>
                            {temp.title? <Octicons name={"check"} size={30} color={"#38ef7d"}/> : "인증"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            {/* 패스워드 입력창 눈아이콘*/}
            {isPassword &&(
                <TouchableOpacity style={styles.RightIcon} onPress={()=> setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye' : 'md-eye-off'} size={30} color={"#9CA3AF"}/>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    styledContainer: {
        flex: 1,
        padding: 25,
        backgroundColor: "#ffffff",
        marginTop: -50,
        zIndex:-1
    },
    InnerContainer: {
        flex: 1,
        width: 100+"%",
        alignItems:"center",
        justifyContent: "center"
    },
    PageTitle:{
        fontSize: 35,
        textAlign: "center",
        fontWeight: "900",
        color:"black",
        paddingTop:10,
        marginBottom:10,
    },
    PageSubTitle:{
        color: "#1F2937",
        fontSize: 14,
        marginTop:-8,
        marginBottom : 30,
        letterSpacing:1
    },
    // 로그인시 입력창
    InputStyle:{
        backgroundColor: "#E5E7EB",
        padding: 15,
        paddingLeft :55,
        paddingRight: 55,
        borderRadius: 5,
        fontSize: 16,
        height: 60,
        marginVertical:3,
        marginBottom: 10,
        color: "#1F2937"
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
    RightIcon:{
        // TouchableOpacity
        right:15,
        top:30,
        position: "absolute",
        zIndex: 1,

    },
    StyledButton:{
         // TouchableOpacity
        padding: 15,
        backgroundColor: "#021B79",
        justifyContent: "center",
        alignItems:"center",
        borderRadius: 5,
        marginVertical: 5,
        height: 60
    },
    ButtonText :{
        //text
        color: "#ffffff",
        fontSize:16
    },
    MsgBox :{
        //text
        textAlign:"center",
        fontSize:13,
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
    }
});


//   export const Colors = {
//     primary: "#ffffff",
//     secondary: "#E5E7EB",
//     tertiary: "#1F2937",
//     darkLight : "#9CA3AF",
//     brand : "#6D28D9",
//     green : "#10B981",
//     red : "#EF4444"
// };