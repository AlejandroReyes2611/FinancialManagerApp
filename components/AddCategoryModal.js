import React, { useState } from "react";
import { View, TextInput, Text, Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

const AddCategodryModal = ({ isVisible, onClose, onAdd }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleAdd = () => {
        if (categoryName.trim()) {
            onAdd(categoryName.trim());
            setCategoryName('');
            onClose();
        } else {
            alert('Por favor, introduce un nombre válido para la categoría.');
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide">
            <View style={styles.container}>
                <Text style={styles.title}>Agregar Categoría</Text>
                <TextInput
                    value={categoryName}
                    onChangeText={setCategoryName}
                    placeholder="Nombre de la categoría"
                    style={styles.input}
                />
                <Button title="Agregar" onPress={handleAdd} buttonStyle={styles.addButtonCategory} titleStyle={styles.addButtonCategoryText}/>
                <Button title="Cancelar" onPress={onClose} buttonStyle={styles.cancelButton}/>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 26,
        height: '100%'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#000'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 16,
        padding: 8,
        color: '#000'
    },
    addButtonCategory: {
        backgroundColor: '#0000FF',
        padding: 10,
        marginBottom: 20,
    },
    addButtonCategoryText: {
        color: '#FFFFFF', 
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: 'red',
    },
});

export default AddCategodryModal;
