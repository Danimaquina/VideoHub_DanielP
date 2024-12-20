import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { getAuth } from 'firebase/auth';

export default function PopUp({ visible, onClose, onConfirm, navigation }) {
  const [userName, setUserName] = useState(null);  // Estado para guardar el nombre del usuario

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Verifica si el usuario ya está disponible y establece su nombre
    if (user) {
      setUserName(user.displayName || 'Usuario');
    } else {
      setUserName('Usuario');
    }
  }, []);  // Solo se ejecuta una vez al montar el componente

  // Muestra un mensaje de carga si el nombre no está disponible aún
  if (userName === null) {
    return (
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.title}>Cargando...</Text>
            <Text style={styles.message}>Por favor, espera...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <Text style={styles.title}>Cerrar sesión</Text>
          <Text style={styles.message}>¿Estás seguro de que deseas salir, {userName}?</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.yesButton]}
              onPress={() => {
                onConfirm(); // Llama la función onConfirm cuando el usuario haga clic en "Sí"
              }}
            >
              <Text style={styles.buttonText}>Sí</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.noButton]}
              onPress={onClose} // Cierra el popup cuando el usuario haga clic en "No"
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  popupContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#00910E', // Color verde para el botón "Sí"
    borderColor: '#00910E',
  },
  noButton: {
    backgroundColor: '#fff',
    borderColor: '#00910E',
    borderWidth: 1,
    backgroundColor: '#00910E',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});
