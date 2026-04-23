import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen({ navigation }) {
  const handleAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Acceso con Biometría',
      });
      if (result.success) {
        navigation.replace('Camera'); // Pasa a la siguiente pantalla si tiene éxito
      } else {
        Alert.alert('Error', 'No se pudo autenticar');
      }
    } catch (error) {
      console.error("Error en hardware de seguridad:", error); // Manejo de asincronismo 
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Entrar con Biometría" onPress={handleAuth} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
