// firebaseConfig.js

// Importa las funciones necesarias desde el SDK de Firebase
import { initializeApp } from 'firebase/app';

// Configuración de Firebase para tu aplicación web
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export default app;
