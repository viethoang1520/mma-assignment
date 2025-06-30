import { Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/Home/HomeScreen';
import FavoriteScreen from '../screens/Favorite/FavoriteScreen';
import ChatAI from '../screens/ChatAI/ChatAI';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import StadiumListScreen from '../screens/Map/StadiumListScreen';
import MapScreen from '../screens/Map/MapScreen';

const Tab = createBottomTabNavigator();
const StadiumStack = createStackNavigator();

function StadiumStackScreen() {
  return (
    <StadiumStack.Navigator>
      <StadiumStack.Screen name="StadiumList" component={StadiumListScreen} options={{ title: 'Stadiums' }} />
      <StadiumStack.Screen name="Map" component={MapScreen} options={{ title: 'Stadium Map' }} />
    </StadiumStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
      }}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Favorite'
        component={FavoriteScreen}
        options={{
          headerShown: true,
          headerTitle: 'Favorites',
          headerTitleStyle: {
            fontSize: 16,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='ChatAI'
        component={ChatAI}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Stadium'
        component={StadiumStackScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}