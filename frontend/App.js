import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { colors } from './utils/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <StatusBar style="light" translucent backgroundColor="transparent" />
            <AppNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#0A0A0D',
  },
});