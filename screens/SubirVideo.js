import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FSection from '../components/FSection';
import LogoutPopup from '../components/PopUp';
import { db, auth } from './firebaseConfig'; // Importa Firestore y Auth desde tu configuración
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Métodos de Firestore
import { getAuth } from 'firebase/auth'; // Firebase Authentication

export default function SubirVideo() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [enlace, setEnlace] = useState('');
  const navigation = useNavigation();

  // Identificar tipo de enlace
  const identificarTipoEnlace = (url) => {
    if (/youtu\.?be/.test(url)) {
      return 'YouTube';
    } else if (/instagram/.test(url)) {
      return 'Instagram';
    }
    return 'Desconocido';
  };

  // Subir video a Firebase
  const handleSubirVideo = async () => {
    if (!titulo.trim() || !enlace.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const tipo = identificarTipoEnlace(enlace);
    if (tipo === 'Desconocido') {
      Alert.alert('Error', 'El enlace no es válido. Debe ser de YouTube o Instagram.');
      return;
    }

    // Obtener el usuario actual
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para subir un video.');
      return;
    }

    try {
      const data = {
        titulo: titulo.trim(),
        enlace: enlace.trim(),
        tipo,
        visto: false, // Campo booleano para indicar si el video ha sido visto
        fechaCreacion: serverTimestamp(), // Marca de tiempo automática
        usuario: user.uid, // ID del usuario autenticado
      };

      // Guarda en la colección "videos"
      await addDoc(collection(db, 'videos'), data);

      Alert.alert('Éxito', 'El video se ha subido correctamente.');
      setTitulo('');
      setEnlace('');
    } catch (error) {
      console.error('Error al subir el video: ', error);
      Alert.alert('Error', 'No se pudo subir el video. Inténtalo de nuevo.');
    }
  };

  const handlePress = (id) => {
    if (id === 1) {
      navigation.navigate('Favoritos');
    }
    if (id === 2) {
      navigation.navigate('SubirVideo');
    }
    if (id === 3) {
      navigation.navigate('Listas');
    }
    if (id === 4) {
      setPopupVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Subir Video</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Título del video"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Enlace del video (YouTube o Instagram)"
          value={enlace}
          onChangeText={setEnlace}
        />
        <Button title="Subir Video" onPress={handleSubirVideo} color="#005f0a" />
      </View>
      <View style={styles.footer}>
        <FSection currentSection={2} onPress={handlePress} />
      </View>
      <LogoutPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        onConfirm={() => {
          setPopupVisible(false);
          navigation.navigate('Login');
        }}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00910E' },
  header: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  title: { fontSize: 50, fontWeight: 'bold', color: 'white' },
  content: { flex: 6, paddingHorizontal: 20, justifyContent: 'center' },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  footer: { flex: 1 },
});


