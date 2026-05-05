import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NetworkProvider } from '@context/NetworkContext';
import { AuthProvider } from '@context/AuthContext';
import { ProductProvider } from '@context/ProductContext';
import RootNavigator from '@navigation/RootNavigator';
import OfflineBanner from '@components/OfflineBanner';

const App: React.FC = () => (
  <SafeAreaProvider>
    <NetworkProvider>
      <AuthProvider>
        <ProductProvider>
          <View style={styles.root}>
            <StatusBar barStyle={'dark-content'} />
            <RootNavigator />
            <OfflineBanner />
          </View>
        </ProductProvider>
      </AuthProvider>
    </NetworkProvider>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
