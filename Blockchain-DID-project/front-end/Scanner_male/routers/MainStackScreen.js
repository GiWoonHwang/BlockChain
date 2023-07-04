import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen'
import ScannerScreen from '../screen/ScannerScreen';
const Stack = createNativeStackNavigator();

export default function MainStackScreen() {
    return (
        <NavigationContainer>
            <Stack.Navigator >
                <Stack.Screen name="Home"  component={HomeScreen}
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#ffff",
                    headerTransparent : true,
                    headerTitle: " ",
                    // headerShown: false, //헤더 삭제
                }}/>
                <Stack.Screen name="Scanner" component={ScannerScreen}                 
                options={{
                    headerBackTitleStyle:10,
                    headerShadowVisible:false,
                    headerTintColor: "#ffff",
                    headerTransparent : true,
                    headerTitle: " ",
                    // headerShown: false, //헤더 삭제
                }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}