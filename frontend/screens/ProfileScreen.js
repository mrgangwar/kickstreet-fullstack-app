import React, { useState, useRef, useEffect } from 'react';
import { Alert, Animated, ScrollView, StyleSheet, Text, View, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import EmptyState from '../components/EmptyState';
import Screen from '../components/Screen';
import { useAuth } from '../store/AuthContext';
import { colors, spacing } from '../utils/theme';
import { getErrorMessage } from '../utils/format';

function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const successPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (user) {
      Animated.stagger(120, [
        Animated.spring(headerAnim, { toValue: 1, stiffness: 120, damping: 16, useNativeDriver: true }),
        Animated.spring(cardAnim, { toValue: 1, stiffness: 100, damping: 17, useNativeDriver: true })
      ]).start();
    }
  }, [user]);

  if (!user) {
    return (
      <Screen>
        <LinearGradient colors={['#0A0A0D', '#14141A']} style={StyleSheet.absoluteFill} />
        <EmptyState
          title="Your account"
          message="Sign in to manage profile details and delivery information."
          actionLabel="Sign in"
          onAction={() => navigation.navigate('Login')}
          icon="person-circle-outline"
        />
      </Screen>
    );
  }

  const headerStyle = {
    opacity: headerAnim,
    transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }]
  };

  const cardStyle = {
    opacity: cardAnim,
    transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }]
  };

  const save = async () => {
    setLoading(true);
    try {
      await updateProfile({ name, phone });
      setSaved(true);
      Animated.sequence([
        Animated.spring(successPulse, { toValue: 1.04, useNativeDriver: true }),
        Animated.spring(successPulse, { toValue: 1, friction: 5, useNativeDriver: true })
      ]).start();
      Alert.alert('Saved', 'Your profile has been updated.');
      setTimeout(() => setSaved(false), 1500);
    } catch (error) {
      Alert.alert('Could not save', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <LinearGradient colors={['#0A0A0D', '#14141A', '#0A0A0D']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, headerStyle]}>
          <LinearGradient
            colors={[colors.accent || '#E84A27', '#B63316']}
            style={styles.avatarRing}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
            </View>
          </LinearGradient>
          <Text style={styles.name}>{user.name || 'Your account'}</Text>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark-outline" size={11} color={colors.accent || '#E84A27'} />
            <Text style={styles.badgeText}>{(user.role || '').toUpperCase()}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, cardStyle]}>
          <View style={styles.sectionLabel}>
            <Ionicons name="person-outline" size={13} color={colors.accent || '#E84A27'} />
            <Text style={styles.sectionLabelText}>Personal details</Text>
          </View>

          <View style={styles.formGap}>
            <AppInput label="Name" value={name} onChangeText={setName} />
            <AppInput
              label="Email"
              value={user.email}
              onChangeText={() => {}}
              keyboardType="email-address"
              editable={false}
              icon="lock-closed-outline"
            />
            <AppInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>

          <Animated.View style={[styles.buttonWrap, { transform: [{ scale: successPulse }] }]}>
            <AppButton title={saved ? 'Saved ✓' : 'Save profile'} onPress={save} loading={loading} />
          </Animated.View>
        </Animated.View>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerLabel}>Account</Text>
          <AppButton title="Sign out" onPress={logout} variant="outline" />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: 20,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60
  },
  header: {
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 4
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#14141A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: colors.ink || '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.5
  },
  name: {
    color: colors.ink || '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(232,74,39,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(232,74,39,0.18)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 2
  },
  badgeText: {
    color: colors.accent || '#E84A27',
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 0.8
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: spacing.lg,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
    paddingHorizontal: 2
  },
  sectionLabelText: {
    color: colors.accent || '#E84A27',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  formGap: {
    gap: 12
  },
  buttonWrap: {
    marginTop: 4
  },
  dangerZone: {
    gap: 10,
    marginTop: 8,
    paddingHorizontal: 2
  },
  dangerLabel: {
    color: '#A2A2A8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2
  }
});