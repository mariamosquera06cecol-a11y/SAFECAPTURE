import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Importa tus pantallas
import LoginScreen from '../screens/LoginScreen'; 
import CameraScreen from '../screens/CameraScreen';
import ReportScreen from '../screens/ReportScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  
  // Función reutilizable para el botón de cerrar sesión
  const LogoutButton = (navigation) => (
    <TouchableOpacity 
      onPress={() => navigation.replace('Login')}
      style={{ 
        marginRight: 15, 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: '#ff4444' 
      }}
    >
      <Text style={{ color: '#ff4444', fontWeight: 'bold', fontSize: 10 }}>SALIR</Text>
    </TouchableOpacity>
  );

  // Estilo común para los encabezados oscuros
  const headerStyleOptions = {
    headerStyle: {
      backgroundColor: '#000',
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      letterSpacing: 1,
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login"> 
        
        {/* 1. LOGIN: Sin barra superior */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        {/* 2. CÁMARA */}
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={({ navigation }) => ({
            ...headerStyleOptions,
            title: 'CAPTURA IA',
            headerLeft: () => null, // Bloquea el regreso manual
            headerRight: () => LogoutButton(navigation),
          })}
        />

        {/* 3. REPORTE: Ahora también con botón de SALIR */}
        <Stack.Screen 
          name="Report" 
          component={ReportScreen} 
          options={({ navigation }) => ({
            ...headerStyleOptions,
            title: 'EVIDENCIA',
            headerRight: () => LogoutButton(navigation),
          })}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}