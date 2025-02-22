import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screen/HomeScreen';
import CartScreen from './Screen/CartScreen';
import ContactScreen from './Screen/ContactScreen';
import FavoritesScreen from './Screen/FavoritesScreen';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

function BottomTabNavigator({ route }) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          backgroundColor: '#1F1F1F', 
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
        },
        labelStyle: {
          fontSize: 14, 
          color: '#FFF', 
        },
        iconStyle: {
          size: 30,
          color: '#FFF',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('./icon/home.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        
        options={{
          headerShown: false, 
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('./icon/cart.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          headerShown: false, 
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('./icon/favorite.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          headerShown: false, 
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('./icon/contcact.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;