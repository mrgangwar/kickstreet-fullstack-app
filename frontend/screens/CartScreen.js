import React, { useRef, useEffect } from 'react';
import { Animated, FlatList, Image, Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import Screen from '../components/Screen';
import { useAuth } from '../store/AuthContext';
import { useCart } from '../store/CartContext';
import { colors, spacing } from '../utils/theme';
import { formatCurrency } from '../utils/format';

function QtyButton({ icon, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.88, stiffness: 400, damping: 15, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, stiffness: 400, damping: 12, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} style={styles.iconButton}>
        <Ionicons name={icon} size={16} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
}

function CartItem({ item, index, updateQuantity, removeItem }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      stiffness: 120,
      damping: 16,
      delay: index * 40,
      useNativeDriver: true
    }).start();
  }, []);

  const itemStyle = {
    opacity: anim.interpolate({
      inputRange: [0, 0.6, 1],
      outputRange: [0, 0.8, 1]
    }),
    transform: [
      {
        translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] })
      }
    ]
  };

  return (
    <Animated.View style={[styles.item, itemStyle]}>
      <Image source={{ uri: item.image }} style={styles.thumb} resizeMode="cover" />
      <View style={styles.info}>
        <View style={styles.infoTop}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.meta}>Size {item.size}</Text>
          </View>
          <Pressable
            onPress={() => removeItem(item.productId, item.size)}
            style={({ pressed }) => [styles.trash, pressed && { opacity: 0.7 }]}
            hitSlop={12}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger || '#FF453A'} />
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatCurrency(item.price * item.quantity)}</Text>
          <View style={styles.controls}>
            <QtyButton icon="remove" onPress={() => updateQuantity(item.productId, item.size, item.quantity - 1)} />
            <Text style={styles.qty}>{item.quantity}</Text>
            <QtyButton icon="add" onPress={() => updateQuantity(item.productId, item.size, item.quantity + 1)} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function CartScreen({ navigation }) {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const checkoutScale = useRef(new Animated.Value(1)).current;

  if (items.length === 0) {
    return (
      <Screen>
        <LinearGradient colors={['#0A0A0D', '#14141A', '#0A0A0D']} style={StyleSheet.absoluteFill} />
        <EmptyState
          title="Your cart is empty"
          message="Pick a pair from the shop and it will show up here."
          actionLabel="Start shopping"
          onAction={() => navigation.navigate('Shop')}
        />
      </Screen>
    );
  }

  const handleCheckoutPressIn = () => {
    Animated.spring(checkoutScale, { toValue: 0.98, stiffness: 300, damping: 20, useNativeDriver: true }).start();
  };

  const handleCheckoutPressOut = () => {
    Animated.spring(checkoutScale, { toValue: 1, stiffness: 300, damping: 15, useNativeDriver: true }).start();
  };

  return (
    <Screen>
      <LinearGradient colors={['#0A0A0D', '#14141A', '#0A0A0D']} style={StyleSheet.absoluteFill} />
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.productId}-${item.size}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>YOUR BAG</Text>
            <Text style={styles.title}>Cart</Text>
            <Text style={styles.subtitle}>{items.length} item{items.length > 1 ? 's' : ''} ready to check out</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <CartItem item={item} index={index} updateQuantity={updateQuantity} removeItem={removeItem} />
        )}
      />

      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Text style={styles.totalLabel}>Total amount</Text>
          <Text style={styles.total}>{formatCurrency(total)}</Text>
        </View>
        <Animated.View style={{ transform: [{ scale: checkoutScale }] }}>
          <Pressable
            onPressIn={handleCheckoutPressIn}
            onPressOut={handleCheckoutPressOut}
            onPress={() => navigation.navigate(user ? 'Checkout' : 'Login', { next: 'Checkout' })}
          >
            <LinearGradient
              colors={[colors.accent || '#E84A27', '#C63519']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkoutGradient}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
              <Ionicons name="arrow-forward" size={16} color="#0A0A0D" style={styles.arrowIcon} />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 180 : 160,
    gap: 12
  },
  headerBlock: {
    marginBottom: spacing.md,
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
  subtitle: {
    color: '#A2A2A8',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '400'
  },
  item: {
    flexDirection: 'row',
    gap: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)'
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  infoTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  name: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: -0.2
  },
  meta: {
    color: '#A2A2A8',
    fontSize: 13,
    marginTop: 2
  },
  price: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: -0.1
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 2,
    gap: 4
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qty: {
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF'
  },
  trash: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 69, 58, 0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#14141A',
    gap: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2
  },
  totalLabel: {
    color: '#A2A2A8',
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: -0.1
  },
  total: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  checkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 52,
    borderRadius: 14
  },
  checkoutText: {
    color: '#0A0A0D',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: -0.1
  },
  arrowIcon: {
    marginTop: Platform.OS === 'ios' ? 0 : 1
  }
});