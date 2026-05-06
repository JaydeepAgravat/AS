import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '@appTypes/index';
import { useProducts } from '@context/ProductContext';
import { useNetwork } from '@context/NetworkContext';
import ProductCard from '@components/ProductCard';
import AppLoader from '@components/AppLoader';
import ErrorMessage from '@components/ErrorMessage';
import AppText from '@components/AppText';
import { COLORS } from '@config/colors';
import { rms, rs } from '@utils/scaling';
import { FONTS } from '@config/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const PAGE_SIZE = 8;

const HomeScreen = ({ navigation }: Props) => {
  const {
    filteredProducts,
    products,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    fetchProducts,
    setSearchQuery,
    clearError,
  } = useProducts();

  const { justReconnected } = useNetwork();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset pagination when the search query changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery]);

  const paginatedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  );

  // Auto-retry when network is restored and we have an error or no products
  useEffect(() => {
    if (justReconnected && (error || products.length === 0)) {
      fetchProducts();
    }
  }, [justReconnected, error, products.length, fetchProducts]);

  const handleRefresh = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  const handleLoadMore = useCallback(() => {
    if (visibleCount >= filteredProducts.length) {
      return;
    }

    setVisibleCount(currentCount =>
      Math.min(currentCount + PAGE_SIZE, filteredProducts.length),
    );
  }, [filteredProducts.length, visibleCount]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  // Full-screen loading (first load only)
  if (isLoading && products.length === 0) {
    return <AppLoader message="Loading products..." />;
  }

  // Full-screen error (no products to show)
  if (error && products.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => {
          clearError();
          fetchProducts();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Inline error banner (when we have products but refresh failed) */}
      {error && products.length > 0 ? (
        <View style={styles.inlineError}>
          <AppText style={styles.inlineErrorText}>{error}</AppText>
          <TouchableOpacity
            onPress={() => {
              clearError();
              fetchProducts(true);
            }}
          >
            <AppText style={styles.inlineRetry}>Retry</AppText>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <AppText style={styles.searchIcon}>🔍</AppText>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={COLORS.text.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing" // iOS only
        />
        {/* Android clear button */}
        {Platform.OS === 'android' && searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <AppText style={styles.clearBtn}>✕</AppText>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Result count for search */}
      {searchQuery.trim().length > 0 ? (
        <AppText style={styles.resultCount}>
          {filteredProducts.length} result
          {filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
        </AppText>
      ) : null}

      {/* Product grid */}
      <FlatList
        data={paginatedProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.6}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary.main}
            colors={[COLORS.primary.main]}
          />
        }
        ListFooterComponent={
          visibleCount < filteredProducts.length ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color={COLORS.primary.main} />
              <AppText style={styles.footerText}>Loading more products</AppText>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyIcon}>🔍</AppText>
            <AppText style={styles.emptyTitle}>No products found</AppText>
            <AppText style={styles.emptySubtitle}>
              Try a different search term
            </AppText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.primary },
  inlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.error.light,
    paddingHorizontal: rs(16),
    paddingVertical: rs(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.error.border,
  },
  inlineErrorText: {
    flex: 1,
    fontSize: rms(13),
    color: COLORS.error.dark,
    lineHeight: rms(18),
  },
  inlineRetry: {
    fontSize: rms(13),
    fontFamily: FONTS.MANROPE_BOLD,
    color: COLORS.primary.main,
    marginLeft: rs(12),
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.card,
    marginHorizontal: rs(16),
    marginTop: rs(12),
    marginBottom: rs(4),
    borderRadius: rs(12),
    paddingHorizontal: rs(12),
    height: rs(46),
    borderWidth: 1.5,
    borderColor: COLORS.border.primary,
    gap: rs(8),
  },
  searchIcon: { fontSize: rms(15) },
  searchInput: {
    flex: 1,
    fontSize: rms(15),
    color: COLORS.text.primary,
    paddingVertical: 0,
  },
  clearBtn: {
    fontSize: rms(14),
    color: COLORS.text.placeholder,
    padding: rs(4),
  },
  resultCount: {
    fontSize: rms(12),
    color: COLORS.text.tertiary,
    marginHorizontal: rs(16),
    marginBottom: rs(2),
  },
  grid: {
    paddingHorizontal: rs(8),
    paddingTop: rs(8),
    paddingBottom: rs(60), // avoid overlap with offline banner
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: rs(80),
    gap: rs(8),
  },
  emptyIcon: { fontSize: rms(48) },
  emptyTitle: {
    fontSize: rms(17),
    fontFamily: FONTS.MANROPE_MEDIUM,
    color: COLORS.text.primary,
  },
  emptySubtitle: {
    fontSize: rms(14),
    color: COLORS.text.tertiary,
  },
  footerLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs(8),
    paddingVertical: rs(16),
  },
  footerText: {
    fontSize: rms(13),
    color: COLORS.text.tertiary,
  },
});

export default HomeScreen;
