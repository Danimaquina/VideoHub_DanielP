import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de haber instalado react-native-vector-icons

const QuestionCell = ({ imageUrl, title, latitude, longitude, onPress }) => {
  
  // Si no hay imageUrl, usar imagen por defecto
  const imageSource = imageUrl
    ? { uri: imageUrl }
    : require('../assets/images/defaultImage.jpeg'); // Ruta a tu imagen por defecto

  return (
    <View style={styles.container}>
      {/* Imagen en el 30% de la celda */}
      <Image source={imageSource} style={styles.image} />

      {/* Contenedor de texto para el título y coordenadas */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.coordinates}>Lat: {latitude}, Lon: {longitude}</Text>
      </View>

      {/* Botón con icono de ir a detalles */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Icon name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a1a1a', // Fondo casi negro
    borderBottomWidth: 1,
    borderColor: '#333',
    borderRadius: 10, // Bordes redondeados
    marginVertical: 5, // Margen para que no esté pegado a otras celdas
    elevation: 3, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  image: {
    width: '30%',
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Texto en blanco
    marginBottom: 10, // Espacio entre el título y las coordenadas
  },
  coordinates: {
    fontSize: 14,
    color: '#bbb', // Coordenadas en gris claro
  },
  button: {
    width: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuestionCell;
