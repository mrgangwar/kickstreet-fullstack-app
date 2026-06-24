import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../components/AppButton';
import ProductCard from '../components/ProductCard';
import Screen from '../components/Screen';
import { api } from '../services/api';
import { colors, spacing } from '../utils/theme';

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

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <View style={[styles.productWrap, styles.skeletonCard]}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <Animated.View style={[styles.skeletonLine, { opacity, width: '75%' }]} />
      <Animated.View style={[styles.skeletonLine, { opacity, width: '45%' }]} />
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);

  const heroAnim = useRef(new Animated.Value(0)).current;
  const sectionAnim = useRef(new Animated.Value(0)).current;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.products({ featured: 'true', limit: '8' });
      setFeatured(data.products);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(heroAnim, { toValue: 1, stiffness: 120, damping: 16, useNativeDriver: true }),
      Animated.spring(sectionAnim, { toValue: 1, stiffness: 100, damping: 15, useNativeDriver: true })
    ]).start();
  }, []);

  const heroStyle = {
    opacity: heroAnim,
    transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }]
  };

  const sectionStyle = {
    opacity: sectionAnim,
    transform: [{ translateY: sectionAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }]
  };

  return (
    <Screen>
      <LinearGradient colors={['#0A0A0D', '#14141A', '#0A0A0D']} style={StyleSheet.absoluteFill} />
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.accent || '#E84A27'} />}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={heroStyle}>
          <LinearGradient
            colors={['#16161C', '#0E0E12']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroGlow} />
            <Text style={styles.kicker}>KICK STREET APP</Text>
            <Text style={styles.title}>Fresh pairs for real streets.</Text>
            <Text style={styles.subtitle}>
              Browse curated sneakers, choose your size, and place secure cash-on-delivery orders from your phone.
            </Text>
            <View style={styles.ctaWrap}>
              <AppButton title="Shop drops" onPress={() => navigation.navigate('Shop')} style={styles.cta} />
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.section, sectionStyle]}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Featured sneakers</Text>
            <Pressable
              onPress={() => navigation.navigate('Shop')}
              style={({ pressed }) => [styles.linkPill, pressed && { opacity: 0.6 }]}
            >
              <Text style={styles.link}>View all</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.accent || '#E84A27'} style={styles.linkIcon} />
            </Pressable>
          </View>

          {loading && featured.length === 0 ? (
            <FlatList
              data={[1, 2, 3]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => String(item)}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={() => <SkeletonCard />}
            />
          ) : (
            <FlatList
              data={featured}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={({ item }) => (
                <View style={styles.productWrap}>
                  <ProductCard
                    product={item}
                    onPress={() => navigation.navigate('ProductDetails', { id: item._id })}
                  />
                </View>
              )}
            />
          )}
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: 28,
    paddingBottom: 48
  },
  hero: {
    borderRadius: 20,
    padding: 24,
    gap: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    position: 'relative'
  },
  heroGlow: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(232, 74, 39, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: colors.accent || '#E84A27',
        shadowRadius: 40,
        shadowOpacity: 0.2,
      }
    })
  },
  kicker: {
    color: colors.accent || '#E84A27',
    fontWeight: '600',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.6
  },
  subtitle: {
    color: '#A2A2A8',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    marginBottom: 6
  },
  ctaWrap: {
    marginTop: 4,
    alignSelf: 'flex-start',
    minWidth: 140
  },
  cta: {
    paddingHorizontal: 24
  },
  section: {
    gap: 16
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  linkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 2
  },
  link: {
    color: colors.accent || '#E84A27',
    fontWeight: '500',
    fontSize: 13,
    letterSpacing: -0.1
  },
  linkIcon: {
    marginLeft: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 1
  },
  listContent: {
    paddingLeft: 2,
    paddingRight: 20
  },
  productWrap: {
    width: 175
  },
  skeletonCard: {
    width: 175,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12
  },
  skeletonImage: {
    height: 140,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12
  },
  skeletonLine: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 8
  }
});