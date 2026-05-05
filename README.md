 SAFECAPTURE - Reporte de Seguridad Ciudadana

**SafeCapture** es una aplicación móvil desarrollada en **React Native** bajo el marco del programa **ADSO**. Su objetivo es permitir a los usuarios capturar evidencias fotográficas georreferenciadas de incidentes de seguridad en su entorno.

 Funcionalidades Principales (Fase 2)
Para esta entrega, se han implementado las siguientes lógicas de hardware y seguridad:

* **Autenticación Biométrica:** Uso de huella dactilar para el acceso seguro a la aplicación.
* **Captura de Evidencia:** Integración con la cámara del dispositivo.
* **Geolocalización:** Registro en tiempo real de latitud y longitud mediante el sensor GPS.
* **Historial Local:** Almacenamiento persistente de los reportes capturados.

Tecnologías
* **Frontend:** React Native / Expo
* **Sensores:** `expo-camera`, `expo-location`, `expo-local-authentication`
* **Persistencia:** `AsyncStorage`

Cómo ejecutar el proyecto
1. Instalar las dependencias: `npm install`, expo-camera`, `expo-location`, `expo-local-authentication`
2. Iniciar el proyecto: `npx expo start`
3. Escanear el código QR con la app **Expo Go**.

---
**Desarrollado por:** Maria Mosquera y   Harol Benavides
