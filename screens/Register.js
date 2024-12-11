import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Importar el método de registro y actualización de perfil

import { auth } from './firebaseConfig'; // Asegúrate de que la ruta sea correcta

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (name && email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Actualiza el nombre de usuario en Firebase Authentication
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name, // Guarda el nombre del usuario
          }).then(() => {
            navigation.navigate('Favoritos');
          }).catch((error) => {
            Alert.alert("Error", error.message);
          });
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    } else {
      Alert.alert('Error', 'Por favor ingrese todos los campos');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          Video<Text style={styles.hub}>HUB</Text>
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Name..."
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          placeholder="Email..."
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password..."
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity style={styles.enterButton} onPress={handleRegister}>
          <Text style={styles.enterText}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para ir a Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.toggleButton}>
        <Text style={styles.toggleText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00910E', alignItems: 'center', justifyContent: 'center' },
  header: { marginBottom: 20 },
  logo: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  hub: { color: '#00910E', backgroundColor: 'white', borderRadius: 5, paddingHorizontal: 5 },
  formContainer: { backgroundColor: 'white', padding: 20, borderRadius: 10, borderWidth: 2, borderColor: 'black', width: '80%' },
  input: { height: 40, borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 15, backgroundColor: 'white' },
  enterButton: { backgroundColor: '#00910E', alignItems: 'center', padding: 10, borderRadius: 5, marginTop: 20 },
  enterText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  toggleButton: { marginTop: 15 },
  toggleText: { color: 'white', textDecorationLine: 'underline' },
});
