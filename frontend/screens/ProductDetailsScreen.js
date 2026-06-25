import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import { api } from '../services/api';
import { useCart } from '../store/CartContext';
import { colors, spacing } from '../utils/theme';
import { formatCurrency } from '../utils/format';

function SizeChip({ size, selected, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.92, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={[styles.size, selected && styles.selectedSize]}
      >
        <Text style={[styles.sizeText, selected && styles.selectedSizeText]}>{size}</Text>
      </Pressable>
    </Animated.View>
  );
}

function SkeletonDetails() {
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

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.22, 0.5] });

  return (
    <View style={styles.content}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <Animated.View style={[styles.skeletonLine, { opacity, width: '25%', height: 12 }]} />
      <Animated.View style={[styles.skeletonLine, { opacity, width: '75%', height: 26, marginTop: 4 }]} />
      <Animated.View style={[styles.skeletonLine, { opacity, width: '40%', height: 20, marginTop: 2 }]} />
      <Animated.View style={[styles.skeletonLine, { opacity, width: '100%', height: 60, marginTop: 8 }]} />
    </View>
  );
}

export default function ProductDetailsScreen({ route, navigation }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const contentAnim = useRef(new Animated.Value(0)).current;
  const addedBounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.product(route.params.id);
        setProduct(data.product);
        setSelectedSize(data.product.sizes?.[0] || '');
      } catch (err) {
        // Preserved error flow boundary
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [route.params.id]);

  useEffect(() => {
    if (!loading && product) {
      contentAnim.setValue(0);
      Animated.spring(contentAnim, {
        toValue: 1,
        stiffness: 120,
        damping: 18,
        useNativeDriver: true
      }).start();
    }
  }, [loading, product]);

  const contentStyle = {
    opacity: contentAnim,
    transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }]
  };

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    setAdded(true);
    Animated.sequence([
      Animated.spring(addedBounce, { toValue: 1.05, useNativeDriver: true }),
      Animated.spring(addedBounce, { toValue: 1, friction: 5, useNativeDriver: true })
    ]).start();
    Alert.alert('Added', `${product.name} is in your cart.`);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading || !product) {
    return (
      <Screen>
        <LinearGradient colors={['#0A0A0D', '#14141A']} style={StyleSheet.absoluteFill} />
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </Pressable>
        <SkeletonDetails />
      </Screen>
    );
  }

  return (
    <Screen>
      <LinearGradient colors={['#0A0A0D', '#14141A', '#0A0A0D']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.images?.[0] }} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(10,10,13,0.4)', 'transparent', 'rgba(10,10,13,0.95)']}
            style={styles.imageFade}
          />
          <Pressable style={styles.backFloating} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.sizeSection}>
            <Text style={styles.label}>Select Size</Text>
            <View style={styles.sizes}>
              {product.sizes.map((size) => (
                <SizeChip
                  key={size}
                  size={size}
                  selected={selectedSize === size}
                  onPress={() => setSelectedSize(size)}
                />
              ))}
            </View>
          </View>

          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <LinearGradient
          colors={['rgba(20,20,26,0.94)', 'rgba(10,10,13,0.98)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.priceContainer}>
          <Text style={styles.bottomLabel}>TOTAL PRICE</Text>
          <Text style={styles.bottomPrice}>{formatCurrency(product.price)}</Text>
        </View>
        <Animated.View style={{ flex: 1, transform: [{ scale: addedBounce }] }}>
          <AppButton
            title={product.stock > 0 ? (added ? 'Added ✓' : 'Add to Cart') : 'Sold Out'}
            disabled={product.stock <= 0}
            onPress={handleAddToCart}
          />
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 0
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 0.92,
    backgroundColor: '#14141A'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imageFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginLeft: spacing.lg,
    marginTop: spacing.sm
  },
  backFloating: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 16,
    left: spacing.lg,
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,10,13,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    gap: 12
  },
  category: {
    color: colors.accent || '#C9A24B',
    fontWeight: '600',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.6
  },
  price: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 4
  },
  description: {
    color: '#A2A2A8',
    lineHeight: 22,
    fontSize: 14,
    fontWeight: '400'
  },
  sizeSection: {
    marginTop: 12,
    gap: 12
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: -0.1
  },
  sizes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  size: {
    minWidth: 54,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: '#1A1A22',
    paddingHorizontal: 12
  },
  selectedSize: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF'
  },
  sizeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14
  },
  selectedSizeText: {
    color: '#0A0A0D',
    fontWeight: '700'
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  priceContainer: {
    marginRight: spacing.lg,
    justifyContent: 'center'
  },
  bottomLabel: {
    color: '#A2A2A8',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 2
  },
  bottomPrice: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4
  },
  skeletonImage: {
    width: '100%',
    aspectRatio: 0.92,
    borderRadius: 20,
    backgroundColor: '#1A1A22',
    marginBottom: 16
  },
  skeletonLine: {
    borderRadius: 4,
    backgroundColor: '#1A1A22',
    marginVertical: 4
  }
});