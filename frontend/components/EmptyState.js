import React, { useRef, useEffect } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from './AppButton';
import { colors } from '../utils/theme';

export default function EmptyState({ title, message, actionLabel, onAction, icon = 'cube-outline' }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      stiffness: 140,
      damping: 18,
      mass: 1.2,
      useNativeDriver: true
    }).start();
  }, []);

  const animStyle = {
    opacity: anim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0, 0.6, 1]
    }),
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1]
        })
      },
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0]
        })
      }
    ]
  };

  return (
    <Animated.View style={[styles.wrap, animStyle]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={38} color={colors.accent || '#E84A27'} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel ? (
        <View style={styles.actionWrap}>
          <AppButton title={actionLabel} onPress={onAction} style={styles.action} />
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(232, 74, 39, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(232, 74, 39, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.accent || '#E84A27',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  message: {
    color: '#A2A2A8',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 290,
    fontWeight: '400',
    marginBottom: 28,
  },
  actionWrap: {
    width: '100%',
    maxWidth: 260,
  },
  action: {
    alignSelf: 'stretch',
  }
});