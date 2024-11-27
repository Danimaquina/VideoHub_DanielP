import React from 'react';
import { View, Text, Button} from 'react-native';

export default function DetailsScreen({ route, navigation }) {
  const { title, description } = route.params; // Rebem el text passat des de HomeScreen

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details Screen</Text>
      <Text>Title: {title}</Text>
      <Text>Description: {description}</Text>
      <Button
        title="Go back"
        onPress={()=> navigation.goBack()}
      />
      <Button
        title="Go to Home Screen"
        onPress={()=> navigation.popToTop()}
      />
    </View>
  );
}
