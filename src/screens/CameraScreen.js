import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native'; 
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location'; 

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);

  // EFECTO: Validación de sensores al entrar
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');
        
        if (status !== 'granted') {
          Alert.alert(
            "Permiso Requerido",
            "SafeCapture necesita el GPS para validar la ubicación de la evidencia."
          );
        }
      } catch (error) {
        console.error("Error obteniendo ubicación:", error);
        setLocationPermission(false); 
      }
    })();
  }, []);

  // 1. Pantalla de carga inicial
  if (!permission || locationPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Cargando sensores...</Text>
      </View>
    );
  }

  // 2. Pantalla de bloqueo si faltan permisos
  if (!permission.granted || !locationPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionBox}>
          <Text style={styles.titleText}>Acceso Detenido</Text>
          <Text style={styles.infoText}>
            Se requieren permisos de Cámara y GPS para continuar con la captura de evidencia.
          </Text>
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={async () => {
              const camRes = await requestPermission();
              const locRes = await Location.requestForegroundPermissionsAsync();
              setLocationPermission(locRes.status === 'granted');
              
              // Si el usuario ya bloqueó todo, enviarlo a ajustes
              if (!camRes.canAskAgain || locRes.status !== 'granted') {
                Linking.openSettings();
              }
            }}
          >
            <Text style={styles.settingsButtonText}>REINTENTAR / ABRIR AJUSTES</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3. Función para tomar la foto
  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady) return;

    try {
      setIsCameraReady(false); // Evita Monkey Testing
      const photo = await cameraRef.current.takePictureAsync();
      navigation.navigate('Report', { photoUri: photo.uri });
    } catch (error) {
      console.log("Error al capturar:", error);
      setIsCameraReady(true);
    }
  };

  // 4. Renderizado de la Cámara
  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      />
      
      {/* Botón Flotante (Overlay) */}
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={[styles.captureButton, !isCameraReady && { opacity: 0.5 }]} 
          onPress={takePicture}
          disabled={!isCameraReady}
        >
          <View style={styles.innerCircle} />
        </TouchableOpacity>
        <Text style={styles.buttonText}>
          {isCameraReady ? "CAPTURAR" : "INICIALIZANDO..."}
        </Text>
      </View>
    </View>
  );
}

// AQUÍ ESTABA EL ERROR: Definición de la constante styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center' 
  },
  camera: { 
    flex: 1 
  },
  permissionBox: {
    backgroundColor: 'white',
    margin: 20,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  titleText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    color: '#d32f2f' 
  },
  infoText: { 
    textAlign: 'center', 
    marginBottom: 25, 
    color: '#555', 
    lineHeight: 22 
  },
  settingsButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  settingsButtonText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  buttonText: { 
    color: 'white', 
    marginTop: 10, 
    fontWeight: 'bold',
    letterSpacing: 1
  },
});