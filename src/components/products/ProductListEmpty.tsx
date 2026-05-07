import { StyleSheet, View } from 'react-native';
import AppText from '@components/shared/AppText';
import { COLORS } from '@config/colors';
import { FONTS } from '@config/fonts';
import { rms, rs } from '@utils/scaling';

const ProductListEmpty = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.icon}>🔍</AppText>
      <AppText style={styles.title}>No products found</AppText>
      <AppText style={styles.subtitle}>Try a different search term</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: rs(80),
    gap: rs(8),
  },
  icon: { fontSize: rms(48) },
  title: {
    fontSize: rms(17),
    fontFamily: FONTS.MANROPE_MEDIUM,
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: rms(14),
    color: COLORS.text.tertiary,
  },
});

export default ProductListEmpty;
