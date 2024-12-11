import React, { useState, useEffect } from 'react';  
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, ScrollView } from 'react-native';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import FSection from '../components/FSection';  
import LogoutPopup from '../components/PopUp';
import YouTubeCell from "../components/YouTubeCell";  
import InstagramCell from "../components/InstagramCell";  
import { getAuth } from 'firebase/auth';  
import moment from 'moment'; // Para representar la data

export default function Listas({ navigation }) {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [listas, setListas] = useState([]);  
  const [selectedListVideos, setSelectedListVideos] = useState([]);  
  const [creatingList, setCreatingList] = useState(false);  
  const [newListTitle, setNewListTitle] = useState('');  

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

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

  // Fetch lists for the authenticated user
  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }

    const fetchListas = async () => {
      const listasCollection = collection(db, 'listas');
      const listasSnapshot = await getDocs(listasCollection);
      const listasData = await Promise.all(
        listasSnapshot.docs.map(async (doc) => {
          const list = { id: doc.id, ...doc.data() };
          // Verificar que la lista pertenece al usuario autenticado
          if (list.userId === user.uid) {
            // Obtenemos la cantidad de videos en el campo 'contenido'
            const videoCount = list.contenido ? list.contenido.length : 0;
            return { ...list, videoCount }; // Añadimos el número de videos
          }
          return null; // No incluir listas de otros usuarios
        })
      );
      // Filtrar listas nulas (listas que no pertenecen al usuario actual)
      setListas(listasData.filter(list => list !== null));
    };

    fetchListas();  
  }, [user]);

  const fetchVideosForList = async (listId) => {
    const listDocRef = doc(db, 'listas', listId);
    const listSnapshot = await getDoc(listDocRef);
    const listData = listSnapshot.data();
    const videoIds = listData.contenido;

    const videosData = await Promise.all(
      videoIds.map(async (videoId) => {
        const videoDocRef = doc(db, 'videos', videoId);
        const videoSnapshot = await getDoc(videoDocRef);
        return videoSnapshot.data();
      })
    );

    // Ordenar los videos según la fecha de creación (más reciente primero)
    const sortedVideos = videosData.sort((a, b) => {
      const dateA = moment(a.fechaCreacion?.toDate());
      const dateB = moment(b.fechaCreacion?.toDate());
      return dateB - dateA; // Ordena en orden descendente
    });

    setSelectedListVideos(sortedVideos);  
  };

  const handleCreateList = async () => {
    if (newListTitle.trim() === '') {
      alert("El título de la lista no puede estar vacío.");
      return;
    }

    // Agregar la lista con el UID del usuario
    await addDoc(collection(db, 'listas'), {
      title: newListTitle,
      contenido: [],
      userId: user.uid,  // Agregar el ID del usuario que creó la lista
    });
    
    setNewListTitle('');
    setCreatingList(false);
  
    // Refrescar las listas después de crear una nueva
    const listasSnapshot = await getDocs(collection(db, 'listas'));
    const listasData = listasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filtrar las listas solo para mostrar las del usuario actual
    setListas(listasData.filter(list => list.userId === user.uid));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Mis Listas</Text>

      <TouchableOpacity
        style={styles.createListButton}
        onPress={() => setCreatingList(true)}
      >
        <Text style={styles.createListText}>Crear Lista</Text>
      </TouchableOpacity>

      <FlatList
        data={listas}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => fetchVideosForList(item.id)}
          >
            <Text style={styles.listTitle}>
              {item.title || 'Sin título'}
            </Text>
            <Text style={styles.videoCountText}>
              {item.videoCount} {item.videoCount === 1 ? 'video' : 'videos'}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyListText}>No tienes listas aún. ¡Crea una!</Text>}
      />

      {creatingList && (
        <Modal
          visible={creatingList}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setCreatingList(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.createListModal}>
              <TextInput
                style={styles.input}
                placeholder="Título de la nueva lista"
                value={newListTitle}
                onChangeText={setNewListTitle}
              />
              <Button title="Crear Lista" onPress={handleCreateList} />
              <TouchableOpacity onPress={() => setCreatingList(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        visible={selectedListVideos.length > 0}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedListVideos([])}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={() => setSelectedListVideos([])} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
          <ScrollView style={styles.scrollView}>
            {selectedListVideos.map((video) => {
              if (video.tipo === 'YouTube') {
                return (
                  <YouTubeCell
                    key={video.titulo} // Usa 'titulo' como clave
                    videoUrl={video.enlace}
                    initialTitle={video.titulo}
                    isWatched={video.visto}
                    onToggleWatched={() => {}}
                  />
                );
              } else if (video.tipo === 'Instagram') {
                return (
                  <InstagramCell
                    key={video.titulo} // Usa 'titulo' como clave
                    videoUrl={video.enlace}
                    initialTitle={video.titulo}
                    isWatched={video.visto}
                    onToggleWatched={() => {}}
                  />
                );
              } else {
                return null;
              }
            })}
          </ScrollView>
        </View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <FSection currentSection={3} onPress={handlePress} />
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
  container: { flex: 1, backgroundColor: '#00910E', paddingBottom: 60 },
  screenTitle: { fontSize: 29, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginVertical: 20 },
  createListButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    position: 'absolute',
    top: 30,
    right: 20,
    borderRadius: 50,
    zIndex: 1,
  },
  createListText: { color: '#fff', fontSize: 18 },
  listItem: { backgroundColor: '#fff', padding: 15, marginVertical: 10, borderRadius: 5, width: '100%', maxWidth: 400, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listTitle: { fontSize: 18, fontWeight: 'bold' },
  videoCountText: { fontSize: 14, color: '#666' },
  emptyListText: { color: '#fff', fontSize: 20, textAlign: 'center' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  createListModal: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  input: { height: 40, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, paddingLeft: 10 },
  closeButton: { backgroundColor: '#ff3b30', padding: 10, borderRadius: 5, marginTop: 20 },
  closeButtonText: { color: '#fff', fontSize: 16 },
  scrollView: { marginTop: 20, paddingHorizontal: 10 },
  footer: { position: 'absolute', bottom: 0, width: '100%' },
});
