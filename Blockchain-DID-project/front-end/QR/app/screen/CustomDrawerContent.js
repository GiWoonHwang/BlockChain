// 왼쪽 메뉴
import React, { useState } from 'react';
import { StyleSheet, View ,Text, TouchableOpacity} from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import { Avatar, Title, Caption, Paragraph, Drawer, Switch  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default function CustomDrawerContent(props) {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const toggleTheme = ()=>{
        setIsDarkTheme(!isDarkTheme)
    }
    return (
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={{flex:1, }}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:"row", marginTop: 15}}>
                            <View style={{ flexDirection:"column"}}>
                                <Title style={styles.title}>Arto</Title>
                            </View>
                        </View>
                        <View style={styles.row}></View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon 
                                    name="home-outline"
                                    color={color}
                                    size={size}/>
                                )}
                            label="홈"
                            onPress={() => props.navigation.navigate("나의 QR")}
                        />
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon 
                                    name="account-outline"
                                    color={color}
                                    size={size}/>
                                )}
                            label="나의정보"
                            onPress={() => props.navigation.navigate("설정")}
                        />
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon 
                                    name="map-marker"
                                    color={color}
                                    size={size}/>
                                )}
                            label="화장실 위치"
                            onPress={() => props.navigation.navigate("화장실 위치")}
                        />
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon 
                                    name="qrcode"
                                    color={color}
                                    size={size}/>
                                )}
                            label="QR 증명서"
                            onPress={() => props.navigation.navigate("QRcode")}
                        />
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon 
                                    name="scan-helper"
                                    color={color}
                                    size={size}/>
                                )}
                            label="화장실QR 스캔"
                            onPress={() => props.navigation.navigate("스캐너")}
                        />
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon 
                                    name="format-list-bulleted"
                                    color={color}
                                    size={size}/>
                                )}
                            label="이용 내역"
                            onPress={() => props.navigation.navigate("이용내역")}
                        />
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon 
                                    name="cog-outline"
                                    color={color}
                                    size={size}/>
                                )}
                            label="설정"
                            onPress={() => props.navigation.navigate("설정")}
                        />
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon 
                                    name="check-outline"
                                    color={color}
                                    size={size}/>
                                )}
                            label="인증"
                            onPress={() => props.navigation.navigate("설정")}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                icon={({color, size})=>(
                    <Icon 
                    name="exit-to-app"
                    color={color}
                    size={size}/>
                )}
                label="나가기"
                onPress={() => props.navigation.closeDrawer()}
                />
            </Drawer.Section>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
    flex:1,
    justifyContent:"flex-start",
    alignItems: "center"
    },
    userInfoSection:{
        paddingLeft:20,
        borderBottomColor:"#f4f4f4", 
        borderBottomWidth:1
    },
    title:{
        fontSize:25,
        marginTop:3,
        fontWeight:"bold",
    },
    caption:{
        fontSize:14,
        lineHeight:14,
    },
    row:{
        marginTop:20,
        flexDirection:"row",
        alignItems: "center",
    },
    section:{
        flexDirection:"row",
        alignItems: "center",
        marginRight:3,
    },
    drawerSection:{
        marginTop:15,
    },
    bottomDrawerSection:{
        marginBottom:15,
        borderTopColor: "#f4f4f4",
        borderTopWidth:1
    },
    preference:{
        flexDirection:"row",
        justifyContent: "space-between",
        paddingVertical:12,
        paddingHorizontal:16
    }
    
});
