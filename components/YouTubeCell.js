import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Alert} from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";

const YouTubeCell = ({ videoUrl, addedDate, initialTitle = "" }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState(false);
  const [isWatched, setIsWatched] = useState(false); // Estado para marcar como visto

  const toggleWatched = () => {
    setIsWatched(prevState => !prevState); // Alternar el estado de visto
  };

  // Mejorar la expresión regular para obtener el ID de YouTube
  const getVideoId = (url) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|\?v=|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Descargar la miniatura del video
  const fetchThumbnail = (videoId) => {
    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      setThumbnail(thumbnailUrl);
      setError(false);
    } else {
      setError(true);
    }
  };

  // Obtener la miniatura al cargar el componente o cambiar la URL
  useEffect(() => {
    const videoId = getVideoId(videoUrl);
    fetchThumbnail(videoId);
  }, [videoUrl]);

  // Manejar estado del video
  const handleStateChange = useCallback((state) => {
    if (state === "ended") {
      setIsPlaying(false);
      Alert.alert("El video ha terminado");
    }
  }, []);

  return (
    <View style={styles.cellContainer}>
      {/* Portada del video */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: URL no válida</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setIsPlaying(true)}>
          <Image
            source={{ uri: thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {/* Detalles */}
      <View style={styles.detailsContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Escribe un título..."
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={styles.dateText}>Fecha de adición: {addedDate}</Text>

        {/* Botón "Visto" */}
        <TouchableOpacity
          style={[styles.watchedButton, isWatched && styles.watchedActive]}
          onPress={toggleWatched}
        >
          <Text style={styles.watchedButtonText}>{isWatched ? 'Visto' : 'Marcar como Visto'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para reproducir el video */}
      <Modal visible={isPlaying} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <YoutubeIframe
            height={300}
            width="100%"
            videoId={getVideoId(videoUrl)}
            play={isPlaying}
            onChangeState={handleStateChange}
            forceAndroidAutoplay={true}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsPlaying(false)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbnail: {
    height: 200,
    width: "100%",
  },
  detailsContainer: {
    padding: 10,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#555",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#ff3b30",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8d7da",
  },
  errorText: {
    color: "#721c24",
    fontSize: 16,
    fontWeight: "bold",
  },
  watchedButton: {
    backgroundColor: '#00910E', // Color de fondo
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  watchedActive: {
    backgroundColor: '#ff3b30', // Color cuando está marcado como visto
  },
  watchedButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default YouTubeCell;
