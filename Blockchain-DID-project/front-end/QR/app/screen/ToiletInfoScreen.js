// 화장실리뷰/정보 화면
import React, { useState, useEffect } from 'react';
import { StyleSheet,  Text, View , TouchableOpacity, ScrollView, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import MapView, {PROVIDER_GOOGLE, Marker }from 'react-native-maps';
import { Dimensions } from 'react-native';
import axios from "axios"
import * as Progress from 'react-native-progress';
var localhost = "52.78.25.173:8080"


function Loding(){
    return(
        <View style={{flex:1, justifyContent:"center", alignItems: 'center',}}>
            <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
            <Progress.CircleSnail color={['#021B79']} size={80} thickness={5}/>
            </View>
        </View>
    )
}

//별점
function TitleAvgStar({props}){
    if(props==0){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
            </View>
        )
    }
    if(props==1){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
            </View>
        )
    }
    if(props==2){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
            </View>
        )
    }
    if(props==3){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
            </View>
        )
    }
    if(props==4){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
            </View>
        )
    }
    if(props==5){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:20, fontWeight:"600",marginRight:10, color:"#FEC701"}}/>
            </View>
        )
    }
}

//별점
function AvgStar({props}){
    if(props==0){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
            </View>
        )
    }
    if(props==1){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
            </View>
        )
    }
    if(props==2){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
            </View>
        )
    }
    if(props==3){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
            </View>
        )
    }
    if(props==4){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
            </View>
        )
    }
    if(props==5){
        return(
            <View style={{flexDirection:"row"}}>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
                <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#FEC701"}}/>
            </View>
        )
    }
}

