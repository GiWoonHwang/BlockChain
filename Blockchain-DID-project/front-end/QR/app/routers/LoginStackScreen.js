// import * as React from 'react';
import React,{useState, useEffect, useRef} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons  from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screen/LoginScreen';
import SignupScreen from '../screen/SignupScreen';
import HomeScreen from "../screen/HomeScreen";
import LocationScreen from "../screen/LocationScreen";
import SetingScreen from "../screen/SetingScreen";
import QRcodeScreen from '../screen/QRcodeScreen';
import PinNumSignupScreen from '../screen/PinNumSignupScreen';
import CustomDrawerContent from '../screen/CustomDrawerContent';
import InitializationScreen from '../screen/InitializationScreen';
import PinNumLoginScreen from '../screen/PinNumLoginScreen'
import PinNumSettingScreen from '../screen/PinNumSettingScreen'
import NoticeScreen from '../screen/NoticeScreen'
import FindScreen from '../screen/FindScreen'
import TermsofServiceScreen from '../screen/TermsofServiceScreen'
import ModifyInformationScreen from '../screen/ModifyInformationScreen'
import UsageHistoryScreen from '../screen/UsageHistoryScreen'
import ReviewScreen from '../screen/ReviewScreen';
import ScannerScreen from '../screen/ScannerScreen';
import ToiletInfoScreen from '../screen/ToiletInfoScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'

const Stack = createNativeStackNavigator();
const TabStack = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator(); 
var locationsArry = [];
var locations=false;
var local

AsyncStorage.getAllKeys(  (err, keys) => {
    var key = keys[0]
    if(key){
        local = true
        AsyncStorage.getItem(key, (err,result) =>{
            console.log("핀번호:",key+", 값: "+result)
        })
    }else if(key==null){
        local =false
    }
});

function LoginRouters() {
    return(
            <Stack.Navigator initialRouteName={local?"PinNumLogin":"Login"}>
                <Stack.Screen name="Login" component={LoginScreen}
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#1F2937",
                    headerTransparent : true,
                    headerTitle: " ",
                    
                    // headerShown: false, //헤더 삭제
                }}/>
                <Stack.Screen name="Signup" component={SignupScreen}                     
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#1F2937",
                    headerTransparent : true,
                    headerTitle: " ",
                    // headerShown: false, //헤더 삭제
                }}/>
                <Stack.Screen name="PinNumSignup" component={PinNumSignupScreen}                     
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#1F2937",
                    headerTransparent : true,
                    headerTitle: " ",
                    // headerShown: false, //헤더 삭제
                }}/>
                <Stack.Screen name="Initialization" component={InitializationScreen}                     
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#1F2937",
                    headerTransparent : true,
                    headerTitle: " ",
                    headerBackTitleVisible: false
                    // headerShown: false, //헤더 삭제
                }}/>
                <Stack.Screen name="PinNumLogin" component={PinNumLoginScreen}                     
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#1F2937",
                    headerTransparent : true,
                    headerTitle: " ",
                    headerBackTitleVisible: false,
                    // headerShown: false, //헤더 삭제
                }}/>
                <Stack.Screen name="PinNumSetting" component={PinNumSettingScreen}                     
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#1F2937",
                    headerTransparent : true,
                    headerTitle: " ",
                    headerBackTitleVisible: false,
                    // headerShown: false, //헤더 삭제
                }}/>
                <Stack.Screen name="Notice" component={NoticeScreen}                     
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#1F2937",
                    headerTransparent : false, // 상단메뉴를 불투명하게함 true는 투명함
                    headerTitle: "공지사항",
                    headerBackTitleVisible: false,
                    // headerShown: false, //헤더 삭제
                }}/>
                <Stack.Screen name="TermsofService" component={TermsofServiceScreen}                     
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#1F2937",
                    headerTransparent : false, // 상단메뉴를 불투명하게함 true는 투명함
                    headerTitle: "이용 약관",
                    headerBackTitleVisible: false,
                    // headerShown: false, //헤더 삭제
                }}/>
                <Stack.Screen name="Find" component={FindScreen}                     
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#1F2937",
                    headerTransparent : true,
                    headerTitle: " ",
                    // headerShown: false, //헤더 삭제
                }}/>
                <Stack.Screen name="ModifyInformation" component={ModifyInformationScreen}                     
                    options={{
                        headerBackTitleStyle:10,
                        headerShadowVisible:false,
                        headerTintColor: "#1F2937",
                        headerTransparent : true,
                        headerTitle: " ",
                        headerBackTitleVisible: false
                        // headerShown: false, //헤더 삭제
                    }}/>
                    <Stack.Screen name="ToiletInfo" component={ToiletInfoScreen}                     
                    options={{
                        headerBackTitleStyle:10,
                        headerShadowVisible:false,
                        headerTintColor: "#1F2937",
                        headerTransparent : true,
                        headerTitle: " ",
                        headerBackTitleVisible: false
                        // headerShown: false, //헤더 삭제
                    }}/>
                    <Stack.Screen name="Review" component={ReviewScreen}                     
                    options={{
                        headerBackTitleStyle:10,
                        headerShadowVisible:false,
                        headerTintColor: "#1F2937",
                        headerTransparent : true,
                        headerTitle: " ",
                        headerBackTitleVisible: false
                        // headerShown: false, //헤더 삭제
                    }}/>
                    <Stack.Screen name="QRcode" component={QRcodeScreen}                     
                    options={{
                        headerBackTitleStyle:10,
                        headerShadowVisible:false,
                        headerTintColor: "#1F2937",
                        headerTransparent : false, // 상단메뉴를 불투명하게함 true는 투명함
                        headerTitle: "증명서 QR코드",
                        headerBackTitleVisible: false,

                    }}/>
                <Stack.Screen name="Tab" component={Tabdraw} options={{ headerShown: false}}/>
            </Stack.Navigator>
    )
}

