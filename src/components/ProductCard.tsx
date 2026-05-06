import { Product } from '@appTypes/index';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppText from './AppText';
import { COLORS } from '@config/colors';
import { rms, rs } from '@utils/scaling';
import { FONTS } from '@config/fonts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  product: Product;
  onPress: () => void;
}

const ProductCard: React.FC<Props> = ({ product, onPress }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        {imgError ? (
          <View style={styles.imageFallback}>
            <AppText style={styles.fallbackText}>🖼</AppText>
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

      <View style={styles.info}>
        <AppText style={styles.title} numberOfLines={2}>
          {product.title}
        </AppText>
        <View style={styles.footer}>
          <AppText style={styles.price}>${product.price.toFixed(2)}</AppText>
          <View style={styles.ratingChip}>
            <AppText style={styles.star}>★</AppText>
            <AppText style={styles.ratingText}>{product.rating.rate}</AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.background.card,
    borderRadius: rs(14),
    margin: rs(8),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  imageContainer: {
    backgroundColor: COLORS.background.imageContainer,
    padding: rs(14),
    alignItems: 'center',
    height: 140,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.border.light,
    borderRadius: rs(8),
  },
  fallbackText: { fontSize: rms(32) },
  info: {
    padding: rs(10),
  },
  title: {
    fontSize: rms(12),
    color: COLORS.text.primary,
    lineHeight: rms(17),
    minHeight: rs(34),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: rs(8),
  },
  price: {
    fontSize: rms(14),
    color: COLORS.primary.main,
    fontFamily: FONTS.MANROPE_BOLD,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary.light,
    paddingHorizontal: rs(6),
    paddingVertical: rs(2),
    borderRadius: rs(6),
    gap: rs(2),
  },
  star: { fontSize: rms(10), color: COLORS.secondary.main },
  ratingText: {
    fontSize: rms(10),
    color: COLORS.secondary.dark,
    fontFamily: FONTS.MANROPE_MEDIUM,
  },
});

export default ProductCard;
