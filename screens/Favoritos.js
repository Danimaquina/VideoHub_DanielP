import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import FSection from '../components/FSection';
import LogoutPopup from '../components/PopUp'; // Asegúrate de importar el componente de popup
import YouTubeCell from "../components/YouTubeCell";
import InstagramCell from "../components/InstagramCell";

export default function Favoritos({ navigation }) {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [filter, setFilter] = useState("todos"); // Estado para el filtro

  // Ejemplo de videos con el estado de "visto"
  const videos = [
    { id: 1, platform: 'youtube', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', addedDate: '04/12/2024', title: 'Tutorial increíble', isWatched: true },
    { id: 2, platform: 'instagram', videoUrl: 'https://www.instagram.com/reel/Cxi3UUZoJJ_/', addedDate: '03/12/2024', title: 'Mi video de Instagram', isWatched: false },
    { id: 3, platform: 'instagram', videoUrl: 'https://www.instagram.com/reel/Cxi3UUZoJJ_/', addedDate: '03/12/2024', title: 'Mi video de Instagram', isWatched: false },
  ];

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

  // Filtrar los videos según el estado de "visto"
  const filteredVideos = videos.filter((video) => {
    if (filter === "vistos") return video.isWatched;
    if (filter === "noVistos") return !video.isWatched;
    return true; // Mostrar todos los videos
  });

  return (
    <View style={styles.container}>
      {/* Título fijo */}
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
      </View>

      {/* Filtro de videos */}
      <View style={styles.filterButtons}>
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

      {/* Scroll para las celdas de videos filtrados */}
      <ScrollView style={styles.scrollView}>
        {filteredVideos.map((video) => (
          video.platform === 'youtube' ? (
            <YouTubeCell key={video.id} videoUrl={video.videoUrl} addedDate={video.addedDate} initialTitle={video.title} />
          ) : (
            <InstagramCell key={video.id} videoUrl={video.videoUrl} addedDate={video.addedDate} initialTitle={video.title} />
          )
        ))}
      </ScrollView>

      {/* Footer con botones estáticos */}
      <View style={styles.footer}>
        <FSection currentSection={1} onPress={handlePress} />
      </View>

      {/* Popup de Logout */}
      <LogoutPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)} // Cierra el popup cuando se presiona "No"
        onConfirm={() => {
          setPopupVisible(false); // Cierra el popup
          navigation.navigate('Login'); // Navega a la pantalla Login
        }}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00910E' },

  // Estilo para el header (título fijo)
  header: {
    position: 'absolute', // Hace que el título sea fijo en la parte superior
    top: 0,
    left: 0,
    right: 0,
    height: 80, // Ajusta el tamaño del header
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00910E', // Mantén el fondo consistente
    zIndex: 10, // Para asegurarse de que el header esté sobre el contenido
  },

  // Estilo del título
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },

  // Estilo de los botones de filtro
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 100, // Espacio para que no quede pegado al header
  },
  filterButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16,
  },

  // Scroll de las celdas de video
  scrollView: {
    marginTop: 25, // Deja espacio para el header fijo y los botones de filtro
    flex: 1,
    paddingBottom: 90, // Aumentamos el paddingBottom para dejar espacio para el footer
  },

  // Footer para los botones
  footer: {
    backgroundColor: '#00910E', // Color de fondo para el footer
    position: 'absolute', // Asegura que el footer quede fijo en la parte inferior
    bottom: 0,
    left: 0,
    right: 0,
  },
});