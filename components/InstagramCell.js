import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from "react-native";
import * as WebBrowser from 'expo-web-browser'; // Usamos expo-web-browser

const InstagramCell = ({ videoUrl, addedDate, initialTitle = "" }) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState(false);
  const [isWatched, setIsWatched] = useState(false); // Estado para marcar como visto


  const toggleWatched = () => {
    setIsWatched(prevState => !prevState); // Alternar el estado de visto
  };

  // Validar que el enlace de Instagram sea válido
  const isValidInstagramUrl = (url) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]{11})/;
    return regExp.test(url);
  };

  // Normalizar la URL para asegurar que sea una URL web válida
  const normalizeUrl = (url) => {
    if (url.includes("instagram://") || url.includes("iglite://")) {
      return url.replace(/^(instagram:\/\/|iglite:\/\/)/, "https://www.instagram.com/");
    }
    return url; // Si ya está en el formato correcto, la retornamos tal cual
  };

  // Validar y establecer el video URL
  const fetchVideoUrl = (url) => {
    if (isValidInstagramUrl(url)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  // Llamar a la validación al cargar el componente
  useEffect(() => {
    fetchVideoUrl(videoUrl);
  }, [videoUrl]);

  const openVideoInBrowser = () => {
    WebBrowser.openBrowserAsync(normalizeUrl(videoUrl));
    setIsVideoVisible(false);
  };

  return (
    <View style={styles.cellContainer}>
      {/* Mostrar miniatura o mensaje de error */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: URL no válida</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setIsVideoVisible(true)}>
          <Image
            source={require('../assets/1.png')}
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

      {/* Modal para mostrar el video */}
      <Modal visible={isVideoVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.openVideoButton}
            onPress={openVideoInBrowser}
          >
            <Text style={styles.openVideoText}>Abrir Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsVideoVisible(false)}
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
  openVideoButton: {
    backgroundColor: "#ff3b30",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  openVideoText: {
    color: "#fff",
    fontSize: 16,
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

export default InstagramCell;