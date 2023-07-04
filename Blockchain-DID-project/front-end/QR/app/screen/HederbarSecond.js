// 홈에 상단메뉴
import React, { useState, useEffect } from 'react';
import { IconButton } from 'react-native-paper';
import {TouchableOpacity ,Button, StyleSheet,  Text, View } from 'react-native';


export default function HederbarSecond({navigations}) {
    
    var reset =()=>{
        navigations.navigate("이용내역", { props: true})
    }

    return (
        <View style={styles.container}>
            <IconButton
                icon="menu"
                color="#3A3A3A"
                size={30}
                onPress={() => navigations.toggleDrawer()}
                />
            <Text style={{fontSize:18, fontWeight:"500",color:"#3A3A3A"}}>이용내역</Text>
            <IconButton
                icon="refresh"
                color="#3A3A3A"
                size={30}
                onPress={() => reset()}
                />
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
    flex:1,
    width:100+"%",    
    alignItems:"center",
    padding:0,
    flexDirection: "row",
    justifyContent:"space-between",
    position:"absolute",
    top:0,
    paddingTop:30,
    backgroundColor:"#ffff"
    },


});