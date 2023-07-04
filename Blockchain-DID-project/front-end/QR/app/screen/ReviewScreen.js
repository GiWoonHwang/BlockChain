//로그인화면
import React,{useState, useEffect} from 'react';
import { StyleSheet,  Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView ,  Keyboard, TouchableWithoutFeedback   } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Dimensions } from 'react-native';
import {Octicons, Ionicons} from '@expo/vector-icons';
import axios from 'axios'

var localhost = "52.78.25.173:8080"
var starScroe =0 //사용자가 준 별점

//별점
function TitleAvgStar({props}){
    const [star, setStar] = useState(props);
    if(star==0){
        starScroe =0
        return(
            <View style={{flexDirection:"row", marginBottom:25}}>
                <TouchableOpacity onPress={()=>setStar(1)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#BBBBBB"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(2)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#BBBBBB"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(3)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#BBBBBB"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(4)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#BBBBBB"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(5)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#BBBBBB"}}/></TouchableOpacity>
            </View>
        )
    }
    if(star==1){
        starScroe =1
        return(
            <View style={{flexDirection:"row", marginBottom:25}}>
                <TouchableOpacity onPress={()=>setStar(1)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(2)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#BBBBBB"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(3)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#BBBBBB"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(4)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#BBBBBB"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(5)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#BBBBBB"}}/></TouchableOpacity>
            </View>
        )
    }
    if(star==2){
        return(
            <View style={{flexDirection:"row", marginBottom:25}}>
                <TouchableOpacity onPress={()=>setStar(1)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(2)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(3)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10,color:"#BBBBBB"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(4)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10,color:"#BBBBBB"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(5)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10,color:"#BBBBBB"}}/></TouchableOpacity>
            </View>
        )
    }
    if(star==3){
        starScroe =3
        return(
            <View style={{flexDirection:"row", marginBottom:25}}>
                <TouchableOpacity onPress={()=>setStar(1)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(2)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(3)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(4)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10,color:"#BBBBBB"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(5)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10,color:"#BBBBBB"}}/></TouchableOpacity>
            </View>
        )
    }
    if(star==4){
        starScroe =4
        return(
            <View style={{flexDirection:"row", marginBottom:25}}>
                <TouchableOpacity onPress={()=>setStar(1)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(2)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(3)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(4)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(5)}><Ionicons name={'star-outline'} style={{fontSize:30, fontWeight:"600",marginRight:10,color:"#BBBBBB"}}/></TouchableOpacity>
            </View>
        )
    }
    if(star==5){
        starScroe =5
        return(
            <View style={{flexDirection:"row", marginBottom:25}}>
                <TouchableOpacity onPress={()=>setStar(1)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(2)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(3)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(4)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
                <TouchableOpacity onPress={()=>setStar(5)}><Ionicons name={'star'} style={{fontSize:30, fontWeight:"600",marginRight:10, color:"#FEC701"}}/></TouchableOpacity>
            </View>
        )
    }
}

export default function ReviewScreen ({navigation, route}) {
    const [title, setTitle] = useState("불러오는중"); //화장실이름
    const [toiletNumber, setToiletNumber] =  useState(0); //화장실번호
    const [useremail, setUseremail] = useState(""); //화장실 사용자
    const [scannerNumber, setScannerNumber]  =  useState(0); //스캐너 번호

    const getAlert = (title, info)=>                           
    Alert.alert(title,info,[{
        text: "확인",                     
        style: "cancel"
    },
    ],{ cancelable: false });

    //이용내역 화면에서 전달받은 화장실 주소로 서버에보냄
    useEffect(() => {
        setTitle(route.params.props.name) //화장실이름으로 변경
        setToiletNumber(route.params.props.no) //화장실번호로 변경
        setUseremail(route.params.props.useremail) //사용자이메일로 변경
        setScannerNumber(route.params.props.scannerNumber)
    }, [route.params.props.address]);


    //서버로 회원정보 전달
    const Post = async (review)=> {
        await axios.post(`http://${localhost}/api/reviewupdate`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            toiletnumber:toiletNumber,
            useremail:useremail,
            ratings:starScroe,
            review:review,
            scannerNumber:scannerNumber,
        }).then((res) => {
            //회원정보 존재
            if(res.data.message == true){
                navigation.reset({routes: [{name:'Tab'}]}) 
                navigation.navigate("이용내역")
            } 
            //회원정보 없음
            else if(res.data.message == false){
                getAlert("리뷰작성 실패","다시 시도하여 주세요")
            }
        })
        .catch((error)=> {
            console.log(error)
            console.log("리뷰작성 클라이언트 오류")
        })
    }

    return (
        <SafeAreaView  style={{flex:1, backgroundColor:"#ffffff"}}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
            <View  style={styles.styledContainer} >
                <StatusBar style={"dark"}/>
                <View style={styles.InnerContainer}>
                    <Text style={{fontSize:25, fontWeight:"700", marginBottom:5}}>{title}</Text>
                    <TitleAvgStar props={0}/>
                    <Formik
                        initialValues={{review: ''}}
                        onSubmit={ async(values)=>{     
                            if(route.params.props)(
                                Post(values.review)
                            )             
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values})=>(
                            <View style={{width:90+"%"}}>
                                <MyTextInput
                                    placeholder="화장실에 대한 솔직한 리뷰를 작성해주세요."
                                    placeholderTextColor={"#9CA3AF"}
                                    onChangeText={handleChange('review')}
                                    onBlur={handleBlur('review')}
                                    value={values.review}
                                    multiline={true}
                                />
                                <TouchableOpacity style={styles.StyledButton} onPress={handleSubmit}>
                                    <Text style={styles.ButtonText}>
                                        제출
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </View >
            </View>
        </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props})=>{
    return(
            <View >
                <TextInput style={styles.InputStyle} {...props}/>
            </View>
    );
}

const styles = StyleSheet.create({
    styledContainer: {
        flex: 2,
        padding: 25,
        backgroundColor: "#ffffff",
    },
    InnerContainer: {
        flex: 1,
        width: 100+"%",
        alignItems:"center",
    },
    // 로그인시 입력창
    InputStyle:{
        backgroundColor: "#E5E7EB",
        paddingLeft :10,
        paddingRight: 10,
        borderRadius: 5,
        fontSize: 17,
        height: Dimensions.get('window').height/4,
        marginBottom: 20,
        color: "#1F2937",
        paddingTop:10,
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
});