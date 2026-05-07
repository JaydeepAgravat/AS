import { StyleSheet, View } from 'react-native';
import AppText from '@components/shared/AppText';
import { COLORS } from '@config/colors';
import { rms, rs } from '@utils/scaling';

const OfflineNotice = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.text}>
        ⚡ You are offline. Login requires an internet connection.
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error.light,
    borderWidth: 1,
    borderColor: COLORS.error.border,
    borderRadius: rs(10),
    padding: rs(12),
    marginBottom: rs(16),
  },
  text: {
    fontSize: rms(13),
    color: COLORS.error.dark,
    textAlign: 'center',
    lineHeight: rms(18),
  },
});

export default OfflineNotice;
