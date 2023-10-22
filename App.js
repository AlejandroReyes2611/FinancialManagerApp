import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';
import AddTransactionsScreen from './screens/AddTransactionsScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: 'Mis transacciones',
              tabBarIcon: ({ focused, color, size }) => {
                let iconName = focused ? 'home' : 'home-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              }
            }}
          />
          <Tab.Screen
            name="AddTransactionsScreen"
            component={AddTransactionsScreen}
            options={{
              title: 'Agregar Transaccion',
              tabBarIcon: ({ focused, color, size }) => {
                let iconName = focused ? 'add-circle' : 'add-circle-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              }
            }}
          />
          
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
