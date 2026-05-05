import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { COLORS } from '../config/colors';
import { rs, rms } from '../utils/scaling';

interface Props {
  message?: string;
}

const AppLoader: React.FC<Props> = ({ message }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={COLORS.primary.main} />
    {message ? <AppText style={styles.message}>{message}</AppText> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
    gap: rs(12),
  },
  message: {
    fontSize: rms(14),
    color: COLORS.text.tertiary,
    marginTop: rs(4),
  },
});

export default AppLoader;
