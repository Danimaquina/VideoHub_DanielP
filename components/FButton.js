import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function FButton({ 
    selectedIcon,
    unselectedIcon,
    id,
    isSelected,
    onPress 
}) {
    const iconSize = 60; // Cambia este valor para ajustar el tamaño del icono

    return (
        <TouchableOpacity onPress={() => onPress(id)} style={styles.buttonContainer}>
            <View style={styles.iconContainer}>
                <Icon
                    name={isSelected ? selectedIcon : unselectedIcon}
                    size={iconSize} // Tamaño del ícono
                    style={styles.icon}
                />
                {isSelected && <View style={styles.selectedLine} />}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        marginHorizontal: 10, // Espacio entre los botones
    },
    iconContainer: {
        alignItems: 'center',
    },
    icon: {
        margin: 10,
    },
    selectedLine: {
        height: 4, // Línea más gruesa para indicar selección
        backgroundColor: 'black',
        width: 60, // Ajusta al tamaño del ícono
        marginTop: 5,
    },
});
