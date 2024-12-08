import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FSection from '../components/FSection';
import LogoutPopup from '../components/PopUp';
import { db, auth } from './firebaseConfig'; // Importa Firestore y Auth desde tu configuración
import { collection, addDoc, serverTimestamp, writeBatch, doc, arrayUnion, getDocs } from 'firebase/firestore'; // Métodos de Firestore
import { getAuth } from 'firebase/auth'; // Firebase Authentication
import { CheckBox } from 'react-native-elements'; // Utilizamos CheckBox de react-native-elements

export default function SubirVideo() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [enlace, setEnlace] = useState('');
  const [selectedLists, setSelectedLists] = useState([]); // Estado para las listas seleccionadas
  const [listas, setListas] = useState([]); // Estado para las listas disponibles
  const navigation = useNavigation();

  // Obtener las listas desde Firestore al cargar el componente
  const fetchListas = async () => {
    try {
      const listasCollection = collection(db, 'listas');
      const listasSnapshot = await getDocs(listasCollection);
      const listasData = listasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListas(listasData);
    } catch (error) {
      console.error("Error fetching listas:", error);
    }
  };

  // Cargar las listas cuando el componente se monta
  useEffect(() => {
    fetchListas();
  }, []);

  // Identificar tipo de enlace (YouTube o Instagram)
  const identificarTipoEnlace = (url) => {
    if (/youtu\.?be/.test(url)) {
      return 'YouTube';
    } else if (/instagram/.test(url)) {
      return 'Instagram';
    }
    return 'Desconocido';
  };

  // Subir video a Firebase y actualizar las listas
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

    // Crear el objeto del video que se va a subir
    const videoData = {
      titulo: titulo.trim(),
      enlace: enlace.trim(),
      tipo,
      visto: false, // Campo booleano para indicar si el video ha sido visto
      fechaCreacion: serverTimestamp(), // Marca de tiempo automática
      usuario: user.uid, // ID del usuario autenticado
    };

    try {
      // Guarda el video en la colección "videos"
      const videoRef = await addDoc(collection(db, 'videos'), videoData);

      // Ahora actualizamos las listas con el ID del nuevo video
      if (selectedLists.length > 0) {
        const batch = writeBatch(db);  // Utilizamos un batch para realizar múltiples operaciones atómicas

        // Actualizamos cada lista seleccionada para agregar el ID del video al campo "contenido"
        selectedLists.forEach(listId => {
          const listRef = doc(db, 'listas', listId); // Referencia de la lista
          batch.update(listRef, {
            contenido: arrayUnion(videoRef.id), // Agregamos el ID del video al campo "contenido" de la lista
          });
        });

        // Ejecutamos el batch
        await batch.commit();
      }

      // Si todo salió bien, mostramos un mensaje de éxito
      Alert.alert('Éxito', 'El video se ha subido correctamente.');
      setTitulo('');
      setEnlace('');
      setSelectedLists([]); // Limpiar las listas seleccionadas

    } catch (error) {
      console.error('Error al subir el video: ', error);
      Alert.alert('Error', 'No se pudo subir el video. Inténtalo de nuevo.');
    }
  };

  // Manejar la navegación al presionar las secciones
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

  // Función para manejar la selección de las listas (checkboxes)
  const toggleListSelection = (listId) => {
    if (selectedLists.includes(listId)) {
      setSelectedLists(selectedLists.filter(id => id !== listId));
    } else {
      setSelectedLists([...selectedLists, listId]);
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

        {/* Aquí mostramos las listas con checkboxes */}
        <Text style={styles.subtitle}>Selecciona las listas a las que agregar este video:</Text>
        <FlatList
          data={listas}
          renderItem={({ item }) => (
            <CheckBox
              title={item.title}
              checked={selectedLists.includes(item.id)}
              onPress={() => toggleListSelection(item.id)}
              containerStyle={styles.checkbox}
            />
          )}
          keyExtractor={(item) => item.id}
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
  subtitle: { fontSize: 18, color: 'white', marginBottom: 10 },
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
  checkbox: {
    backgroundColor: 'transparent', // Transparente para que el checkbox no tenga fondo
    borderWidth: 0, // Sin borde
  },
  footer: { flex: 1 },
});
