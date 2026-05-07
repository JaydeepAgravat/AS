import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';

import { NetworkProvider } from '@context/NetworkContext';
import { AuthProvider, useAuth } from '@context/AuthContext';
import { ProductProvider } from '@context/ProductContext';
import { PopupProvider } from '@context/PopupContext';
import RootNavigator from '@navigation/RootNavigator';
import OfflineBanner from '@components/feedback/OfflineBanner';
import PopupManager from '@components/popup/PopupManager';

const AppContent = () => {
  const { isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing) {
      BootSplash.hide({ fade: true });
    }
  }, [isInitializing]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle={'dark-content'} />
      <RootNavigator />
      <OfflineBanner />
      <PopupManager />
    </View>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <AuthProvider>
          <ProductProvider>
            <PopupProvider>
              <AppContent />
            </PopupProvider>
          </ProductProvider>
        </AuthProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
