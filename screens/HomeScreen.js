import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Input, Button } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";

const HomeScreen = ({ navigation }) => {
    const [transactions, setTransactions] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchTransactions = async () => {
            const storedTransactions = JSON.parse(await AsyncStorage.getItem('transactions')) || [];
            setTransactions(storedTransactions);
        };

        fetchTransactions();
    }, [isFocused]);

    const incomes = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
    const balance = incomes + expenses;

    //const navigation = useNavigation();
    const transactionsDay = [
        { id: '1', description: 'Comidas', amount: -250 },
        { id: '2', description: 'Nomina', amount: 10000 },
    ];

    const deleteTransaction = async (id) => {
        const newTransaction = transactions.filter(t => t.id !== id);
        setTransactions(newTransaction);
        await AsyncStorage.setItem('transactions', JSON.stringify(newTransaction));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.summaryText}>Ingresos: ${incomes.toFixed(2)}</Text>
            <Text style={styles.summaryText}>Gastos: ${expenses.toFixed(2)}</Text>
            <Text style={styles.summaryText}>Balance: ${balance.toFixed(2)}</Text>
            <Text style={styles.title}>Transacciones</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('AddTransactionScreen', { transaction: item })}>
                        <View style={styles.transaction}>
                            <Text style={styles.items}>{item.description}</Text>
                            <Text style={styles.items}>{item.amount}</Text>
                            <Button title="Eliminar" onPress={() => deleteTransaction(item.id)} />
                        </View>
                    </TouchableOpacity>
                )}
            />

            <Button title="Agregar Transacción" onPress={() => navigation.navigate('AddTransactionsScreen')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    summaryText: {
        fontSize: 16,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        color: '#000'
    },
    items: {
        fontSize: 24,
        color: '#000'
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: '#000'
    }
});

export default HomeScreen;