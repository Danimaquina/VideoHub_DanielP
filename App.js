import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favoritos from './screens/Favoritos';
import Listas from './screens/Listas';
import SubirVideo from './screens/SubirVideo';
import Login from './screens/Login'; // Nueva pantalla de Login
import Register from './screens/Register'; // Nueva pantalla de Register

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Favoritos" component={Favoritos} />
        <Stack.Screen name="Listas" component={Listas} />
        <Stack.Screen name="SubirVideo" component={SubirVideo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
