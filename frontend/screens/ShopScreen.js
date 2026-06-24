import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProductCard from '../components/ProductCard';
import Screen from '../components/Screen';
import { api } from '../services/api';
import { colors, spacing } from '../utils/theme';

const categories = ['All', 'Men', 'Women', 'Children', 'Unisex'];

function SkeletonCard() {
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

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] });

  return (
    <View style={styles.skeletonCard}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <Animated.View style={[styles.skeletonLine, { opacity, width: '75%' }]} />
      <Animated.View style={[styles.skeletonLine, { opacity, width: '45%' }]} />
    </View>
  );
}

function CategoryChip({ item, active, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scale, { toValue: 0.94, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={[styles.chip, active && styles.activeChip]}
      >
        <Text style={[styles.chipText, active && styles.activeChipText]}>{item}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function ShopScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const gridAnim = useRef(new Animated.Value(0)).current;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.products({ category, search, limit: '50' });
      setProducts(data.products);
    } catch (err) {
      // Preserved data stream boundary exception placeholder
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (!loading && products.length > 0) {
      gridAnim.setValue(0);
      Animated.spring(gridAnim, {
        toValue: 1,
        stiffness: 100,
        damping: 16,
        useNativeDriver: true
      }).start();
    }
  }, [loading, products]);

  const gridStyle = {
    opacity: gridAnim,
    transform: [
      {
        translateY: gridAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0]
        })
      }
    ]
  };

  return (
    <Screen>
      <LinearGradient colors={['#0A0A0D', '#14141A', '#0A0A0D']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.eyebrow}>DISCOVER</Text>
            <Text style={styles.title}>Shop</Text>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={colors.muted || '#8E8E93'} style={styles.searchIcon} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search sneakers"
            placeholderTextColor={colors.muted || '#8E8E93'}
            style={styles.search}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={colors.muted || '#8E8E93'} />
            </Pressable>
          )}
        </View>

        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryListContainer}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item }) => (
            <CategoryChip item={item} active={category === item} onPress={() => setCategory(item)} />
          )}
        />
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={44} color={colors.muted || '#8E8E93'} />
          <Text style={styles.emptyTitle}>No sneakers found</Text>
          <Text style={styles.emptySubtitle}>Try a different search or category</Text>
        </View>
      ) : (
        <Animated.View style={[{ flex: 1 }, gridStyle]}>
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.accent || '#C9A24B'} />
            }
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetails', { id: item._id })}
              />
            )}
          />
        </Animated.View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: spacing.sm,
    gap: 16
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  eyebrow: {
    color: colors.accent || '#C9A24B',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 2
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.6
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#1A1A22',
    paddingHorizontal: 14,
    gap: 10
  },
  searchIcon: {
    marginRight: 1
  },
  search: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '400'
  },
  categoryListContainer: {
    paddingVertical: 4,
    paddingHorizontal: 2
  },
  chip: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 16,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A22'
  },
  activeChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF'
  },
  chipText: {
    color: '#A2A2A8',
    fontWeight: '500',
    fontSize: 13
  },
  activeChipText: {
    color: '#0A0A0D',
    fontWeight: '600'
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: 4,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 14
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between'
  },
  skeletonCard: {
    width: '48%',
    borderRadius: 16,
    backgroundColor: '#1A1A22',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 10,
    marginBottom: 14
  },
  skeletonImage: {
    height: 136,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 10
  },
  skeletonLine: {
    height: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 8
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: 8,
    marginTop: -40
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 4
  },
  emptySubtitle: {
    color: colors.muted || '#8E8E93',
    fontSize: 14,
    fontWeight: '400'
  }
});