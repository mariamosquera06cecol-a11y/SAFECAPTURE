import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import CameraScreen from '../screens/CameraScreen';
import ReportScreen from '../screens/ReportScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Seguridad' }} />
        <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Capturar' }} />
        <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'Reporte' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}