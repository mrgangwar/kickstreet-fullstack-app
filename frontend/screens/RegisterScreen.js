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

export default function RegisterScreen({ navigation, route }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

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
      await register(form);
      navigation.replace(route.params?.next || 'Main');
    } catch (error) {
      Alert.alert('Registration failed', getErrorMessage(error));
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
              <Text style={styles.badgeText}>JOIN KICK STREET</Text>
            </View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Your Kick Street profile keeps orders and delivery details together.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.card, cardStyle]}>
            <View style={styles.formGroup}>
              <AppInput
                label="Name"
                value={form.name}
                onChangeText={(value) => setField('name', value)}
              />
              <AppInput
                label="Email"
                value={form.email}
                onChangeText={(value) => setField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <AppInput
                label="Phone"
                value={form.phone}
                onChangeText={(value) => setField('phone', value)}
                keyboardType="phone-pad"
              />
              <AppInput
                label="Password"
                value={form.password}
                onChangeText={(value) => setField('password', value)}
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
                  <AppButton title="Create account" onPress={submit} loading={loading} />
                </View>
              </Pressable>
            </Animated.View>

            <Pressable
              onPress={() => navigation.navigate('Login', { next: route.params?.next })}
              style={({ pressed }) => [styles.linkWrap, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.link}>
                Already have an account?{' '}
                <Text style={styles.linkAccent}>Sign in</Text>
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
    paddingBottom: spacing.xl,
  },
  headerBlock: {
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(232, 74, 39, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(232, 74, 39, 0.18)',
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
    backgroundColor: '#1A1A22',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    gap: 2,
    marginBottom: spacing.sm,
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