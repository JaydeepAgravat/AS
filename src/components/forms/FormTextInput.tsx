import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '@config/colors';
import { ICONS } from '@config/icons';
import { rms, rs } from '@utils/scaling';
import AppImage from '@components/shared/AppImage';

interface FormTextInputProps extends TextInputProps {
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  isError?: boolean;
  inputRef?: React.Ref<TextInput>;
}

const FormTextInput = ({
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  isError = false,
  editable = true,
  inputRef,
  ...textInputProps
}: FormTextInputProps) => {
  return (
    <View
      style={[
        styles.wrapper,
        isError ? styles.wrapperError : null,
        isPassword ? styles.wrapperWithToggle : null,
      ]}
    >
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholderTextColor={COLORS.text.placeholder}
        secureTextEntry={isPassword && !showPassword}
        {...textInputProps}
      />
      {isPassword && onTogglePassword && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={onTogglePassword}
          disabled={!editable}
          activeOpacity={0.75}
        >
          <AppImage
            source={showPassword ? ICONS.EYE : ICONS.EYE_SLASH}
            style={styles.toggleIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.input,
    borderWidth: 1.5,
    borderColor: COLORS.border.primary,
    borderRadius: rs(12),
    paddingHorizontal: rs(16),
  },
  wrapperWithToggle: {
    paddingRight: rs(10),
  },
  wrapperError: {
    borderColor: COLORS.error.main,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? rs(14) : rs(12),
    fontSize: rms(15),
    color: COLORS.text.primary,
  },
  toggleButton: {
    padding: rs(6),
  },
  toggleIcon: {
    width: rs(20),
    height: rs(20),
  },
});

export default FormTextInput;
