import React, { useState, useEffect } from 'react';  
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { db, auth } from './firebaseConfig'; // Asegúrate de importar correctamente Firestore y Firebase Auth
import { collection, getDocs, addDoc } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth'; // Importamos para obtener el usuario autenticado
import FSection from '../components/FSection';
import LogoutPopup from '../components/PopUp';  // Importa el componente del popup

export default function Listas({ navigation }) {
  const [isPopupVisible, setPopupVisible] = useState(false); // Estado para manejar la visibilidad del popup
  const [listas, setListas] = useState([]); // Estado para almacenar las listas
  const [newListTitle, setNewListTitle] = useState(''); // Estado para el título de una nueva lista
  const [showCreateList, setShowCreateList] = useState(false); // Estado para controlar la visibilidad del formulario de creación

  // Función para obtener las listas del Firestore
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

  // Llamar a la función fetchListas cuando el componente se monta
  useEffect(() => {
    fetchListas();
  }, []);

  // Función para crear una nueva lista
  const handleCreateList = async () => {
    const user = getAuth().currentUser; // Obtener el usuario autenticado
    if (newListTitle.trim() && user) {
      try {
        await addDoc(collection(db, 'listas'), { 
          title: newListTitle,
          videos: [],
          creator: user.uid, // Guardamos el uid del creador de la lista
        });
        setNewListTitle('');
        setShowCreateList(false); // Ocultar el formulario después de crear la lista
        fetchListas(); // Refrescar las listas
      } catch (error) {
        console.error("Error creating list:", error);
      }
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
      setPopupVisible(true); // Muestra el popup si se presiona el botón con id 4
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Listas</Text>
      </View>

      <View style={styles.content}>
        {/* Mostrar las listas creadas por el usuario */}
        <FlatList
          data={listas}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listTitle}>{item.title}</Text>
              {/* Puedes añadir más funcionalidades para cada lista, como ver los videos */}
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Botón para mostrar/ocultar el formulario de creación de listas */}
      <View style={styles.createListContainer}>
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={() => setShowCreateList(!showCreateList)}
        >
          <Text style={styles.toggleButtonText}>
            {showCreateList ? 'Cancelar' : 'Crear Nueva Lista'}
          </Text>
        </TouchableOpacity>

        {showCreateList && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Nuevo título de lista"
              value={newListTitle}
              onChangeText={setNewListTitle}
            />
            <TouchableOpacity style={styles.createButton} onPress={handleCreateList}>
              <Text style={styles.createButtonText}>Crear Lista</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <FSection currentSection={3} onPress={handlePress} />
      </View>

      {/* Popup de confirmación para salir */}
      <LogoutPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}  // Cierra el popup cuando se presiona "No"
        onConfirm={() => {
          setPopupVisible(false); // Cierra el popup
          navigation.navigate('Login');  // Navega a la pantalla de Login
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
  content: { flex: 6, padding: 20 },
  listItem: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createListContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  toggleButton: {
    backgroundColor: '#00910E',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  createButton: {
    backgroundColor: '#00910E',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
  },
  footer: {
    flex: 1.5,
    justifyContent: 'flex-end'
  }
});