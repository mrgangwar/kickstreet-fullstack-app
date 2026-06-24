import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, FlatList, RefreshControl, StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import Screen from '../components/Screen';
import { api } from '../services/api';
import { useAuth } from '../store/AuthContext';
import { colors, spacing } from '../utils/theme';
import { formatCurrency } from '../utils/format';

const STATUS_CONFIG = {
  pending: { color: '#E5C06A', bg: 'rgba(229,192,106,0.06)', border: 'rgba(229,192,106,0.15)', icon: 'time-outline' },
  processing: { color: '#E5C06A', bg: 'rgba(229,192,106,0.06)', border: 'rgba(229,192,106,0.15)', icon: 'sync-outline' },
  shipped: { color: '#5AA9E6', bg: 'rgba(90,169,230,0.06)', border: 'rgba(90,169,230,0.15)', icon: 'rocket-outline' },
  delivered: { color: '#55C28C', bg: 'rgba(85,194,140,0.06)', border: 'rgba(85,194,140,0.15)', icon: 'checkmark-circle-outline' },
  cancelled: { color: '#FF5E5E', bg: 'rgba(255,94,94,0.06)', border: 'rgba(255,94,94,0.15)', icon: 'close-circle-outline' }
};

function getStatusConfig(status) {
  return STATUS_CONFIG[(status || '').toLowerCase()] || STATUS_CONFIG.pending;
}

function SkeletonOrder() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 800, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Animated.View style={[styles.skeletonLine, { opacity, width: '35%', height: 16 }]} />
        <Animated.View style={[styles.skeletonLine, { opacity, width: '25%', height: 20, borderRadius: 999 }]} />
      </View>
      <Animated.View style={[styles.skeletonLine, { opacity, width: '55%', height: 12, marginTop: 4 }]} />
      <View style={[styles.row, { marginTop: 12 }]}>
        <Animated.View style={[styles.skeletonLine, { opacity, width: '30%', height: 22 }]} />
        <Animated.View style={[styles.skeletonLine, { opacity, width: '40%', height: 14 }]} />
      </View>
    </View>
  );
}

function OrderCard({ item, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const status = getStatusConfig(item.orderStatus);

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      stiffness: 120,
      damping: 17,
      delay: index * 40,
      useNativeDriver: true
    }).start();
  }, []);

  const itemStyle = {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }]
  };

  return (
    <Animated.View style={[styles.card, itemStyle]}>
      <View style={styles.row}>
        <View style={styles.idRow}>
          <View style={styles.idIcon}>
            <Ionicons name="bag-handle-outline" size={14} color={colors.accent || '#E84A27'} />
          </View>
          <Text style={styles.id}>#{item._id.slice(-6).toUpperCase()}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: status.bg, borderColor: status.border }]}>
          <Ionicons name={status.icon} size={12} color={status.color} />
          <Text style={[styles.status, { color: status.color }]}>{item.orderStatus}</Text>
        </View>
      </View>

      <Text style={styles.meta}>
        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {item.items.length} item{item.items.length === 1 ? '' : 's'}
      </Text>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <Text style={styles.total}>{formatCurrency(item.amountTotal)}</Text>
        <View style={styles.codTag}>
          <Ionicons name="cash-outline" size={13} color={'#A2A2A8'} />
          <Text style={styles.codText}>Cash on delivery</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function OrdersScreen({ navigation }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.myOrders();
      setOrders(data.orders);
    } catch (error) {
      // Logic preserved
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) {
    return (
      <Screen>
        <LinearGradient colors={['#0A0A0D', '#14141A', '#0A0A0D']} style={StyleSheet.absoluteFill} />
        <EmptyState
          title="Sign in to view orders"
          message="Your order history appears once you are signed in."
          actionLabel="Sign in"
          onAction={() => navigation.navigate('Login')}
          icon="lock-closed-outline"
        />
      </Screen>
    );
  }

  if (loading && orders.length === 0) {
    return (
      <Screen>
        <LinearGradient colors={['#0A0A0D', '#14141A', '#0A0A0D']} style={StyleSheet.absoluteFill} />
        <View style={styles.list}>
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>ORDER HISTORY</Text>
            <Text style={styles.title}>Orders</Text>
          </View>
          {[1, 2, 3].map((i) => (
            <SkeletonOrder key={i} />
          ))}
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <LinearGradient colors={['#0A0A0D', '#14141A', '#0A0A0D']} style={StyleSheet.absoluteFill} />
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.accent || '#E84A27'} />}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>ORDER HISTORY</Text>
            <Text style={styles.title}>Orders</Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No orders yet"
            message="Your first Kick Street order will show up here."
            icon="receipt-outline"
          />
        }
        renderItem={({ item, index }) => <OrderCard item={item} index={index} />}
        ListFooterComponent={
          orders.length > 0 ? (
            <View style={styles.footerButton}>
              <AppButton title="Shop more" onPress={() => navigation.navigate('Shop')} variant="outline" />
            </View>
          ) : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    gap: 12
  },
  headerBlock: {
    marginBottom: 6,
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  idIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(232, 74, 39, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(232, 74, 39, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  id: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: -0.1
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  status: {
    fontWeight: '600',
    fontSize: 11,
    textTransform: 'capitalize',
    letterSpacing: 0.1
  },
  meta: {
    color: '#A2A2A8',
    fontSize: 13,
    marginTop: 8,
    paddingHorizontal: 2
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 12
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2
  },
  total: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  codTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  codText: {
    color: '#A2A2A8',
    fontSize: 12,
    fontWeight: '500'
  },
  skeletonLine: {
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    marginVertical: 3
  },
  footerButton: {
    marginTop: 6,
    marginBottom: Platform.OS === 'ios' ? 24 : 12
  }
});