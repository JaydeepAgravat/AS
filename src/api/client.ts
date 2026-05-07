import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenStorage } from '../utils/tokenStorage';

export const BASE_URL = 'https://fakestoreapi.com';

// NOTE: set by AuthContext on mount
let _logoutCallback: (() => void) | null = null;

export const registerLogout = (fn: () => void): void => {
  _logoutCallback = fn;
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

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

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

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

      // NOTE: FakeStoreAPI has no real refresh endpoint.
      // TODO: In a real application, : POST /auth/refresh { refreshToken } → { accessToken }
      // NOTE: derive new access token from stored refresh token
      const newAccessToken = refreshToken.replace('refresh_', '');
      TokenStorage.setTokens(newAccessToken, `refresh_${newAccessToken}`);

      flushQueue(null, newAccessToken);
      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      // Force logout
      _logoutCallback?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
