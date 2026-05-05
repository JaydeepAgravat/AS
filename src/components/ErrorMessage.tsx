import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from './AppText';
import { COLORS } from '../config/colors';
import { rs, rms } from '../utils/scaling';

interface Props {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<Props> = ({ message, onRetry }) => (
  <View style={styles.container}>
    <AppText style={styles.icon}>⚠️</AppText>
    <AppText style={styles.title}>Something went wrong</AppText>
    <AppText style={styles.message}>{message}</AppText>
    {onRetry ? (
      <TouchableOpacity
        style={styles.button}
        onPress={onRetry}
        activeOpacity={0.8}
      >
        <AppText style={styles.buttonText}>Try Again</AppText>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: rs(32),
    backgroundColor: COLORS.background.primary,
  },
  icon: { fontSize: rms(48), marginBottom: rs(16) },
  title: {
    fontSize: rms(18),
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: rs(8),
  },
  message: {
    fontSize: rms(14),
    color: COLORS.text.tertiary,
    textAlign: 'center',
    lineHeight: rms(22),
  },
  button: {
    marginTop: rs(24),
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: rs(28),
    paddingVertical: rs(13),
    borderRadius: rs(12),
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: rms(15),
  },
});

export default ErrorMessage;
