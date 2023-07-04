// 회원 정보 수정 화면
import React,{useState, useEffect} from 'react';
import { StyleSheet,  Text, View, TextInput, TouchableOpacity, Alert , SafeAreaView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import {Octicons, Ionicons} from '@expo/vector-icons';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants';
import axios from 'axios'

var localhost = "52.78.25.173:8080"
const StatusBarHeights = Constants.statusBarHeight;
var Signup_1 = false; //실명인증 여부

export default function ModifyInformationScreen({navigation}) {
    const [hidePassword, setHidePassword] = useState(false);
    const [getemail, setGetemail] = useState("");
    const [getname, setName] = useState("");
    const [getphone, setPhone] = useState("");

    //경고창 함수
    const getAlert = (title, info)=>                           
    Alert.alert(title,info,[{
        text: "확인",                     
        style: "cancel",
    },
    ],{ cancelable: false });
    
    //회원정보 수정하기위한 local의 저장된 회원 email가져오기
    useEffect(() => {
        AsyncStorage.getAllKeys((err, keys) => {
            var key = keys[0] // 로컬스토리지 첫번째key
            //key가 있으면 이메일 찾아야짐
            if(key){
                AsyncStorage.getItem(key, (err,result) =>{
                    result=result.split(", ")
                    var email = result[1]
                    setGetemail(email)
                    Post_1(email)
                })
            }
            //key가 없으면 오류임
            else if(key==null){
                getAlert("오류","재로그인 부탁드립니다.")
                navigation.reset({routes: [{name: 'Login'}]})  
            }
        });
    },[]);

    //서버로 회원이메일 전송
    const Post_1 = async (email)=> {
        await axios.post(`http://${localhost}/api/userinfo`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            email: email,
        }).then((res) => {
            //회원정보 가져오기
            if(res.data.message){
                setName(res.data.message.name)
                setPhone(res.data.message.phone)
            }
            //회원정보 가져오기 실패
            else if(res.data.message == false){
                console.log("없음")
            }
        })
        .catch((error)=> {
            console.log(error)
            console.log(" 클라이언트 오류")
        })
    }

        //서버로 회원이메일 전송
        const Post_2 = async (email, name, phone, password)=> {
            await axios.post(`http://${localhost}/api/userinfoupdate`, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                email: email,
                name:name,
                phone: phone,
                password: password,
            }).then((res) => {
                //회원정보 수정
                if(res.data.message == true){
                    navigation.reset({routes: [{name: 'Tab'}]})
                }
                //회원정보 수정 실패
                else if(res.data.message == false){
                    getAlert("오류","재로그인 부탁드립니다.")
                    AsyncStorage.clear() //로컬스토리지의 모든값 제거
                    navigation.reset({routes: [{name: 'Login'}]}) //로그인페이지로 이동시킴
                }
            })
            .catch((error)=> {
                console.log(error)
                console.log("정보수정 클라이언트 오류")
            })
        }

    return(
        <SafeAreaView style={{flex:1, backgroundColor:"#ffffff"}}>
        <View style={styles.styledContainer}>
            <StatusBar style={"dark"}/>
            <View style={styles.InnerContainer}>
                <Text style={styles.PageTitle}>정보 수정</Text>
                <Formik
                    initialValues={{name:'', email:'', phone:'', password:'', confirmPassword:'' }}
                    onSubmit={ (values)=>{ 
                        var inputphone= false //휴대폰 입력여부
                        var inputpassword =false //비밀번호 입력여부
                        //결과값 오브젝트를 배열로 변환함
                        let result_map = Object.keys(values).map(function (key) { 
                            return [String(key), values[key]]; 
                        });
                        var count =0 //정보입력 갯수
                        //입력한 항목의 갯수를 샌다.
                        for(var i=0; i<result_map.length; i++){
                            if(result_map[i][1]){
                                count= count+1
                            }
                        }

                        //입력한 정보 없으면
                        if(count==0){
                            getAlert("수정완료", "변경된 항목이 없습니다.")
                        }
                        //입력한 정보가 있을경우
                        else if(count>0){

                            //휴대폰입력창 입력창 비우면
                            if(!values.phone){
                                inputphone =true; //휴대폰통과
                            }
                            //휴대폰입력창 입력시
                            else if(values.phone){
                                //휴대폰 인증 실패
                                if(Signup_1==false){
                                    getAlert("실명인증","휴대전화로 본인인증부탁 드립니다.")
                                }
                                 //휴대폰 인증 성공
                                else if(Signup_1==true){
                                    inputphone =true; //휴대폰통과
                                }
                            }

                            //비밀번호, 확인 입력창 비우면
                            if(!values.password && !values.confirmPassword){
                                inputpassword =true //비밀번호통과
                            }
                            //비밀번호, 확인 입력시
                            else if(values.password || values.confirmPassword){
                                //비밀번호, 확인 길이와 값이 동일한지 확인
                                if(values.password.length>=5 && values.confirmPassword.length>=5){
                                    if(values.password == values.confirmPassword){
                                        inputpassword = true //비밀번호통과
                                    }
                                }
                                // //비밀번호가 틀리면 
                                if(values.password != values.confirmPassword){
                                    getAlert("비밀번호","비밀번호가 동일하지 않습니다.")
                                }
                                //비밀번호길이가 5자 이하일 경우 
                                else if(values.password.length<5 || values.confirmPassword.length<5){
                                    getAlert("비밀번호","비밀번호 길이가 5자 이상인지 확인해주세요.")
                                }
                            }
                            if(inputphone ==true && inputpassword==true){
                                Post_2(getemail, values.name, values.phone, values.password)
                            }
                        }
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values})=>(
                        <View style={{width:90+"%"}}>
                            <MyTextInput
                                label = "이메일"
                                icon = "mail"
                                placeholder="kang@gmail.com"
                                placeholderTextColor={"#9CA3AF"}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={getemail}
                                keyboardType="email-address"
                                isEmail={true}
                            />

                            <MyTextInput
                                label = "이름"
                                icon = "person"
                                placeholder={getname}
                                placeholderTextColor={"#9CA3AF"}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                            />

                            <MyTextInput
                                label = "휴대전화"
                                icon = "device-mobile"
                                placeholder={getphone}
                                placeholderTextColor={"#9CA3AF"}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                value={values.phone}
                                isDate={true}
                            />

                            <MyTextInput
                                label = "비밀번호"
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
                                    변경
                                </Text>
                            </TouchableOpacity>

                        </View>
                    )}
                </Formik>
            </View >
        </View>
        </SafeAreaView>
    );
}

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, isDate, isEmail, ...props})=>{
    const [text, setText] = useState(true)
    const [ temp, setTemp ] = useState({ 
        title: false, //인증되면 체크 아이콘으로 변경
    });

    //이메일 값은 변경 불가
    useEffect(() => {
        if(isEmail==true){
            setText(false)
        }
    },[isEmail]);

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
            <View style={styles.LeftIcon}>
                <Octicons name={icon} size={30} color={"#021B79"}/>
            </View>
            <Text style={styles.InputLabel}>{label}</Text>
            {!isDate && <TextInput style={styles.InputStyle} {...props} editable={text}/>}
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
        marginTop: -50
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
        marginBottom:40,
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
    }
});

