import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Login({ navigation }) {
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
        <TextInput placeholder="Email..." style={styles.input} />
        <TextInput placeholder="Password..." secureTextEntry={true} style={styles.input} />

        <TouchableOpacity style={styles.enterButton} onPress={() => navigation.navigate('Favoritos')}>
          <Text style={styles.enterText}>Enter</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para ir a Register */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.toggleButton}>
        <Text style={styles.toggleText}>Don’t have an account? Register</Text>
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
