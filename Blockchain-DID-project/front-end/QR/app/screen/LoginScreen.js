//로그인화면
import React,{useState} from 'react';
import { StyleSheet,  Text, View, Image, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import {Octicons, Ionicons} from '@expo/vector-icons';
import axios from 'axios'

// var localhost = "172.30.1.27:8080"
var localhost = "52.78.25.173:8080"


export default function LoginScreen ({navigation}) {
    const [hidePassword, setHidePassword] = useState(true);
    const getAlert = (title, info)=>                           
    Alert.alert(title,info,[{
        text: "확인",                     
        style: "cancel"
    },
    ],{ cancelable: false });

    //서버로 회원정보 전달
    const Post = async (email,password)=> {
        await axios.post(`http://${localhost}/api/login`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            email: email,
            password :password
        }).then((res) => {
            //회원정보 존재
            if(res.data.message == true){
                navigation.reset({routes: [{name: 'PinNumSignup', value:email}]}) //스택을 초기화하여 드래그해도 다시 로그인페이지로 못오게함
            } 
            //회원정보 없음
            else if(res.data.message == false){
                getAlert("로그인실패","이메일, 패스워드를 다시 확인해주세요.")
            }
        })
        .catch((error)=> {
            console.log(error)
            console.log("로그인 클라이언트 오류")
        })
    }



    return (
        <SafeAreaView style={{flex:1, backgroundColor:"#ffffff"}}>
        <View style={styles.styledContainer}>
            <StatusBar style={"dark"}/>
            <View style={styles.InnerContainer}>
                <Image
                style={{height: 200, width: 200,}}
                resizeMode="cover"
                source={require('./../imge/img1.png')}/>
                <Text style={styles.PageTitle}>ArTo</Text>
                <Text style={styles.PageSubTitle}>Armor Toilet</Text>

                <Formik
                    initialValues={{email: '',password: '' }}
                    onSubmit={ async(values)=>{                        
                        Post(values.email, values.password)
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values})=>(
                        <View style={{width:90+"%"}}>
                            <MyTextInput
                                label = "이메일"
                                icon = "mail"
                                placeholder="whdqja1918@naver.com"
                                placeholderTextColor={"#9CA3AF"}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                            />
                            <MyTextInput
                                label = "비밀번호"
                                icon = "lock"
                                placeholder="* * * * * * * *"
                                placeholderTextColor={"#9CA3AF"}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <Text style={styles.MsgBox}></Text>
                            <TouchableOpacity style={styles.StyledButton} onPress={handleSubmit}>
                                <Text style={styles.ButtonText}>
                                    로그인
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.Line}></View>
                            <TouchableOpacity style={styles.StyledButton} onPress={()=>navigation.reset({routes: [{name: 'Signup'}]})}>
                                <Text style={styles.ButtonText}>
                                    회원가입
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.ExtraView}>
                                <TouchableOpacity style={styles.TextLink} onPress={()=>navigation.navigate("Find")}>
                                    <Text style={styles.TextLinkContent}>
                                    Email / Password 찾기
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

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props})=>{
    return(
        <View>
            {/* 아이콘 */}
            <View style={styles.LeftIcon}>
                <Octicons name={icon} size={30} color={"#021B79"}/>
            </View>
            {/* 입려창 상단 텍스트 */}
            <Text style={styles.InputLabel}>{label}</Text>
            {/*이메일 입력창 */}
            <TextInput style={styles.InputStyle} {...props}/>
            {/* 패스워드 입력창 눈아이콘*/}
            {isPassword &&(
                <TouchableOpacity style={styles.RightIcon} onPress={()=> setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={"#9CA3AF"}/>
                </TouchableOpacity>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    styledContainer: {
        flex: 2,
        padding: 25,
        backgroundColor: "#ffffff",
        marginTop:-50
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
        fontWeight: "500",
        color:"black",
        paddingTop:10

    },
    PageSubTitle:{
        color: "#1F2937",
        fontSize: 14,
        marginTop:-8,
        marginBottom : 20,
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
        top:38,
        position: "absolute",
        zIndex: 1
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
        justifyContent: "flex-end",
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