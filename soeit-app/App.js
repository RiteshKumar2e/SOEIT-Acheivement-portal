import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Suppress known deprecation warnings and harmless touch/accessibility reports
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'Image: style.resizeMode is deprecated',
  'Image: style.tintColor is deprecated',
  '"shadow*" style props are deprecated',
  'Cannot record touch end without a touch start',
  'Blocked aria-hidden on an element because its descendant retained focus',
]);

// Silence recurring browser console warnings that clutter the dev environment
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  const isIgnored = (args) => {
    const msg = args.map(a => String(a)).join(' ');
    return (
      msg.includes('props.pointerEvents') || 
      msg.includes('aria-hidden') || 
      msg.includes('retained focus') ||
      msg.includes('touch start') ||
      msg.includes('Touch End') ||
      msg.includes('Touch Bank') ||
      msg.includes('Dashboard stats fetch failed') ||
      msg.includes('status code 401')
    );
  };

  console.warn = (...args) => {
    if (isIgnored(args)) return;
    originalWarn(...args);
  };

  console.error = (...args) => {
    if (isIgnored(args)) return;
    originalError(...args);
  };
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
        });
      } catch (e) {
        console.warn('Font loading failed:', e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

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

