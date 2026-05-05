import axios from 'axios';
import { BASE_URL } from './client';
import { AuthTokens } from '../types';

interface LoginPayload {
  username: string;
  password: string;
}

// FakeStoreAPI: POST /auth/login → { token: string }
// We add a simulated refresh token since the API doesn't provide one
export const loginApi = async ({
  username,
  password,
}: LoginPayload): Promise<AuthTokens> => {
  const { data } = await axios.post<{ token: string }>(
    `${BASE_URL}/auth/login`,
    { username, password },
    { timeout: 12000 },
  );

  return {
    accessToken: data.token,
    refreshToken: `refresh_${data.token}`,
  };
};
