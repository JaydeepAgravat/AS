import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@components/shared/AppText';
import { COLORS } from '@config/colors';
import { FONTS } from '@config/fonts';
import { rms, rs } from '@utils/scaling';

interface LoginButtonProps {
  onPress: () => void;
  isLoading: boolean;
  disabled: boolean;
  label?: string;
}

const LoginButton = ({
  onPress,
  isLoading,
  disabled,
  label = 'Sign In',
}: LoginButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <AppText style={styles.text}>{label}</AppText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary.main,
    borderRadius: rs(14),
    paddingVertical: rs(15),
    alignItems: 'center',
    marginTop: rs(6),
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  text: {
    color: COLORS.white,
    fontSize: rms(16),
    letterSpacing: 0.3,
    fontFamily: FONTS.MANROPE_BOLD,
  },
});

export default LoginButton;
