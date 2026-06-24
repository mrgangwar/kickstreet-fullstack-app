import React, { useRef } from 'react';
import { ActivityIndicator, Animated, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';

export default function AppButton({ title, onPress, variant = 'primary', loading, disabled, style }) {
  const isOutline = variant === 'outline';
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      stiffness: 300,
      damping: 20,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      stiffness: 300,
      damping: 15,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, isDisabled && styles.dimmed, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        style={styles.pressable}
      >
        {isOutline ? (
          <Animated.View style={[styles.button, styles.outline]}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={[styles.text, styles.outlineText]}>{title}</Text>
            )}
          </Animated.View>
        ) : (
          <LinearGradient
            colors={[colors.accent || '#E84A27', colors.accentDark || '#BA3318']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, styles.primary]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.text}>{title}</Text>
            )}
          </LinearGradient>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  button: {
    minHeight: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  primary: {
    ...Platform.select({
      ios: {
        shadowColor: colors.accent || '#E84A27',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  outline: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'transparent',
  },
  dimmed: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  outlineText: {
    color: '#FFFFFF',
  },
});