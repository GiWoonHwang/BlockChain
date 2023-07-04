
import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const backgroundColorOptions = {
  option:{
    color: ["#0575E6","#021B79"]
},
}

export default function Loading() {
  let backgroundColor = backgroundColorOptions["option"].color;
  return (
    <View style={styles.app}>
      <View style={styles.container}>
        <Text style={styles.text_1}> 블록체인기반 </Text>
        <Text style={styles.text_2}> ArTo </Text>
        <Text style={styles.text_3}> Hyper leder indy</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    app: {
    flex: 3,
    justifyContent:"center",
    alignItems: 'center',
  },
  container: {
    justifyContent:"center",
    alignItems: 'center',
    width: 50+"%",
  },
  text_1: {
    fontSize: 25,
    fontWeight: "900",
    color: "#fff",
    marginLeft:10
  },
   text_2: {
    fontSize: 70,
    color: "#fff",
  },
   text_3: {
    fontSize: 20,
    color: "#fff",
    marginLeft:10
  }

});
