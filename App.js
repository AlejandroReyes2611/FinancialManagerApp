import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddTransactionsScreen from './screens/AddTransactionsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Gestor Financiero' }} />
        <Stack.Screen name="AddTransactionsScreen" component={AddTransactionsScreen} options={{ title: 'Agregar Transacciones' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
