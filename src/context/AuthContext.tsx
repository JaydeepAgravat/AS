import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import { loginApi } from '@api/auth';
import { registerLogout } from '@api/client';
import { TokenStorage } from '@utils/tokenStorage';

// ── State & Actions ────────────────────────────────────────────────────────────

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isInitializing: boolean;
}

type AuthAction =
  | {
      type: 'INIT_COMPLETE';
      payload: { accessToken: string | null; refreshToken: string | null };
    }
  | {
      type: 'SET_TOKENS';
      payload: { accessToken: string; refreshToken: string };
    }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  isInitializing: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INIT_COMPLETE':
      return {
        ...state,
        isAuthenticated: !!action.payload.accessToken,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isInitializing: false,
      };
    case 'SET_TOKENS':
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      };
    default:
      return state;
  }
}

// ── Context Type ──────────────────────────────────────────────────────────────

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// ── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Register logout handler with API client (runs once; dispatch is stable)
  useEffect(() => {
    registerLogout(() => {
      TokenStorage.clearTokens();
      dispatch({ type: 'LOGOUT' });
    });
  }, []);

  // Read tokens from MMKV synchronously on mount — no flicker
  useEffect(() => {
    const accessToken = TokenStorage.getAccessToken() ?? null;
    const refreshToken = TokenStorage.getRefreshToken() ?? null;
    dispatch({ type: 'INIT_COMPLETE', payload: { accessToken, refreshToken } });
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      // Throws on error — LoginScreen handles it
      const { accessToken, refreshToken } = await loginApi({
        username,
        password,
      });
      TokenStorage.setTokens(accessToken, refreshToken);
      dispatch({ type: 'SET_TOKENS', payload: { accessToken, refreshToken } });
    },
    [],
  );

  const logout = useCallback((): void => {
    TokenStorage.clearTokens();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
