import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { AppStackScreenProps, Product } from '@appTypes/index';
import { useProducts } from '@context/ProductContext';
import { useNetwork } from '@context/NetworkContext';
import { useDebounce } from '@hooks/useDebounce';
import { COLORS } from '@config/colors';
import { rs } from '@utils/scaling';
import { SCREENS } from '@utils/screens';
import AppLoader from '@components/shared/AppLoader';
import ErrorMessage from '@components/feedback/ErrorMessage';
import ErrorBanner from '@components/feedback/ErrorBanner';
import SearchBar from '@components/search/SearchBar';
import SearchResults from '@components/search/SearchResults';
import ProductListFooter from '@components/products/ProductListFooter';
import ProductListEmpty from '@components/products/ProductListEmpty';
import ProductCard from '@components/products/ProductCard';

type Props = AppStackScreenProps<typeof SCREENS.HOME>;

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
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery]);

  useEffect(() => {
    if (justReconnected && (error || products.length === 0)) {
      fetchProducts();
    }
  }, [justReconnected, error, products.length, fetchProducts]);

  const paginatedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  );
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
        onPress={() =>
          navigation.navigate(SCREENS.PRODUCT_DETAILS, { product: item })
        }
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  if (isLoading && products.length === 0) {
    return <AppLoader message="Loading products..." />;
  }

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
      {error && products.length > 0 ? (
        <ErrorBanner
          message={error}
          onRetry={() => {
            clearError();
            fetchProducts(true);
          }}
        />
      ) : null}

      <SearchBar value={localSearchQuery} onChangeText={setLocalSearchQuery} />

      <SearchResults count={filteredProducts.length} query={searchQuery} />

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
          <ProductListFooter
            isLoading={visibleCount < filteredProducts.length}
          />
        }
        ListEmptyComponent={<ProductListEmpty />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  grid: {
    paddingHorizontal: rs(8),
    paddingTop: rs(8),
    paddingBottom: rs(100),
  },
});

export default HomeScreen;
