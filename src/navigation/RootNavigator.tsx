import { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '@appTypes/index';
import AppText from '@components/AppText';
import { COLORS } from '@config/colors';
import { rms, rs } from '@utils/scaling';
import { useAuth } from '@context/AuthContext';
import AppLoader from '@components/AppLoader';
import LoginScreen from '@screens/LoginScreen';
import HomeScreen from '@screens/HomeScreen';
import ProductDetailScreen from '@screens/ProductDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => (
  <TouchableOpacity
    style={styles.logoutBtn}
    onPress={onLogout}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <AppText style={styles.logoutText}>Logout</AppText>
  </TouchableOpacity>
);

const sharedScreenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: COLORS.background.primary },
  headerTintColor: COLORS.primary.main,
  headerShadowVisible: false,
  headerTitleStyle: {
    fontWeight: '700',
    color: COLORS.text.primary,
    fontSize: rms(17),
  },
  contentStyle: { backgroundColor: COLORS.background.primary },
};

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitializing, logout } = useAuth();

  const renderLogoutButton = useCallback(
    () => <LogoutButton onLogout={logout} />,
    [logout],
  );

  // Block render until MMKV token check completes (synchronous, very fast)
  if (isInitializing) return <AppLoader />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={sharedScreenOptions}>
        {!isAuthenticated ? (
          // ── Unauthenticated ───────────────────────────────────────────────
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // ── Authenticated (protected) ─────────────────────────────────────
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Products',
                headerRight: renderLogoutButton,
              }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{
                title: 'Product Detail',
                headerBackTitle: 'Back',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  logoutBtn: {
    paddingHorizontal: rs(4),
  },
  logoutText: {
    fontSize: rms(15),
    fontWeight: '600',
    color: COLORS.error.main,
  },
});

export default RootNavigator;
