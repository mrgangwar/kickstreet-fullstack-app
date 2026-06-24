import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import Screen from '../components/Screen';
import { useAuth } from '../store/AuthContext';
import { colors, spacing } from '../utils/theme';
import { getErrorMessage } from '../utils/format';

export default function LoginScreen({ navigation, route }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.spring(headerAnim, {
        toValue: 1,
        stiffness: 120,
        damping: 16,
        useNativeDriver: true
      }),
      Animated.spring(cardAnim, {
        toValue: 1,
        stiffness: 100,
        damping: 15,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const headerStyle = {
    opacity: headerAnim.interpolate({
      inputRange: [0, 0.6, 1],
      outputRange: [0, 0.7, 1]
    }),
    transform: [
      {
        translateY: headerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-16, 0]
        })
      }
    ]
  };

  const cardStyle = {
    opacity: cardAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.8, 1]
    }),
    transform: [
      {
        translateY: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0]
        })
      }
    ]
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      stiffness: 300,
      damping: 20,
      useNativeDriver: true
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      stiffness: 300,
      damping: 15,
      useNativeDriver: true
    }).start();
  };

  const submit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await login({ email, password });
      navigation.replace(route.params?.next || 'Main');
    } catch (error) {
      Alert.alert('Sign in failed', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <LinearGradient
        colors={['#0A0A0D', '#14141A', '#0A0A0D']}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.headerBlock, headerStyle]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>SECURE ACCESS</Text>
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to place orders and track your drops.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.card, cardStyle]}>
            <View style={styles.formGroup}>
              <AppInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <AppInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Animated.View style={[styles.buttonWrap, { transform: [{ scale: buttonScale }] }]}>
              <Pressable 
                onPressIn={onPressIn} 
                onPressOut={onPressOut} 
                onPress={submit}
                disabled={loading}
              >
                <View pointerEvents="none">
                  <AppButton title="Sign in" onPress={submit} loading={loading} />
                </View>
              </Pressable>
            </Animated.View>

            <Pressable
              onPress={() => navigation.navigate('Register', { next: route.params?.next })}
              style={({ pressed }) => [styles.linkWrap, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.link}>
                Don't have an account?{' '}
                <Text style={styles.linkAccent}>Create one</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
  },
  headerBlock: {
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(232, 74, 39, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(232, 74, 39, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.md,
  },
  badgeText: {
    color: colors.accent || '#E84A27',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    color: '#A2A2A8',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  formGroup: {
    gap: 4,
    marginBottom: spacing.md,
  },
  buttonWrap: {
    marginTop: spacing.xs,
  },
  linkWrap: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  link: {
    color: '#A2A2A8',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  linkAccent: {
    color: colors.accent || '#E84A27',
    fontWeight: '600',
  }
});