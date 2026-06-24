import React, { useRef, useState } from 'react';
import { Animated, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shadow } from '../utils/theme';
import { formatCurrency } from '../utils/format';

export default function ProductCard({ product, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const [imageLoaded, setImageLoaded] = useState(false);

  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      stiffness: 300,
      damping: 20,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      stiffness: 300,
      damping: 15,
      useNativeDriver: true,
    }).start();
  };

  const onImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.cardWrap, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isSoldOut}
        style={styles.card}
      >
        <View style={styles.imageWrap}>
          <Animated.Image
            source={{ uri: product.images?.[0] }}
            style={[styles.image, { opacity: imageOpacity }, isSoldOut && styles.imageDim]}
            onLoad={onImageLoad}
            resizeMode="cover"
          />
          {!imageLoaded && <View style={styles.imagePlaceholder} />}

          {isSoldOut && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>SOLD OUT</Text>
            </View>
          )}

          {!isSoldOut && isLowStock && (
            <View style={styles.lowStockBadge}>
              <Text style={styles.lowStockBadgeText}>Only {product.stock} left</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.categoryPill}>
            <Text style={styles.category}>{product.category}</Text>
          </View>
          
          <Text numberOfLines={2} style={styles.name}>
            {product.name}
          </Text>
          
          <View style={styles.row}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            {!isLowStock && !isSoldOut && (
              <Text style={styles.stock}>{product.stock} available</Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    flex: 1,
    minWidth: 160,
    margin: 6,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  imageDim: {
    opacity: 0.25,
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  soldOutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 0.8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(15, 15, 18, 0.9)',
    overflow: 'hidden',
    textAlign: 'center',
  },
  lowStockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.danger || '#EF4444',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  lowStockBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  body: {
    padding: 12,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(232, 74, 39, 0.1)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  category: {
    color: colors.accent || '#E84A27',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
    minHeight: 38,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    paddingTop: 2,
  },
  price: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.2,
  },
  stock: {
    color: colors.green || '#10B981',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});