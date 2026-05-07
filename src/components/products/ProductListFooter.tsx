import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AppText from '@components/shared/AppText';
import { COLORS } from '@config/colors';
import { rms, rs } from '@utils/scaling';

interface ProductListFooterProps {
  isLoading: boolean;
}

const ProductListFooter = ({ isLoading }: ProductListFooterProps) => {
  if (!isLoading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={COLORS.primary.main} />
      <AppText style={styles.text}>Loading more products</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs(8),
    paddingVertical: rs(16),
  },
  text: {
    fontSize: rms(13),
    color: COLORS.text.tertiary,
  },
});

export default ProductListFooter;
