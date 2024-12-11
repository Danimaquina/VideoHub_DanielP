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
  const [filter, setFilter] = useState("todos");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }

    const videosRef = collection(db, 'videos');
    const q = query(videosRef, where('usuario', '==', user.uid)); 

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videosData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleWatchedInFirestore = async (videoId, isWatched) => {
    try {
      const videoDoc = doc(db, 'videos', videoId);
      await updateDoc(videoDoc, { visto: !isWatched });
    } catch (error) {
      console.error("Error actualizando el estado:", error);
    }
  };

  const filteredVideos = videos.filter((video) => {
    if (filter === "vistos") return video.visto;
    if (filter === "noVistos") return !video.visto;
    return true;
  });

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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffffff" />
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
          <Text style={styles.noMoreVideosText}>No hay más videos</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <FSection currentSection={1} onPress={handlePress} />
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
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  filterButtonText: { color: 'white', fontSize: 16 },
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
  // Estilos para la celda "No hay más videos"
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
