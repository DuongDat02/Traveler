import React from 'react';
import TimkiemScreen from './Timkiem'; // Đảm bảo đúng đường dẫn đến file Timkiem.tsx hoặc Timkiem.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DestinationSearchScreen from './Timdiemden';
import TimdiemdenResult from './TimdiemdenResult';
import Place from './Place';
import Describe from './Describe';
import Comment from './Comment';
import Weather from './Weather';
import SplashScreen from './SplashScreen';
import LoginScreen from './logInScreen/LoginScreen';
import SignUpScreen from './logInScreen/SignUpScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SplashScreen' >
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="TimkiemScreen" component={TimkiemScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DestinationSearchScreen" component={DestinationSearchScreen} options={{title: 'Tìm điểm đến' }}/>
        <Stack.Screen name="TimdiemdenResult" component={TimdiemdenResult} options={{title: 'Result' }}/>
        <Stack.Screen name="Place" component={Place} options={{title: 'Place' }}/>
        <Stack.Screen name="Describe" component={Describe} options={{title: 'Giới thiệu' }}/>
        <Stack.Screen name="Comment" component={Comment} options={{title: 'Đánh giá và bình luận' }}/>
        <Stack.Screen name="Weather" component={Weather} options={{title: 'Thời tiết và giao thông' }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
