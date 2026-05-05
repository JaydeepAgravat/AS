import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import AppText from '../components/AppText';
import RatingStars from '../components/RatingStars';
import { COLORS } from '../config/colors';
import { rs, rms } from '../utils/scaling';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC<Props> = ({ route }) => {
  const { product } = route.params;
  const [imgError, setImgError] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {imgError ? (
          <View style={styles.imageFallback}>
            <AppText style={styles.fallbackEmoji}>🖼</AppText>
            <AppText style={styles.fallbackText}>Image unavailable</AppText>
          </View>
        ) : (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        )}
      </View>

      {/* Category badge */}
      <View style={styles.badge}>
        <AppText style={styles.badgeText}>
          {product.category.toUpperCase()}
        </AppText>
      </View>

      {/* Title */}
      <AppText style={styles.title}>{product.title}</AppText>

      {/* Price */}
      <AppText style={styles.price}>${product.price.toFixed(2)}</AppText>

      {/* Rating */}
      <RatingStars rate={product.rating.rate} count={product.rating.count} />

      <View style={styles.divider} />

      {/* Description */}
      <AppText style={styles.sectionTitle}>Description</AppText>
      <AppText style={styles.description}>{product.description}</AppText>

      {/* Stock info */}
      <View style={styles.stockRow}>
        <View style={styles.stockDot} />
        <AppText style={styles.stockText}>In Stock · Free shipping</AppText>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.cartButton} activeOpacity={0.85}>
        <AppText style={styles.cartButtonText}>Add to Cart</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.wishlistButton} activeOpacity={0.85}>
        <AppText style={styles.wishlistButtonText}>♡ Add to Wishlist</AppText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.primary },
  content: { padding: rs(20), paddingBottom: rs(48) },
  imageContainer: {
    backgroundColor: COLORS.background.card,
    borderRadius: rs(18),
    padding: rs(24),
    alignItems: 'center',
    marginBottom: rs(20),
    borderWidth: 1,
    borderColor: COLORS.border.light,
    height: rs(280),
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  imageFallback: {
    alignItems: 'center',
    gap: rs(8),
  },
  fallbackEmoji: { fontSize: rms(48) },
  fallbackText: { fontSize: rms(14), color: COLORS.text.placeholder },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary.light,
    paddingHorizontal: rs(10),
    paddingVertical: rs(4),
    borderRadius: rs(8),
    marginBottom: rs(10),
    borderWidth: 1,
    borderColor: COLORS.primary.lighter,
  },
  badgeText: {
    fontSize: rms(10),
    fontWeight: '700',
    color: COLORS.primary.dark,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: rms(20),
    fontWeight: '700',
    color: COLORS.text.primary,
    lineHeight: rms(28),
    letterSpacing: -0.3,
  },
  price: {
    fontSize: rms(30),
    fontWeight: '800',
    color: COLORS.primary.main,
    marginTop: rs(10),
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.primary,
    marginVertical: rs(20),
  },
  sectionTitle: {
    fontSize: rms(16),
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: rs(10),
  },
  description: {
    fontSize: rms(14),
    lineHeight: rms(24),
    color: COLORS.text.secondary,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rs(18),
    gap: rs(8),
  },
  stockDot: {
    width: rs(8),
    height: rs(8),
    borderRadius: rs(4),
    backgroundColor: COLORS.success.main,
  },
  stockText: {
    fontSize: rms(13),
    color: COLORS.success.dark,
    fontWeight: '500',
  },
  cartButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: rs(14),
    paddingVertical: rs(16),
    alignItems: 'center',
    marginTop: rs(24),
  },
  cartButtonText: {
    color: COLORS.white,
    fontSize: rms(16),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  wishlistButton: {
    borderRadius: rs(14),
    paddingVertical: rs(14),
    alignItems: 'center',
    marginTop: rs(10),
    borderWidth: 1.5,
    borderColor: COLORS.border.primary,
    backgroundColor: COLORS.background.card,
  },
  wishlistButtonText: {
    color: COLORS.text.label,
    fontSize: rms(15),
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
