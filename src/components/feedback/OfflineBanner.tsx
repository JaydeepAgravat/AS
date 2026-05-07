import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS } from '@config/fonts';
import { useNetwork } from '@context/NetworkContext';
import AppText from '@components/shared/AppText';
import { COLORS } from '@config/colors';
import { rms, rs } from '@utils/scaling';

const BANNER_HEIGHT = 44;

const OfflineBanner = () => {
  const { bottom } = useSafeAreaInsets();
  const { isConnected } = useNetwork();

  if (isConnected) {
    return;
  }

  return (
    <View style={[styles.banner, { bottom }]}>
      <AppText style={styles.dot}>●</AppText>
      <AppText style={styles.text}>No Internet Connection</AppText>
    </View>
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
    fontFamily: FONTS.MANROPE_MEDIUM,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
});

export default OfflineBanner;
