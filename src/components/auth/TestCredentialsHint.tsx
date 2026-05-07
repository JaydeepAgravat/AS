import { StyleSheet, View } from 'react-native';
import { COLORS } from '@config/colors';
import { FONTS } from '@config/fonts';
import { rms, rs } from '@utils/scaling';
import AppText from '@components/shared/AppText';

interface TestCredentialsHintProps {
  username?: string;
  password?: string;
}

const TestCredentialsHint = ({
  username = 'mor_2314',
  password = '83r5^_',
}: TestCredentialsHintProps) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Test Credentials</AppText>
      <AppText style={styles.row}>
        <AppText style={styles.key}>Username: </AppText>
        <AppText style={styles.value}>{username}</AppText>
      </AppText>
      <AppText style={styles.row}>
        <AppText style={styles.key}>Password: </AppText>
        <AppText style={styles.value}>{password}</AppText>
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: rs(32),
    backgroundColor: COLORS.success.light,
    borderRadius: rs(12),
    padding: rs(16),
    borderWidth: 1,
    borderColor: COLORS.success.lighter,
    gap: rs(4),
  },
  title: {
    fontSize: rms(11),
    color: COLORS.success.dark,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: rs(6),
    fontFamily: FONTS.MANROPE_BOLD,
  },
  row: {
    fontSize: rms(13),
  },
  key: {
    color: COLORS.text.secondary,
  },
  value: {
    color: COLORS.success.dark,
    fontFamily: FONTS.MANROPE_MEDIUM,
  },
});

export default TestCredentialsHint;
