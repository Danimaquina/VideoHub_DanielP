import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import FSection from '../components/FSection';
import QuestionCell from '../components/QuestionCell';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig'; // Asegúrate de importar tu configuración de Firebase


export default function HomeScreen({ navigation }) {
    
    const [data, setData] = useState([]); // Estado para almacenar los datos de Firestore


    // Función para obtener los datos desde Firestore
    const fetchData = async () => {
      try {
          const querySnapshot = await getDocs(collection(db, 'Preguntes'));
          const dataFromFirestore = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(), // Agregar los datos de cada documento
          }));
          console.log(JSON.stringify(dataFromFirestore));
          setData(dataFromFirestore); // Guardar los datos en el estado
      } catch (error) {
          console.error("Error al obtener los datos: ", error);
      }
  };

  // Cargar los datos al montar el componente
  useEffect(() => {
      fetchData();
  }, []);

    // Función para manejar los eventos onPress de las celdas
    const handlePress = (id) => {
      console.log("Han clicat al botó " + id);
      if (id === '2') {
        navigation.navigate("Page1");
      } else if (id === '3') {
        navigation.navigate("Page2");
      }
    };

    // Renderizar cada celda
    const renderItem = ({ item }) => (
      <QuestionCell 
        imageUrl={item.ImageURL}
        title={item.Title}
        latitude={item.GeoLocation.latitude}
        longitude={item.GeoLocation.longitude}
        onPress={() => handlePress(item.id)}
      />
    );

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 7, backgroundColor: 'white' }}>
          <Text style={{ marginTop: 100, textAlign: 'center' }}>Home Screen</Text>

          {/* FlatList para mostrar el array de celdas */}
          <View style={{height:'50%'}}>
            <FlatList 
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>
          
        </View>

        <View style={{ flex: 1, backgroundColor: 'green' }}>
          <FSection currentSection={1} onPress={handlePress} />
        </View>
      </View>
    );
}
