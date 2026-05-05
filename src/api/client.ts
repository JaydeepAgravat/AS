import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenStorage } from '../utils/tokenStorage';

export const BASE_URL = 'https://fakestoreapi.com';

// Module-level logout callback — set by AuthContext on mount
let _logoutCallback: (() => void) | null = null;

export const registerLogout = (fn: () => void): void => {
  _logoutCallback = fn;
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach access token (MMKV is sync → no async) ───────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// ── 401 response interceptor with refresh-token queue pattern ────────────────
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const flushQueue = (error: unknown, token: string | null): void => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!),
  );
  pendingQueue = [];
};

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Pass through non-401 errors and already-retried requests
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Queue concurrent 401s while refresh is in progress
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then(newToken => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = TokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');

      // FakeStoreAPI has no real refresh endpoint.
      // Production pattern: POST /auth/refresh { refreshToken } → { accessToken }
      // Here: derive new access token from stored refresh token (demo only)
      const newAccessToken = refreshToken.replace('refresh_', '');
      TokenStorage.setTokens(newAccessToken, `refresh_${newAccessToken}`);

      flushQueue(null, newAccessToken);
      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      // Force logout — clears MMKV + resets auth state
      _logoutCallback?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
