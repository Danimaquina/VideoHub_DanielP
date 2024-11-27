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

    return (
        <TouchableOpacity onPress={() => onPress(id)} style={styles.buttonContainer}>
            <View style={styles.iconContainer}>
                <Icon
                    name={isSelected ? selectedIcon : unselectedIcon}
                    size={50}
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
    },
    iconContainer: {
        alignItems: 'center',
    },
    icon: {
        margin: 10,
    },
    selectedLine: {
        height: 2,
        backgroundColor: 'black',
        width: 50, // Ajusta este valor para que coincida con el tamaño del icono o lo que necesites
        marginTop: 5,
    },
});
