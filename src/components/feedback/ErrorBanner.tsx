import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '@components/shared/AppText';
import { COLORS } from '@config/colors';
import { FONTS } from '@config/fonts';
import { rms, rs } from '@utils/scaling';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.message}>{message}</AppText>
      <TouchableOpacity onPress={onRetry}>
        <AppText style={styles.retryButton}>Retry</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.error.light,
    paddingHorizontal: rs(16),
    paddingVertical: rs(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.error.border,
  },
  message: {
    flex: 1,
    fontSize: rms(13),
    color: COLORS.error.dark,
    lineHeight: rms(18),
  },
  retryButton: {
    fontSize: rms(13),
    fontFamily: FONTS.MANROPE_BOLD,
    color: COLORS.primary.main,
    marginLeft: rs(12),
  },
});

export default ErrorBanner;
