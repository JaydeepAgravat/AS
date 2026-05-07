import { ScrollView, StyleSheet, View } from 'react-native';
import { AppStackScreenProps } from '@appTypes/index';
import { rms, rs } from '@utils/scaling';
import { COLORS } from '@config/colors';
import { FONTS } from '@config/fonts';
import { SCREENS } from '@utils/screens';
import AppImage from '@components/shared/AppImage';
import AppText from '@components/shared/AppText';
import RatingStars from '@components/products/RatingStars';

type Props = AppStackScreenProps<typeof SCREENS.PRODUCT_DETAILS>;

const ProductDetailScreen = ({ route }: Props) => {
  const { product } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageContainer}>
        <AppImage source={{ uri: product.image }} style={styles.image} />
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
});

export default ProductDetailScreen;
