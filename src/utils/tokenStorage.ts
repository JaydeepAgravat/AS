import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'auth-storage' });

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const TokenStorage = {
  setTokens(accessToken: string, refreshToken: string): void {
    storage.set(ACCESS_TOKEN_KEY, accessToken);
    storage.set(REFRESH_TOKEN_KEY, refreshToken);
  },

  getAccessToken(): string | undefined {
    return storage.getString(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | undefined {
    return storage.getString(REFRESH_TOKEN_KEY);
  },

  clearTokens(): void {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
  },

  hasTokens(): boolean {
    return storage.contains(ACCESS_TOKEN_KEY);
  },
};
