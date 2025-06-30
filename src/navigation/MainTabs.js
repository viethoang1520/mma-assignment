  import { Text, View } from 'react-native'
  import React from 'react'
  
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
  import HomeScreen from '../screens/Home/HomeScreen';
  import FavoriteScreen from '../screens/Favorite/FavoriteScreen';
  import ChatAI from '../screens/ChatAI/ChatAI';
  const Tab = createBottomTabNavigator();
  
  export default function RootNavigator() {
    return (
      <Tab.Navigator initialRouteName='Home'>
        <Tab.Screen name='Home' component={HomeScreen} options={{ headerShown: false, tabBarShowLabel: true}}></Tab.Screen>
        <Tab.Screen name='Favorite' component={FavoriteScreen} options={{headerShown: false}} ></Tab.Screen>
        <Tab.Screen name='ChatAI' component={ChatAI} options={{headerShown: false, tabBarShowLabel: true}} ></Tab.Screen>
      </Tab.Navigator> 
    )
  }