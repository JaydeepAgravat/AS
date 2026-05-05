import { Animated, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useNetwork } from '../context/NetworkContext';
import { COLORS } from '../config/colors';
import { rs, rms } from '../utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BANNER_HEIGHT = 44;

const OfflineBanner: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { isConnected } = useNetwork();

  if (isConnected) {
    return;
  }

  return (
    <Animated.View style={[styles.banner, { top }]}>
      <AppText style={styles.dot}>●</AppText>
      <AppText style={styles.text}>No Internet Connection</AppText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BANNER_HEIGHT,
    backgroundColor: COLORS.error.offline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs(8),
    zIndex: 9999,
  },
  dot: {
    fontSize: rms(10),
    color: COLORS.error.dot,
  },
  text: {
    fontSize: rms(13),
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
});

export default OfflineBanner;
