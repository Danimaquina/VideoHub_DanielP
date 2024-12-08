import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importa Firestore
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBeti89NwwL1Y83QDcOakWMviq2_oqYqLI",
  authDomain: "videohub-8b7c3.firebaseapp.com",
  projectId: "videohub-8b7c3",
  storageBucket: "videohub-8b7c3.firebasestorage.app",
  messagingSenderId: "610896538920",
  appId: "1:610896538920:web:21ad520793a59ade8af41d",
  measurementId: "G-1ZPXNE8DK7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Configura Firebase Authentication con persistencia usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicializa Firestore
const db = getFirestore(app);

export { auth, db };
