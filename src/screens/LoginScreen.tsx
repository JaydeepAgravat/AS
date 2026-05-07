import { COLORS } from '@config/colors';
import { FONTS } from '@config/fonts';
import { ICONS } from '@config/icons';
import { useLoginFormValidation } from '@hooks/useFormValidation';
import { useLoginHandler } from '@hooks/useLoginHandler';
import { useAuth } from '@context/AuthContext';
import { useNetwork } from '@context/NetworkContext';
import { rms, rs } from '@utils/scaling';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { AppStackScreenProps } from '@appTypes/index';
import { SCREENS } from '@utils/screens';
import AppImage from '@components/shared/AppImage';
import AppText from '@components/shared/AppText';
import OfflineNotice from '@components/feedback/OfflineNotice';
import FormTextInput from '@components/forms/FormTextInput';
import LoginButton from '@components/forms/LoginButton';
import TestCredentialsHint from '@components/auth/TestCredentialsHint';

type Props = AppStackScreenProps<typeof SCREENS.LOGIN>;

const LoginScreen = ({}: Props) => {
  const [username, setUsername] = useState('mor_2314');
  const [password, setPassword] = useState('83r5^_');
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<TextInput>(null);
  const { login } = useAuth();
  const { isConnected } = useNetwork();

  const { fieldErrors, validate, clearFieldError } = useLoginFormValidation();
  const { isLoading, handleLogin: performLogin } = useLoginHandler(login);

  const handleLogin = async () => {
    if (!validate(username, password)) return;

    if (!isConnected) {
      Alert.alert('No Internet', 'Please check your connection and try again.');
      return;
    }

    await performLogin(username.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <AppImage source={ICONS.BAG} style={styles.bagIcon} />
          </View>
          <AppText style={styles.title}>Welcome Back</AppText>
          <AppText style={styles.subtitle}>Sign in to continue</AppText>
        </View>

        {!isConnected && <OfflineNotice />}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <AppText style={styles.label}>Username</AppText>
            <FormTextInput
              value={username}
              onChangeText={t => {
                setUsername(t);
                clearFieldError('username');
              }}
              placeholder="Enter your username"
              isError={!!fieldErrors.username}
              editable={!isLoading}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {fieldErrors.username ? (
              <AppText style={styles.fieldError}>
                {fieldErrors.username}
              </AppText>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <AppText style={styles.label}>Password</AppText>
            <FormTextInput
              value={password}
              onChangeText={t => {
                setPassword(t);
                clearFieldError('password');
              }}
              placeholder="Enter your password"
              isPassword={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(prev => !prev)}
              isError={!!fieldErrors.password}
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              inputRef={passwordRef}
            />
            {fieldErrors.password ? (
              <AppText style={styles.fieldError}>
                {fieldErrors.password}
              </AppText>
            ) : null}
          </View>

          <LoginButton
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={isLoading || !isConnected}
          />
        </View>

        <TestCredentialsHint />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background.primary },
  container: {
    flexGrow: 1,
    paddingHorizontal: rs(24),
    paddingVertical: rs(40),
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: rs(36),
  },
  logoBox: {
    width: rs(76),
    height: rs(76),
    borderRadius: rs(22),
    backgroundColor: COLORS.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rs(20),
    borderWidth: 1,
    borderColor: COLORS.primary.lighter,
  },
  bagIcon: {
    width: rs(56),
    height: rs(56),
  },
  title: {
    fontSize: rms(28),
    color: COLORS.text.primary,
    letterSpacing: -0.5,
    fontFamily: FONTS.MANROPE_BOLD,
  },
  subtitle: {
    fontSize: rms(15),
    color: COLORS.text.tertiary,
    marginTop: rs(6),
  },
  form: {
    gap: rs(16),
  },
  inputGroup: {
    gap: rs(6),
  },
  label: {
    fontSize: rms(14),
    color: COLORS.text.label,
    fontFamily: FONTS.MANROPE_MEDIUM,
  },
  fieldError: {
    fontSize: rms(12),
    color: COLORS.error.main,
  },
});

export default LoginScreen;
