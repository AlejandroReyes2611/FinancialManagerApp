import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';


const AddTransactionsScreen = ({ navigation, route }) => {

    const { transaction } = route.params || {};

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    let transactionCounter = 0;

    const handleSave = async () => {
        try {
            const newTransaction = {
                id: `${new Date().toISOString()}-${transactionCounter++}`,
                description: description,
                amount: parseFloat(amount),
            };

            let storedTransactions = JSON.parse(await AsyncStorage.getItem('transactions')) || [];
            
            // Check for duplicate IDs
            if (storedTransactions.some(t => t.id === newTransaction.id)) {
                console.warn("Intentando guardar una transacción con un ID duplicado:", newTransaction.id);
                return;
            }

            if (route.params?.transaction) {
                const index = storedTransactions.findIndex(t => t.id === route.params.transaction.id);
                storedTransactions[index] = newTransaction;
            } else {
                storedTransactions.push(newTransaction);
            }

            await AsyncStorage.setItem('transactions', JSON.stringify(storedTransactions));
            navigation.goBack();
        } catch (error) {
            console.error('Error al guardar la transacción:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Descripción:</Text>
            <Input
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <Text style={styles.label}>Monto:</Text>
            <Input
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button title="Guardar Transacción" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'white',
        flex: 1
    },
    label: {
        marginBottom: 8,
        color: '#000'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 16,
        padding: 8,
    },
});

export default AddTransactionsScreen;