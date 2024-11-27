// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración obtenida de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAgbV1gP612aOLa3FLGjWB0-o-9A658XJA",
    authDomain: "testfirebase-a0eef.firebaseapp.com",
    projectId: "testfirebase-a0eef",
    storageBucket: "testfirebase-a0eef.appspot.com",
    messagingSenderId: "719556239252",
    appId: "1:719556239252:web:10b7b5cb79b7a64a507981",
    measurementId: "G-4MHQHL8NB0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

export { db };
