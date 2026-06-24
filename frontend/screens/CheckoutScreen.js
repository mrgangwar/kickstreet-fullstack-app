import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import Screen from '../components/Screen';
import { api } from '../services/api';
import { useCart } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';
import { colors, spacing } from '../utils/theme';
import { formatCurrency, getErrorMessage } from '../utils/format';

export default function CheckoutScreen({ navigation }) {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const saved = user?.shippingAddress || {};
  const [address, setAddress] = useState({
    line1: saved.line1 || '',
    city: saved.city || '',
    state: saved.state || '',
    postalCode: saved.postalCode || '',
    country: saved.country || 'IN',
    phone: saved.phone || user?.phone || ''
  });
  const [loading, setLoading] = useState(false);

  const setField = (field, value) => setAddress((current) => ({ ...current, [field]: value }));

  const summaryAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(summaryAnim, { toValue: 1, stiffness: 130, damping: 17, useNativeDriver: true }),
      Animated.spring(cardAnim, { toValue: 1, stiffness: 110, damping: 16, useNativeDriver: true })
    ]).start();
  }, []);

  const summaryStyle = {
    opacity: summaryAnim,
    transform: [
      {
        translateY: summaryAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] })
      }
    ]
  };

  const cardStyle = {
    opacity: cardAnim,
    transform: [
      {
        translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] })
      }
    ]
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      await api.createOrder({ items, shippingAddress: address });
      clearCart();
      Alert.alert('Order placed', 'Your cash-on-delivery order is confirmed.');
      navigation.navigate('Main', { screen: 'Orders' });
    } catch (error) {
      Alert.alert('Checkout failed', getErrorMessage(error));
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 400));
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
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>FINAL STEP</Text>
            <Text style={styles.title}>Checkout</Text>
          </View>

          <Animated.View style={[styles.summaryCard, summaryStyle]}>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>
                  Total Bill ({items.length} item{items.length === 1 ? '' : 's'})
                </Text>
                <Text style={styles.summaryTotal}>{formatCurrency(total)}</Text>
              </View>
              <View style={styles.codBadge}>
                <Ionicons name="cash-outline" size={13} color={colors.accent || '#E84A27'} />
                <Text style={styles.codBadgeText}>COD Available</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.card, cardStyle]}>
            <View style={styles.sectionLabel}>
              <Ionicons name="location-outline" size={15} color={colors.accent || '#E84A27'} />
              <Text style={styles.sectionLabelText}>Shipping address</Text>
            </View>

            <View style={styles.inputGap}>
              <AppInput label="Street Address" value={address.line1} onChangeText={(value) => setField('line1', value)} />
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <AppInput label="City" value={address.city} onChangeText={(value) => setField('city', value)} />
              </View>
              <View style={styles.half}>
                <AppInput
                  label="Postal code"
                  value={address.postalCode}
                  onChangeText={(value) => setField('postalCode', value)}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.inputGap}>
              <AppInput label="State" value={address.state} onChangeText={(value) => setField('state', value)} />
            </View>
            
            <View style={styles.inputGap}>
              <AppInput
                label="Phone"
                value={address.phone}
                onChangeText={(value) => setField('phone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.buttonWrap}>
              <AppButton
                title={`Place COD order • ${formatCurrency(total)}`}
                onPress={placeOrder}
                loading={loading}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: 16,
    paddingBottom: 48
  },
  headerBlock: {
    marginBottom: 4,
    paddingHorizontal: 2
  },
  eyebrow: {
    color: colors.accent || '#E84A27',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 4
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.6
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryLabel: {
    color: '#A2A2A8',
    fontSize: 13,
    fontWeight: '400'
  },
  summaryTotal: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 4
  },
  codBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(232, 74, 39, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(232, 74, 39, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  codBadgeText: {
    color: colors.accent || '#E84A27',
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 0.2
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: spacing.lg,
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 18,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 2
  },
  sectionLabelText: {
    color: colors.accent || '#E84A27',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  half: {
    flex: 1
  },
  inputGap: {
    marginBottom: 12
  },
  buttonWrap: {
    marginTop: 10
  }
});