export default function ToiletInfoScreen({navigation, route}) {
    const [reviewLoading, setReviewLoading] = useState(true); //리뷰정보 로딩
    const [loading, setLoding] = useState(true); //페이지로딩
    const [arry, setArry] = useState([]); //화장실정보 
    const [review, setReview] = useState(); //리뷰 내용 
    const [reviewCount, setReviewCount] = useState(0); //리뷰 갯수 
    const [review_1, setReview_1] = useState("black"); //최신순 색상
    const [review_2, setReview_2] = useState("#8F8F8F"); //별점높은순 색상
    const [review_3, setReview_3] = useState("#8F8F8F"); //별점낮은순 색상
    const [avg, setAvg] = useState(0); //리뷰 갯수 
    const [star_1, setStar_1] = useState(0); //별점 1 갯수
    const [star_2, setStar_2] = useState(0); //별점 2 갯수
    const [star_3, setStar_3] = useState(0); //별점 3 갯수
    const [star_4, setStar_4] = useState(0); //별점 4 갯수
    const [star_5, setStar_5] = useState(0); //별점 5 갯수
    const [star_Arry, setStar_star_Arry] = useState([]); //각 별점을 배열에 담기
    const [_max, setMax] = useState(0); //각 별점중 가장 많은 갯수
    const [_maxLoading, set_maxLoading] = useState(true); //별점의 갯수와 많은 별점을 가져오면


    //이용내역 화면에서 전달받은 화장실 주소로 서버에보냄
    useEffect(() => {
        (async()=>{ 
            var max = 0
            for(var i=0; i<star_Arry.length; i++){
                if(star_Arry[i]>=max){
                    max = star_Arry[i]
                    setMax(star_Arry[i])
                }
            } 
        })();
        set_maxLoading(false) //별점 최고값 가져오기 완료 
    }, [star_Arry.length==5]);


    //경고창
    const getAlert = (title, info)=>                           
    Alert.alert(title,info,[{
        text: "확인",                     
        style: "cancel",
        onPress:()=>navigation.navigate("이용내역"),                     
    },
    ],{ cancelable: false });

    //이용내역 화면에서 전달받은 화장실 주소로 서버에보냄
    useEffect(() => {
        (async()=>{ 
            await axios.post(`http://${localhost}/api/toiletinfo`, {
            headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            },
            address : route.params.props.address, //이용내역에서 보내온 화장실 주소
            }).then((res) => {
                if(res.data.message){
                    arry.push(res.data.message) //화장실정보를 배열에 담음
                    Post_ratings(arry[0][0].NO,1)
                    Post_ratings(arry[0][0].NO,2)
                    Post_ratings(arry[0][0].NO,3)
                    Post_ratings(arry[0][0].NO,4)
                    Post_ratings(arry[0][0].NO,5)
                    Post(arry[0][0].NO,1) //서버로 화장실정보 넘버를 인자로 보냄
                    setLoding(false) //첫 화면출력     
                }
                else if(res.data.message==false){
                    getAlert("오류발생","화장실 정보를 찾을 수 없습니다.")
                }
            })
            .catch((error)=> {
                console.log(error)
                console.log("화장실 위치 클라이언트 오류")
            })
        })();
    }, [route.params.props.address]);

    //서버로 리뷰정보 가져오기
    const Post = async (toiletnumber,typeNum)=> {
        if(typeNum ==1){
            setReview_1("black")
            setReview_2("#8F8F8F")
            setReview_3("#8F8F8F")
        }else if(typeNum ==2){
            setReview_1("#8F8F8F")
            setReview_2("black")
            setReview_3("#8F8F8F")
        }else if(typeNum ==3){
            setReview_1("#8F8F8F")
            setReview_2("#8F8F8F")
            setReview_3("black")
        }
        await axios.post(`http://${localhost}/api/review`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            toiletnumber: toiletnumber,
            typeNum:typeNum,
        }).then((res) => {
        if(res.data.message){
            var ratings = 0
            setReview(res.data.message) //모든리뷰를 리스트로 뿌리기위해
            setReviewCount(res.data.message.length) //총리뷰갯수
            for(var i=0; i<res.data.message.length; i++){
                ratings = res.data.message[i].ratings +ratings //모든별점합계
            }
            setAvg(ratings/res.data.message.length)//별점의 평균값
            setReviewLoading(false) //리뷰불러오기 완료
        }
        })
        .catch((error)=> {
            console.log(error)
            console.log("이용내역 클라이언트 오류")
        })
    }

        //서버로 각별점의 갯수를 가져옴
        const Post_ratings = async (toiletnumber,ratings)=> {
            await axios.post(`http://${localhost}/api/review`, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                toiletnumber: toiletnumber,
                ratings:ratings,
            }).then((res) => {
            if(res.data.message){
                star_Arry.push(res.data.message[0].count)
                if(ratings==1){
                    setStar_1(res.data.message[0].count)
                }
                if(ratings==2){
                    setStar_2(res.data.message[0].count)
                }
                if(ratings==3){
                    setStar_3(res.data.message[0].count)
                }
                if(ratings==4){
                    setStar_4(res.data.message[0].count)
                }
                if(ratings==5){
                    setStar_5(res.data.message[0].count)
                }
            }
            })
            .catch((error)=> {
                console.log(error)
                console.log("이용내역 클라이언트 오류")
            })
        }

    //이메일 마스킹
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
            if(i+3>index && i<index){
                originName[i] = '*';
            }else if(index!=0&&index<=i){
                originName[i] = '';
            }
        });
        var joinName = originName.join();
        return(joinName.replace(/,/g, ''))
    };

    //제목 글자수 제한
    const maskingName = (strName)=> {
        var originName = strName.split('');
        if (strName.length > 14) {
            originName.forEach(function(name, i) {
                if (i==15){
                    originName[15] = '...';
                }else if(i>15){
                    originName[i] = '';
                }
            });
            var joinName = originName.join();
            return(joinName.replace(/,/g, ''))
        } else{
            var joinName = originName.join();
            return(joinName.replace(/,/g, ''))
        }
    };
    
    return (
        <View style={styles.container}>
            {loading?<Loding/>:(
            <ScrollView>
                <View style={{ flex:1,zIndex:-1, alignItems: 'center',justifyContent: "flex-start" }} pointerEvents="none">
                    <MapView 
                        style={{width:Dimensions.get('window').width, height:300}} 
                        provider={PROVIDER_GOOGLE} 
                        initialRegion={{
                            longitude: Number(arry[0][0].longitude),
                            latitude: Number(arry[0][0].latitude),
                            latitudeDelta: 0.0052,
                            longitudeDelta: 0.0051,
                        }}
                    >
                    <Marker coordinate={{longitude: Number(arry[0][0].longitude), latitude: Number(arry[0][0].latitude)}} title="현재위치" />
                    </MapView>
                    <View style={styles.toiletinfo}>
                        <View style={{flexDirection:"row", justifyContent:"flex-start"}}>
                            <Ionicons name={'ribbon'} style={{fontSize:16, fontWeight:"600", color:"#7E7E7E"}}/>
                            <Text style={{color:"#7E7E7E"}}> {arry[0][0].type} </Text>
                            <Ionicons name={'ribbon'} style={{fontSize:16, fontWeight:"600",color:"#7E7E7E"}}/>
                        </View>
                        <Text style={{fontSize:27, fontWeight:"700",marginBottom:10, marginTop:10, alignItems:"center"}}>{maskingName(arry[0][0].name)}</Text>
                        <View style={{flexDirection:"row",alignItems:"center", marginBottom:10}}>
                            {
                            reviewLoading?
                                <View style={{flexDirection:"row"}}>
                                    <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                                    <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                                    <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                                    <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                                    <Ionicons name={'star-outline'} style={{fontSize:20, fontWeight:"600",marginRight:10}}/>
                                </View>
                                :<TitleAvgStar props={parseInt(avg)}/>
                            }
                            <Text style={{fontWeight:"400", fontSize:20}}>{avg.toFixed(1)}</Text>
                        </View>
                        <View style={{flexDirection:"row", alignItems:"center"}}  pointerEvents="true">
                            <Ionicons name={'location'} style={{fontSize:20, fontWeight:"600",marginRight:6, color:"#E94336"}}/>
                            <Text>{arry[0][0].address}</Text>
                        </View>
                        <View style={{flexDirection:"row", alignItems:"center", margin:5}}>
                            <Ionicons name={'call'} style={{fontSize:20, fontWeight:"600",marginRight:6, color:"#38ef7d"}}/>
                            <Text>{arry[0][0].phone}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex:1,alignItems:"center", backgroundColor:"#ffff"}}>
                    <View style={{width:Dimensions.get('window').width, alignItems:"center", borderBottomColor:"#D8D8D8",borderBottomWidth:1}}>
                        <Text style={{padding:10, fontSize:20, fontWeight:"400"}}>리뷰</Text>
                    </View>
                    <View style={{width:Dimensions.get('window').width, flexDirection:"row", alignItems:"center",justifyContent:"space-evenly", padding:20}}>
                        <View style={{alignItems:"center"}}>
                            <Text style={{fontSize:35, fontWeight:"400", marginBottom:10}}>{avg.toFixed(1)}</Text>
                            <View style={{flexDirection:"row",alignItems:"center", marginBottom:10}}>
                                    {
                                    reviewLoading?
                                        <View style={{flexDirection:"row"}}>
                                            <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                                            <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                                            <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                                            <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                                            <Ionicons name={'star'} style={{fontSize:16, marginRight:3, color:"#D7D7D7"}}/>
                                        </View>
                                        :<AvgStar props={parseInt(avg)}/>
                                    }
                            </View>
                        </View>
                        {_maxLoading?    
                            <View style={{alignItems:"center"}}>
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginBottom:4}}>
                                    <Text style={{fontWeight:"500"}}>5점</Text>
                                    <View style={{width:150, height:3, backgroundColor:"#EBEBEB", marginLeft:5, marginRight:5, borderRadius:5}}>
                                        <View style={{width:0, height:3, backgroundColor:"#FFC600",borderRadius:5, justifyContent:"flex-start"}}/>
                                    </View>
                                    <Text style={{color:"#A9A9A9"}}>{star_5}</Text>
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginBottom:4}}>
                                    <Text style={{fontWeight:"500"}}>4점</Text>
                                    <View style={{width:150, height:3, backgroundColor:"#EBEBEB", marginLeft:5, marginRight:5, borderRadius:5}}>
                                        <View style={{width:0, height:3, backgroundColor:"#FFC600",borderRadius:5, justifyContent:"flex-start"}}/>
                                    </View>
                                    <Text style={{color:"#A9A9A9"}}>{star_4}</Text>
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginBottom:4}}>
                                    <Text style={{fontWeight:"500"}}>3점</Text>
                                    <View style={{width:150, height:3, backgroundColor:"#EBEBEB", marginLeft:5, marginRight:5, borderRadius:5}}>
                                        <View style={{width:0, height:3, backgroundColor:"#FFC600",borderRadius:5, justifyContent:"flex-start"}}/>
                                    </View>
                                    <Text style={{color:"#A9A9A9"}}>{star_3}</Text>
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginBottom:4}}>
                                    <Text style={{fontWeight:"500"}}>2점</Text>
                                    <View style={{width:150, height:3, backgroundColor:"#EBEBEB", marginLeft:5, marginRight:5, borderRadius:5}}>
                                        <View style={{width:0, height:3, backgroundColor:"#FFC600",borderRadius:5, justifyContent:"flex-start"}}/>
                                    </View>
                                    <Text style={{color:"#A9A9A9"}}>{star_2}</Text>
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginBottom:4, marginLeft:5}}>
                                    <Text style={{fontWeight:"500"}}>1점</Text>
                                    <View style={{width:150, height:3, backgroundColor:"#EBEBEB", marginLeft:5, marginRight:5, borderRadius:5}}>
                                        <View style={{width:0, height:3, backgroundColor:"#FFC600",borderRadius:5, justifyContent:"flex-start"}}/>
                                    </View>
                                    <Text style={{color:"#A9A9A9"}}>{star_1}</Text>
                                </View>
                            </View>
                            :<View style={{alignItems:"center"}}>
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginBottom:4}}>
                                    <Text style={{fontWeight:"500"}}>5점</Text>
                                    <View style={{width:150, height:3, backgroundColor:"#EBEBEB", marginLeft:5, marginRight:5, borderRadius:5}}>
                                        <View style={{width:(_max === star_5?150:(star_5 / _max * 100)+"%"), height:3, backgroundColor:"#FFC600",borderRadius:5, justifyContent:"flex-start"}}/>
                                    </View>
                                    <Text style={{color:"#A9A9A9"}}>{star_5}</Text>
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginBottom:4}}>
                                    <Text style={{fontWeight:"500"}}>4점</Text>
                                    <View style={{width:150, height:3, backgroundColor:"#EBEBEB", marginLeft:5, marginRight:5, borderRadius:5}}>
                                        <View style={{width:(_max === star_4?150:(star_4 / _max * 100)+"%"), height:3, backgroundColor:"#FFC600",borderRadius:5, justifyContent:"flex-start"}}/>
                                    </View>
                                    <Text style={{color:"#A9A9A9"}}>{star_4}</Text>
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginBottom:4}}>
                                    <Text style={{fontWeight:"500"}}>3점</Text>
                                    <View style={{width:150, height:3, backgroundColor:"#EBEBEB", marginLeft:5, marginRight:5, borderRadius:5}}>
                                        <View style={{width:(_max === star_3?150:(star_3 / _max * 100)+"%"), height:3, backgroundColor:"#FFC600",borderRadius:5, justifyContent:"flex-start"}}/>
                                    </View>
                                    <Text style={{color:"#A9A9A9"}}>{star_3}</Text>
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginBottom:4}}>
                                    <Text style={{fontWeight:"500"}}>2점</Text>
                                    <View style={{width:150, height:3, backgroundColor:"#EBEBEB", marginLeft:5, marginRight:5, borderRadius:5}}>
                                        <View style={{width:(_max === star_2?150:(star_2 / _max * 100)+"%"), height:3, backgroundColor:"#FFC600",borderRadius:5, justifyContent:"flex-start"}}/>
                                    </View>
                                    <Text style={{color:"#A9A9A9"}}>{star_2}</Text>
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginBottom:4, marginLeft:5}}>
                                    <Text style={{fontWeight:"500"}}>1점</Text>
                                    <View style={{width:150, height:3, backgroundColor:"#EBEBEB", marginLeft:5, marginRight:5, borderRadius:5}}>
                                        <View style={{width:(_max === star_1?150:(star_1 / _max * 100)+"%"), height:3, backgroundColor:"#FFC600",borderRadius:5, justifyContent:"flex-start"}}/>
                                    </View>
                                    <Text style={{color:"#A9A9A9"}}>{star_1}</Text>
                                </View>
                            </View>
                        }
                    </View>
                </View>
                <View style={{flex:1,alignItems:"flex-start", backgroundColor:"#ffff", marginTop:20,width:Dimensions.get('window').width}}>
                    <View style={{padding:20,borderBottomColor:"#F6F6F6", borderBottomWidth:2, width:Dimensions.get('window').width}}>
                        <Text style={{fontWeight:"500", fontSize:20, marginBottom:10}}>전체 {reviewCount}개 의 리뷰</Text>
                            <View style={{flexDirection:"row", alignItems:"flex-end", justifyContent:"flex-end"}}>
                                <TouchableOpacity style={{marginLeft:8}} onPress={()=>Post(arry[0][0].NO,1)}><Text style={{color:review_1, fontWeight:"500"}}>최신순</Text></TouchableOpacity>
                                <TouchableOpacity style={{marginLeft:8}} onPress={()=>Post(arry[0][0].NO,2)}><Text style={{color:review_2, fontWeight:"500"}}>별점높은순</Text></TouchableOpacity>
                                <TouchableOpacity style={{marginLeft:8}} onPress={()=>Post(arry[0][0].NO,3)}><Text style={{color:review_3, fontWeight:"500"}}>별점낮은순</Text></TouchableOpacity>
                            </View>
                    </View>
                    <View>
                        {reviewLoading?
                            <View style={{alignItems:"center", justifyContent:"center", padding:20}}>
                                <Text style={{fontSize:30}}></Text>
                                <Text style={{fontSize:30}}>아직 리뷰가 없습니다.</Text>
                                <Text style={{fontSize:30}}></Text>
                                <Text style={{fontSize:30}}></Text>
                                <Text style={{fontSize:30}}></Text>
                            </View>
                            :(review.map((item, index)=>(
                                <View key={index} style={{padding:20}}>
                                    <View style={{fontSize:17, fontWeight:"500", marginBottom:5, flexDirection:"row",alignItems:"center"}}>
                                        <Ionicons name={'person-circle-outline'} style={{fontSize:40,marginRight:10,color:"#021B79"}}/>   
                                        <View>
                                            <Text style={{marginBottom:3, fontSize:16, fontWeight:"600"}}>{maskingEmail(item.useremail)}</Text>
                                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                                <AvgStar props={item.ratings}/>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={{padding:5, fontWeight:"400", fontSize:16}}>{item.userreview}</Text>
                                    {/* <Text>{item.ratings}</Text>
                                    <Text>{item.DATE}</Text> */}
                                </View>
                                
                        )) )}
                    </View>
                </View>
            </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center",
    alignItems:"center",
  },
  toiletinfo:{
    position:"relative",
    width: Dimensions.get('window').width-50,
    top:-30,
    alignItems:"center",
    backgroundColor:"#ffffff",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowColor: 'gray',
    shadowOffset: { height: 3, width: 3 },
    borderRadius:10,
    padding:15
  }

});