import React from 'react';
import { SafeAreaView, StyleSheet, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../utils/theme';

export default function Screen({ children, style }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" translucent />
      <View style={[styles.wrap, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0A0D',
  },
  wrap: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      ios: {
        paddingHorizontal: 0,
      },
      android: {
        // Keeps layouts consistently protected from asymmetric status bar offsets on Android
        paddingTop: 4,
      },
    }),
  }
});