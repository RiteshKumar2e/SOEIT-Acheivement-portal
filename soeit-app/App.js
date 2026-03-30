import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Suppress known deprecation warnings from react-navigation and react-native-web
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'Image: style.resizeMode is deprecated',
  'Image: style.tintColor is deprecated',
  '"shadow*" style props are deprecated',
  'Cannot record touch end without a touch start',
]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" background={true} />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
