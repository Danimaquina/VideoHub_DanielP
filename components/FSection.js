import React from 'react';
import { View, StyleSheet } from 'react-native';
import FButton from './FButton';


export default function FSection({ currentSection, onPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <FButton 
          selectedIcon="heart" 
          unselectedIcon="heart-outline" 
          id={1} 
          onPress={onPress} 
          isSelected={currentSection == 1}
        />
        <FButton 
          selectedIcon="arrow-up" 
          unselectedIcon="arrow-up" 
          id={2} 
          onPress={onPress} 
          isSelected={currentSection == 2}
        />
        <FButton 
          selectedIcon="dots-horizontal" 
          unselectedIcon="dots-horizontal" 
          id={3} 
          onPress={onPress} 
          isSelected={currentSection == 3}
        />
        <FButton 
          selectedIcon="arrow-right" 
          unselectedIcon="arrow-right" 
          id={4} 
          onPress={onPress} 
          isSelected={currentSection == 4}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 15, // Más espacio vertical
    paddingHorizontal: 20, // Más espacio horizontal
    borderWidth: 1,
    borderColor: 'black',
  },
});
