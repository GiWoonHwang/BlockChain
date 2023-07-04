// 홈에 상단메뉴
import React from 'react';
import { IconButton } from 'react-native-paper';
import {TouchableOpacity ,Button, StyleSheet,  Text, View } from 'react-native';


export default function Hederbar({navigations}) {
    return (
        <View style={styles.container}>
            <IconButton
                icon="menu"
                color="#3A3A3A"
                size={30}
                onPress={() => navigations.toggleDrawer()}
                />
            <Text style={{fontSize:18, fontWeight:"500",color:"#3A3A3A"}}>전국 안전화장실</Text>
            <IconButton
                // icon="menu"
                // color="#021B79"
                // size={30}
                // onPress={() => navigations.toggleDrawer()}
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