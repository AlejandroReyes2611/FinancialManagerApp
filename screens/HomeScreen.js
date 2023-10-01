import React from "react";
import { View, Text, StyleSheet, FlatList } from 'react-native';

const HomeScreen = () => {
    const transactionsDay  = [
        { id: '1', description: 'Comidas', amount: -250 },
        { id: '2', description: 'Nomina', amount: 10000 },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transacciones</Text>
            <FlatList
                data={transactionsDay}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.transaction}>
                        <Text>{item.description}</Text>
                        <Text>{item.amount}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title:{
        fontSize: 24,
        marginBottom: 16,
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    }
});

export default HomeScreen;