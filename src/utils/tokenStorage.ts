import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'root' });

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const TokenStorage = {
  setTokens(accessToken: string, refreshToken: string) {
    storage.set(ACCESS_TOKEN_KEY, accessToken);
    storage.set(REFRESH_TOKEN_KEY, refreshToken);
  },

  getAccessToken() {
    return storage.getString(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return storage.getString(REFRESH_TOKEN_KEY);
  },

  clearTokens() {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
  },

  hasTokens() {
    return storage.contains(ACCESS_TOKEN_KEY);
  },
};
