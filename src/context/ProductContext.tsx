import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Product } from '@appTypes/index';
import { fetchProductsApi } from '@api/products';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
}

type ProductAction =
  | { type: 'FETCH_START' }
  | { type: 'REFRESH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  searchQuery: '',
};

function applyFilter(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  return products.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()),
  );
}

function productReducer(
  state: ProductState,
  action: ProductAction,
): ProductState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'REFRESH_START':
      return { ...state, isRefreshing: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        products: action.payload,
        filteredProducts: applyFilter(action.payload, state.searchQuery),
        error: null,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        error: action.payload,
      };
    case 'SET_SEARCH':
      return {
        ...state,
        searchQuery: action.payload,
        filteredProducts: applyFilter(state.products, action.payload),
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface ProductContextType extends ProductState {
  fetchProducts: (isRefresh?: boolean) => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

const ProductContext = createContext<ProductContextType>(
  {} as ProductContextType,
);

function resolveErrorMessage(err: any): string {
  if (!err?.response) {
    return 'Network error. Check your internet connection.';
  }
  switch (err.response.status) {
    case 401:
      return 'Session expired. Please login again.';
    case 403:
      return 'Access denied.';
    case 404:
      return 'Products not found.';
    case 429:
      return 'Too many requests. Please wait and try again.';
    default:
      if (err.response.status >= 500) {
        return 'Server error. Please try again later.';
      }
      return 'Something went wrong. Please try again.';
  }
}

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const loadingRef = useRef({ isLoading: false, isRefreshing: false });

  const fetchProducts = useCallback(
    async (isRefresh = false): Promise<void> => {
      if (!isRefresh && loadingRef.current.isLoading) return;
      if (isRefresh && loadingRef.current.isRefreshing) return;

      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        dispatch({
          type: 'FETCH_ERROR',
          payload:
            'No internet connection. Please check your network and try again.',
        });
        return;
      }

      if (isRefresh) {
        loadingRef.current.isRefreshing = true;
        dispatch({ type: 'REFRESH_START' });
      } else {
        loadingRef.current.isLoading = true;
        dispatch({ type: 'FETCH_START' });
      }

      try {
        const products = await fetchProductsApi();
        dispatch({ type: 'FETCH_SUCCESS', payload: products });
      } catch (err: any) {
        dispatch({ type: 'FETCH_ERROR', payload: resolveErrorMessage(err) });
      } finally {
        if (isRefresh) {
          loadingRef.current.isRefreshing = false;
        } else {
          loadingRef.current.isLoading = false;
        }
      }
    },
    [],
  );

  const setSearchQuery = useCallback((query: string): void => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <ProductContext.Provider
      value={{ ...state, fetchProducts, setSearchQuery, clearError }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => useContext(ProductContext);
