import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainTabs from '../navigation/MainTabs'
import DetailScreen from '../screens/Detail/DetailScreen'

const Stack = createNativeStackNavigator()
export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Tabs' component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name='Detail' component={DetailScreen} />
    </Stack.Navigator>
  )
}