function TabRouters() {
    const [loading, setLoading] = useState(false); //현재위치 위도
    
    //현재 휴대폰 주인의 위치를 가져옴
    useEffect(() => {
        if(locationsArry[0]){
            setLoading(true)
        }else{
            setLoading(false)
        }
    },[locations]);

    return (
        <TabStack.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarLabelStyle: { fontSize: 12 },
            tabBarItemStyle: { width: 100 },
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === '나의 QR') {
                    iconName = focused
                    ? 'qr-code'
                    : 'qr-code-outline'
                } else if (route.name === '화장실 위치') {
                    iconName = focused 
                    ? 'location'
                    : 'location-outline';
                }else if (route.name === '스캐너') {
                    iconName = focused 
                    ? 'scan'
                    : 'scan-outline';
                }else if (route.name === '이용내역') {
                    iconName = focused 
                    ? 'list'
                    : 'list-outline';
                }else if (route.name === '설정') {
                    iconName = focused 
                    ? 'cog'
                    : 'cog-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#021B79',
            tabBarInactiveTintColor: 'gray',
        })}
        >
            <TabStack.Screen name="나의 QR" component={HomeStackScreen} />
            <TabStack.Screen name="화장실 위치"  component={LocationScreen}  
            initialParams={loading?{"value":false}:{"value":locationsArry}} />
            <TabStack.Screen name="스캐너" component={ScannerScreen} />
            <TabStack.Screen name="이용내역" component={UsageHistoryScreen} />
            <TabStack.Screen name="설정" component={SetingScreen} />
        </TabStack.Navigator>
    );
}

function Tabdraw(){
    return(
    <Drawer.Navigator  screenOptions={{headerShown:false, }} drawerContent={(props) => <CustomDrawerContent {...props} />} >
        <Drawer.Screen name="Feed" component={TabRouters} />
    </Drawer.Navigator> 
    )
}

const HomeStackScreen = ()=>{
    return(
        <HomeStack.Navigator>
            <HomeStack.Screen name="나의QR" component={HomeScreen}
            options={{
                headerShown: false, //헤더 삭제
                headerTitle: " ",
            }}
            />
            {/* <HomeStack.Screen name="QRcode" component={QRcodeScreen}
            options={{
                headerBackTitleStyle:10,
                headerShadowVisible:false,
                headerTintColor: "#1F2937",
                headerTransparent : true,
                headerTitle: "증명서 QR코드",
                headerBackTitleVisible: false,
            }}/> */}
        </HomeStack.Navigator>
    );
}

export default function LoginStackScreen({props}) {
    if(props){
        locationsArry.push(props.latitude)
        locationsArry.push(props.longitude)
        locations = true;
    }

    return(
        <NavigationContainer>
            <LoginRouters/>
        </NavigationContainer>
    )
}