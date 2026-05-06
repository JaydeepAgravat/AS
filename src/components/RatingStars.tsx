import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { rms, rs } from '@utils/scaling';
import { COLORS } from '@config/colors';

interface Props {
  rate: number;
  count: number;
}

const RatingStars = ({ rate, count }: Props) => {
  const fullStars = Math.floor(rate);
  const hasHalf = rate - fullStars >= 0.5;

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < fullStars;
          const half = !filled && hasHalf && i === fullStars;
          return (
            <AppText
              key={i}
              style={[
                styles.star,
                filled && styles.filled,
                half && styles.half,
              ]}
            >
              ★
            </AppText>
          );
        })}
      </View>
      <AppText style={styles.label}>
        {rate.toFixed(1)} · {count} reviews
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(10),
    marginTop: rs(10),
  },
  starsRow: {
    flexDirection: 'row',
    gap: rs(2),
  },
  star: {
    fontSize: rms(22),
    color: COLORS.rating.empty,
  },
  filled: {
    color: COLORS.rating.filled,
  },
  half: {
    color: COLORS.rating.half,
  },
  label: {
    fontSize: rms(14),
    color: COLORS.text.tertiary,
  },
});

export default RatingStars;
