import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import FSection from '../components/FSection';
import LogoutPopup from '../components/PopUp';
import YouTubeCell from "../components/YouTubeCell";
import InstagramCell from "../components/InstagramCell";
import { getAuth } from 'firebase/auth'; 
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'; 

export default function Favoritos({ navigation }) {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [filter, setFilter] = useState("todos"); // Estado para almacenar el filtro de los videos
  const [videos, setVideos] = useState([]); // Estado para almacenar los videos del usuario
  const [loading, setLoading] = useState(true); // Estado para mostrar la carga mientras se obtienen los videos

  const db = getFirestore(); // Inicializa Firestore
  const auth = getAuth(); // Obtiene la instancia de autenticación
  const user = auth.currentUser; // Obtiene el usuario actual autenticado

  // useEffect se ejecuta al montar el componente y al cambiar el usuario
  useEffect(() => {
    if (!user) {
      navigation.navigate('Login'); // Si no hay usuario autenticado, navega al login
      return;
    }

    const videosRef = collection(db, 'videos'); // Referencia a la colección de videos en Firestore
    const q = query(videosRef, where('usuario', '==', user.uid)); // Filtra los videos del usuario actual

    // Escucha los cambios en los videos y actualiza el estado
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videosData); // Actualiza la lista de videos
      setLoading(false); // Termina la carga
    });

    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, [user]);

  // Función para actualizar el estado de "visto" del video en Firestore
  const toggleWatchedInFirestore = async (videoId, isWatched) => {
    try {
      const videoDoc = doc(db, 'videos', videoId); // Referencia al documento del video
      await updateDoc(videoDoc, { visto: !isWatched }); // Actualiza el campo "visto" en Firestore
    } catch (error) {
      console.error("Error actualizando el estado:", error); // Manejo de errores
    }
  };

  // Filtra los videos según el filtro seleccionado (vistos, no vistos, o todos)
  const filteredVideos = videos.filter((video) => {
    if (filter === "vistos") return video.visto;
    if (filter === "noVistos") return !video.visto;
    return true; // Devuelve todos los videos si el filtro es "todos"
  });

  // Función para manejar la navegación entre secciones
  const handlePress = (id) => {
    if (id === 1) {
      navigation.navigate('Favoritos'); // Navega a la sección de favoritos
    }
    if (id === 2) {
      navigation.navigate('SubirVideo'); // Navega a la sección de subir video
    }
    if (id === 3) {
      navigation.navigate('Listas'); // Navega a la sección de listas
    }
    if (id === 4) {
      setPopupVisible(true); // Muestra el popup de logout
    }
  };

  // Si los datos están cargando, muestra el indicador de carga
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffffff" /> {/* Indicador de carga */}
        <Text style={styles.loaderText}>Cargando favoritos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
      </View>

      <View style={styles.filterButtons}>
        {/* Botones de filtro para los videos */}
        <TouchableOpacity onPress={() => setFilter("vistos")} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Vistos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("noVistos")} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>No Vistos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("todos")} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Todos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Muestra las celdas de los videos filtrados */}
        {filteredVideos.map((video) => (
          video.tipo === 'YouTube' ? (
            <YouTubeCell
              key={video.id}
              videoUrl={video.enlace} 
              initialTitle={video.titulo} 
              fechaCreacion={video.fechaCreacion} 
              isWatched={video.visto} 
              onToggleWatched={() => toggleWatchedInFirestore(video.id, video.visto)} 
            />
          ) : (
            <InstagramCell
              key={video.id}
              videoUrl={video.enlace} 
              initialTitle={video.titulo} 
              fechaCreacion={video.fechaCreacion} 
              isWatched={video.visto} 
              onToggleWatched={() => toggleWatchedInFirestore(video.id, video.visto)} 
            />
          )
        ))}

        {/* Celda de "No hay más videos" al final */}
        <View style={styles.noMoreVideosCell}>
          <Text style={styles.noMoreVideosText}>No hay videos</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <FSection currentSection={1} onPress={handlePress} />
      </View>

      {/* Popup de logout */}
      <LogoutPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        onConfirm={() => {
          setPopupVisible(false);
          navigation.navigate('Login'); // Redirige a login al confirmar
        }}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00910E' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00910E',
    zIndex: 10,
  },
  title: { fontSize: 30, fontWeight: 'bold', color: 'white' },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 100,
  },
  filterButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  filterButtonText: { color: 'black', fontSize: 16 },
  scrollView: {
    marginTop: 25,
    flex: 1,
    paddingBottom: 90,
  },
  footer: {
    backgroundColor: '#00910E',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00910E',
  },
  loaderText: { color: 'white', fontSize: 16, marginTop: 10 },
  noMoreVideosCell: {
    backgroundColor: 'white',
    padding: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMoreVideosText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});
