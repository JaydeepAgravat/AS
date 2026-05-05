import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppText from '../components/AppText';
import { useAuth } from '../context/AuthContext';
import { useNetwork } from '../context/NetworkContext';
import { COLORS } from '../config/colors';
import { rs, rms } from '../utils/scaling';

// FakeStoreAPI test credentials: mor_2314 / 83r5^_

interface FieldErrors {
  username?: string;
  password?: string;
}

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('mor_2314');
  const [password, setPassword] = useState('83r5^_');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const passwordRef = useRef<TextInput>(null);
  const { login } = useAuth();
  const { isConnected } = useNetwork();

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!validate()) return;

    if (!isConnected) {
      Alert.alert('No Internet', 'Please check your connection and try again.');
      return;
    }

    setIsLoading(true);
    try {
      await login(username.trim(), password);
      // Navigation handled automatically by RootNavigator on isAuthenticated change
    } catch (err: any) {
      const status = err?.response?.status;

      if (!err?.response) {
        Alert.alert(
          'Network Error',
          'Unable to reach the server. Check your internet connection.',
        );
      } else if (status === 400 || status === 401) {
        Alert.alert(
          'Login Failed',
          'Invalid username or password. Please try again.',
        );
      } else if (status >= 500) {
        Alert.alert(
          'Server Error',
          'The server is unavailable. Please try again later.',
        );
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <AppText style={styles.logoEmoji}>🛍️</AppText>
          </View>
          <AppText style={styles.title}>Welcome Back</AppText>
          <AppText style={styles.subtitle}>Sign in to continue</AppText>
        </View>

        {/* Offline notice */}
        {!isConnected && (
          <View style={styles.offlineNotice}>
            <AppText style={styles.offlineText}>
              ⚡ You are offline. Login requires an internet connection.
            </AppText>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <AppText style={styles.label}>Username</AppText>
            <TextInput
              style={[
                styles.input,
                fieldErrors.username ? styles.inputError : null,
              ]}
              placeholder="Enter your username"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={t => {
                setUsername(t);
                clearFieldError('username');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isLoading}
            />
            {fieldErrors.username ? (
              <AppText style={styles.fieldError}>
                {fieldErrors.username}
              </AppText>
            ) : null}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <AppText style={styles.label}>Password</AppText>
            <TextInput
              ref={passwordRef}
              style={[
                styles.input,
                fieldErrors.password ? styles.inputError : null,
              ]}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={t => {
                setPassword(t);
                clearFieldError('password');
              }}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!isLoading}
            />
            {fieldErrors.password ? (
              <AppText style={styles.fieldError}>
                {fieldErrors.password}
              </AppText>
            ) : null}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              (isLoading || !isConnected) && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading || !isConnected}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AppText style={styles.loginButtonText}>Sign In</AppText>
            )}
          </TouchableOpacity>
        </View>

        {/* Test credentials hint */}
        <View style={styles.hintBox}>
          <AppText style={styles.hintTitle}>Test Credentials</AppText>
          <AppText style={styles.hintRow}>
            <AppText style={styles.hintKey}>Username: </AppText>
            <AppText style={styles.hintValue}>mor_2314</AppText>
          </AppText>
          <AppText style={styles.hintRow}>
            <AppText style={styles.hintKey}>Password: </AppText>
            <AppText style={styles.hintValue}>83r5^_</AppText>
          </AppText>
        </View>
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
  logoEmoji: { fontSize: rms(36) },
  title: {
    fontSize: rms(28),
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: rms(15),
    color: COLORS.text.tertiary,
    marginTop: rs(6),
  },
  offlineNotice: {
    backgroundColor: COLORS.error.light,
    borderWidth: 1,
    borderColor: COLORS.error.border,
    borderRadius: rs(10),
    padding: rs(12),
    marginBottom: rs(16),
  },
  offlineText: {
    fontSize: rms(13),
    color: COLORS.error.dark,
    textAlign: 'center',
    lineHeight: rms(18),
  },
  form: {
    gap: rs(16),
  },
  inputGroup: {
    gap: rs(6),
  },
  label: {
    fontSize: rms(14),
    fontWeight: '600',
    color: COLORS.text.label,
  },
  input: {
    backgroundColor: COLORS.background.input,
    borderWidth: 1.5,
    borderColor: COLORS.border.primary,
    borderRadius: rs(12),
    paddingHorizontal: rs(16),
    paddingVertical: Platform.OS === 'ios' ? rs(14) : rs(12),
    fontSize: rms(15),
    color: COLORS.text.primary,
  },
  inputError: {
    borderColor: COLORS.error.main,
  },
  fieldError: {
    fontSize: rms(12),
    color: COLORS.error.main,
  },
  loginButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: rs(14),
    paddingVertical: rs(15),
    alignItems: 'center',
    marginTop: rs(6),
  },
  loginButtonDisabled: {
    opacity: 0.55,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: rms(16),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  hintBox: {
    marginTop: rs(32),
    backgroundColor: COLORS.success.light,
    borderRadius: rs(12),
    padding: rs(16),
    borderWidth: 1,
    borderColor: COLORS.success.lighter,
    gap: rs(4),
  },
  hintTitle: {
    fontSize: rms(11),
    fontWeight: '700',
    color: COLORS.success.dark,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: rs(6),
  },
  hintRow: {
    fontSize: rms(13),
  },
  hintKey: {
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  hintValue: {
    color: COLORS.success.dark,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
  },
});

export default LoginScreen;
