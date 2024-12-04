import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FSection from '../components/FSection';
import LogoutPopup from '../components/PopUp'; // Asegúrate de importar el componente de popup

export default function Favoritos({ navigation }) {
  const [isPopupVisible, setPopupVisible] = useState(false);

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
        <Text style={styles.title}>Favoritos</Text>
      </View>
      <View style={styles.content} />
      <View style={styles.footer}>
        <FSection currentSection={1} onPress={handlePress} />
      </View>

      <LogoutPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)} // Cierra el popup cuando se presiona "No"
        onConfirm={() => {
          setPopupVisible(false); // Cierra el popup
          navigation.navigate('Login'); // Navega a la pantalla Favoritos
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
  content: { flex: 6 },
  footer: { flex: 1 },
});
