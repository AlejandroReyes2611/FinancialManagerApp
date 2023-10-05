import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Picker } from "@react-native-picker/picker";

const CATEGORIES = [
    { id: 'food', name: 'Alimentos' },
    { id: 'transport', name: 'Transporte' },
    { id: 'entertainment', name: 'Entretenimiento' },
];

const AddTransactionsScreen = ({ navigation, route }) => {
    const { transaction } = route.params || {};

    const [description, setDescription] = useState(transaction ? transaction.description : '');
    const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '');
    const [categoryId, setCategoryId] = useState(transaction ? transaction.categoryId : CATEGORIES[0].id);
    const [isIncome, setIsIncome] = useState(true);

    let transactionCounter = 0;

    const handleSave = async () => {
        if (!description.trim()) {
            alert('Por favor, introduce una descripción.');
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (!amount.trim() || isNaN(parsedAmount)) {
            alert('Por favor, introduce un monto válido.');
            return;
        }

        try {
            const currentTransactions = JSON.parse(await AsyncStorage.getItem('transactions')) || [];
            
            const finalAmount = isIncome ? Math.abs(parsedAmount) : -Math.abs(parsedAmount);

            const newTransaction = {
                id: transaction ? transaction.id : `${new Date().toISOString()}-${transactionCounter++}`,
                description,
                amount: finalAmount,
                categoryId
            };

            if (transaction) {
                const index = currentTransactions.findIndex(t => t.id === transaction.id);
                currentTransactions[index] = newTransaction;
            } else {
                currentTransactions.push(newTransaction);
            }

            await AsyncStorage.setItem('transactions', JSON.stringify(currentTransactions));
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Text>Gasto</Text>
                <Switch
                    value={isIncome}
                    onValueChange={(value) => setIsIncome(value)}
                />
                <Text>Ingreso</Text>
            </View>
            <Picker
                selectedValue={categoryId}
                onValueChange={(itemValue) => setCategoryId(itemValue)}>
                {CATEGORIES.map((category) => (
                    <Picker.Item style={{ color: '#000' }} key={category.id} label={category.name} value={category.id} />
                ))}
            </Picker>
            <Button title="Guardar" onPress={handleSave} />
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
