import { StyleSheet, Text, type TextProps } from 'react-native';
import { FONTS } from '../config/fonts';
import { COLORS } from '../config/colors';
import { rms } from '../utils/scaling';

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
