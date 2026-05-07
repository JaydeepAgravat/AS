import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

interface LoginError {
  title: string;
  message: string;
}

export const useLoginHandler = (
  login: (username: string, password: string) => Promise<void>,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);

  const handleLogin = useCallback(
    async (username: string, password: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await login(username, password);
      } catch (err: any) {
        const status = err?.response?.status;
        let errorMessage: LoginError;

        if (!err?.response) {
          errorMessage = {
            title: 'Network Error',
            message:
              'Unable to reach the server. Check your internet connection.',
          };
        } else if (status === 400 || status === 401) {
          errorMessage = {
            title: 'Login Failed',
            message: 'Invalid username or password. Please try again.',
          };
        } else if (status >= 500) {
          errorMessage = {
            title: 'Server Error',
            message: 'The server is unavailable. Please try again later.',
          };
        } else {
          errorMessage = {
            title: 'Error',
            message: 'Something went wrong. Please try again.',
          };
        }

        setError(errorMessage);
        Alert.alert(errorMessage.title, errorMessage.message);
      } finally {
        setIsLoading(false);
      }
    },
    [login],
  );

  return {
    isLoading,
    error,
    handleLogin,
  };
};
