import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, FlatList, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Input, Button } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const CATEGORIES = [
    { id: 'all', name: 'Todas' },
    { id: 'food', name: 'Alimentos' },
    { id: 'transport', name: 'Transporte' },
    { id: 'entertainment', name: 'Entretenimiento' },
]

const TRANSACTION_TYPES = [
    { id: 'all', name: 'Todas' },
    { id: 'income', name: 'Ingrensos' },
    { id: 'expense', name: 'Gastos' },
]

const HomeScreen = ({ navigation }) => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const isFocused = useIsFocused();
    const isMounted = useRef(true);

    const barData = {
        labels: CATEGORIES.filter(c => c.id !== 'all').map(c => c.name),
        datasets: [{
            data: CATEGORIES.filter(c => c.id !== 'all').map(category => {
                return transactions.filter(t => t.categoryId === category.id).reduce((acc, t) => acc + t.amount, 0);
            })
        }]
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const storedTransactions = JSON.parse(await AsyncStorage.getItem('transactions')) || [];
                if (isMounted.current) {
                    setTransactions(storedTransactions);
                    filterTransactions(storedTransactions, selectedCategory, selectedType);
                }
            } catch (error) {
                console.log('Error al cargar las transacciones:', error);
            }
        };

        fetchTransactions();
    }, [selectedCategory, selectedType, isFocused]);

    getCategoryName = (id) => {
        const category = CATEGORIES.find(cat => cat.id === id);
        return category ? category.name : 'Sin categoria';
    };

    const filterTransactions = (transactionsList, category, type) => {
        let filtered = [...transactionsList];

        if (category !== 'all') {
            filtered = filtered.filter(t => t.categoryId === category);
        }

        if (type !== 'all') {
            if (type === 'income') {
                filtered = filtered.filter(t => t.amount >= 0);
            } else if (type === 'expense') {
                filtered = filtered.filter(t => t.amount < 0);
            }
        }

        setFilteredTransactions(filtered);
    };

    const incomes = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
    const balance = incomes + expenses;

    const chartData = CATEGORIES.filter(c => c.id !== 'all').map(category => {
        const total = transactions.filter(t => t.categoryId === category.id).reduce((acc, t) => acc + t.amount, 0);
        return {
            name: category.name,
            amount: Math.abs(total),
            color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Genera un color aleatorio para la categoría
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        };
    }).filter(item => item.amount > 0); // Filtra categorías que tienen gasto


    //const navigation = useNavigation();
    const transactionsDay = [
        { id: '1', description: 'Comidas', amount: -250 },
        { id: '2', description: 'Nomina', amount: 10000 },
    ];

    const deleteTransaction = async (id) => {
        Alert.alert(
            "Eliminar Transacción",
            "¿Estás seguro de que quieres eliminar esta transacción?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar", onPress: async () => {
                        const newTransactionList = transactions.filter(t => t.id !== id);
                        setTransactions(newTransactionList);
                        filterTransactions(newTransactionList, selectedCategory);
                        await AsyncStorage.setItem('transactions', JSON.stringify(newTransactionList));
                    }
                }
            ]
        );
    }

    return (

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            
            <View style={styles.container}>
                <Text style={styles.title}>Tipo de Transacción:</Text>
                <Picker
                    selectedValue={selectedType}
                    onValueChange={(itemValue) => setSelectedType(itemValue)}
                >
                    {TRANSACTION_TYPES.map((type) => (
                        <Picker.Item style={{ color: '#000' }} key={type.id} label={type.name} value={type.id} />
                    ))}
                </Picker>
                <Text style={styles.title}>Categorias</Text>                
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={
                        <>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                            >
                                {CATEGORIES.map((category) => (
                                    <Picker.Item style={{ color: '#000' }} key={category.id} label={category.name} value={category.id} />
                                ))}
                            </Picker>

                            <Text style={styles.summaryText}>Ingresos: ${incomes.toFixed(2)}</Text>
                            <Text style={styles.summaryText}>Gastos: ${expenses.toFixed(2)}</Text>
                            <Text style={styles.summaryText}>Balance: ${balance.toFixed(2)}</Text>
                            <Text style={styles.title}>Transacciones</Text>
                            <View style={{ backgroundColor: '#fff', marginBottom: 10 }}>
                                <BarChart
                                    data={barData}
                                    width={Dimensions.get("window").width - 16}
                                    height={220}
                                    yAxisSuffix="$"
                                    chartConfig={{
                                        backgroundColor: '#FFFFFF',
                                        backgroundGradientFrom: '#FFFFFF',
                                        backgroundGradientTo: '#FFFFFF',
                                        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                        strokeWidth: 2,
                                        barPercentage: 0.5,
                                    }}
                                    style={{
                                        borderRadius: 16
                                    }}
                                />

                            </View>

                            <Button title="Agregar Transacción" onPress={() => navigation.navigate('AddTransactionsScreen')} />
                        </>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.transactionContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('AddTransactionScreen', { transaction: item })}>
                                <View style={styles.transaction}>
                                    <Text style={styles.items}>{item.description} ({getCategoryName(item.categoryId)})</Text>
                                    <Text style={styles.items}>{item.amount}</Text>
                                </View>
                            </TouchableOpacity>
                            <Button title="Eliminar" onPress={() => deleteTransaction(item.id)} />
                        </View>
                    )}
                />


            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    summaryText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#000'
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        color: '#000'
    },
    items: {
        fontSize: 14,
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