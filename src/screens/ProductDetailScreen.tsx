import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@appTypes/index';
import AppText from '@components/AppText';
import RatingStars from '@components/RatingStars';
import { rms, rs } from '@utils/scaling';
import { COLORS } from '@config/colors';
import { FONTS } from '@config/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = ({ route }: Props) => {
  const { product } = route.params;
  const [imgError, setImgError] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
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

      <View style={styles.badge}>
        <AppText style={styles.badgeText}>
          {product.category.toUpperCase()}
        </AppText>
      </View>

      <AppText style={styles.title}>{product.title}</AppText>
      <AppText style={styles.price}>${product.price.toFixed(2)}</AppText>

      <RatingStars rate={product.rating.rate} count={product.rating.count} />

      <View style={styles.divider} />

      <AppText style={styles.sectionTitle}>Description</AppText>

      <AppText style={styles.description}>{product.description}</AppText>

      <View style={styles.stockRow}>
        <View style={styles.stockDot} />
        <AppText style={styles.stockText}>In Stock · Free shipping</AppText>
      </View>

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
    color: COLORS.primary.dark,
    letterSpacing: 0.8,
    fontFamily: FONTS.MANROPE_BOLD,
  },
  title: {
    fontSize: rms(20),
    color: COLORS.text.primary,
    lineHeight: rms(28),
    letterSpacing: -0.3,
    fontFamily: FONTS.MANROPE_BOLD,
  },
  price: {
    fontSize: rms(30),
    color: COLORS.primary.main,
    marginTop: rs(10),
    letterSpacing: -0.5,
    fontFamily: FONTS.MANROPE_BOLD,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.primary,
    marginVertical: rs(20),
  },
  sectionTitle: {
    fontSize: rms(16),
    color: COLORS.text.primary,
    marginBottom: rs(10),
    fontFamily: FONTS.MANROPE_BOLD,
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
    letterSpacing: 0.3,
    fontFamily: FONTS.MANROPE_BOLD,
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
    fontFamily: FONTS.MANROPE_MEDIUM,
  },
});

export default ProductDetailScreen;
