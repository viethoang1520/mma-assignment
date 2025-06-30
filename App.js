import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Toast, { BaseToast } from 'react-native-toast-message';

import RootNavigator from './src/navigation/RootNavigator';

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftWidth: 0,
        backgroundColor: '#111',
        borderRadius: 5,
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingBottom: 20
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
      text1Style={{
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        width: '100%',
      }}
      text2Style={{
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        width: '100%',
      }}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
    />
  ),
};

export default function App() {
  return (
    <>
      {/* <HomeScreen /> */}
      <NavigationContainer>
        <RootNavigator />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
