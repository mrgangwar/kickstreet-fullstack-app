import React, { useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';

export default function AppInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  multiline,
  placeholder,
  editable = true,
  icon
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, // Color and structural borders must use JS thread interpolation
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.1)', colors.accent || '#E84A27']
  });

  return (
    <View style={styles.wrap}>
      {label && (
        <Text style={[styles.label, focused && styles.labelActive]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputWrap,
          multiline && styles.multilineWrap,
          { borderColor },
          focused && styles.focusedGlow,
          !editable && styles.disabledWrap
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? (colors.accent || '#E84A27') : (colors.muted || '#6B7280')}
            style={styles.leadingIcon}
          />
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          multiline={multiline}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input, 
            multiline && styles.multiline,
            !editable && styles.disabledInput
          ]}
          textAlignVertical={multiline ? 'top' : 'center'}
        />

        {secureTextEntry && (
          <Pressable 
            onPress={() => setHidden((current) => !current)} 
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.toggleButton}
          >
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={focused ? (colors.accent || '#E84A27') : (colors.muted || '#6B7280')}
            />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    color: '#A2A2A8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
    marginBottom: 6,
    paddingLeft: 2,
  },
  labelActive: {
    color: colors.accent || '#E84A27',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  multilineWrap: {
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  focusedGlow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.accent || '#E84A27',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  leadingIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 16,
    padding: 0,
    fontWeight: '400',
  },
  multiline: {
    minHeight: 80,
    paddingTop: 0,
  },
  toggleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledWrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  disabledInput: {
    color: 'rgba(255, 255, 255, 0.3)',
  }
});