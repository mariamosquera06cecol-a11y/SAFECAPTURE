import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication'; // <--- Librería de biometría
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleBiometricAuth = async () => {
    // 1. Verificar si el dispositivo tiene hardware biométrico
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return Alert.alert("Error", "Este dispositivo no soporta biometría.");
    }

    // 2. Verificar si hay huellas o rostros registrados
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return Alert.alert("Seguridad", "No tienes datos biométricos registrados en el celular.");
    }

    // 3. Iniciar el proceso de autenticación
    setIsAuthenticating(true);
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación SafeCapture',
      fallbackLabel: 'Usar contraseña del dispositivo',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
    });

    setIsAuthenticating(false);

    if (result.success) {
      // SI TIENE ÉXITO: Ingresa a la cámara
      navigation.replace('Camera');
    } else {
      // SI FALLA O CANCELA: No hace nada o muestra error
      Alert.alert("Acceso Denegado", "No se pudo verificar la identidad.");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#020617']} style={styles.background} />
      
      <View style={styles.content}>
        <MaterialCommunityIcons name="shield-lock" size={100} color="#38BDF8" />
        <Text style={styles.logoText}>SAFECAPTURE</Text>
        
        <View style={styles.glassCard}>
          <Text style={styles.welcomeText}>Verificación de Identidad</Text>
          
          <TouchableOpacity 
            style={styles.biometricButton}
            onPress={handleBiometricAuth}
            disabled={isAuthenticating}
          >
            <LinearGradient
              colors={['#38BDF8', '#1D4ED8']}
              style={styles.gradientButton}
            >
              <MaterialCommunityIcons 
                name={isAuthenticating ? "loading" : "fingerprint"} 
                size={40} 
                color="white" 
              />
              <Text style={styles.buttonText}>
                {isAuthenticating ? "VERIFICANDO..." : "INICIAR SESIÓN"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ... (Los estilos se mantienen iguales al diseño bonito que hicimos antes)
const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  logoText: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 4, marginTop: 20, marginBottom: 50 },
  glassCard: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 30, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  welcomeText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 30 },
  biometricButton: { width: '100%', height: 80, borderRadius: 20, overflow: 'hidden' },
  gradientButton: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 15 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});