import { COLORS } from '@config/colors';
import { FONTS } from '@config/fonts';
import { rms } from '@utils/scaling';
import { StyleSheet, Text, type TextProps } from 'react-native';

const AppText = (props: TextProps) => {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.MANROPE_REGULAR,
    fontSize: rms(16),
    color: COLORS.text.primary,
  },
});

export default AppText;
