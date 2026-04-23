import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportScreen({ route, navigation }) {
  const { photoUri } = route.params;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    saveAndLoadReports();
  }, []);

  const saveAndLoadReports = async () => {
    try {
      // 1. Obtener ubicación actual
      let { status } = await Location.requestForegroundPermissionsAsync();
      let coords = "Sin GPS";
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        coords = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
      }

      // 2. Crear el nuevo objeto de reporte
      const newReport = {
        id: Date.now().toString(),
        uri: photoUri,
        location: coords,
        date: new Date().toLocaleString()
      };

      // 3. Leer historial guardado de la memoria
      const savedData = await AsyncStorage.getItem('@my_reports');
      const currentHistory = savedData ? JSON.parse(savedData) : [];

      // 4. Unir el nuevo con los anteriores
      const updatedHistory = [newReport, ...currentHistory];
      
      // 5. Guardar en la memoria del celular
      await AsyncStorage.setItem('@my_reports', JSON.stringify(updatedHistory));
      
      setReports(updatedHistory);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los datos");
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem('@my_reports');
    setReports([]);
    Alert.alert("Éxito", "Historial borrado");
  };

  if (loading) return <View style={styles.container}><Text>Guardando reporte...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Reportes ({reports.length})</Text>
      
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.uri }} style={styles.thumb} />
            <View style={styles.info}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.gps}>📍 {item.location}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnNew} onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.btnText}>NUEVA FOTO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={clearHistory}>
          <Text style={styles.btnClear}>Borrar todo el historial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', padding: 15, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 10, marginBottom: 15, flexDirection: 'row', elevation: 3 },
  thumb: { width: 80, height: 80, borderRadius: 8 },
  info: { marginLeft: 15, justifyContent: 'center', flex: 1 },
  date: { fontWeight: 'bold', fontSize: 14 },
  gps: { color: '#666', marginTop: 4 },
  footer: { marginTop: 10, paddingBottom: 20 },
  btnNew: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' },
  btnClear: { color: 'red', textAlign: 'center', marginTop: 15, fontSize: 12 }
});