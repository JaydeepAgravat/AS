import axios from 'axios';
import { BASE_URL } from './client';
import { AuthTokens } from '@appTypes/index';

interface LoginPayload {
  username: string;
  password: string;
}

export const loginApi = async ({
  username,
  password,
}: LoginPayload): Promise<AuthTokens> => {
  const { data } = await axios.post<{ token: string }>(
    `${BASE_URL}/auth/login`,
    { username, password },
    { timeout: 12000 },
  );

  // TODO: In a real application, the refresh token would be provided by the server
  // NOTE: FakeStoreAPI: POST /auth/login → { token: string },  FakeStoreAPI doesn't provide refresh token
  return {
    accessToken: data.token,
    refreshToken: `refresh_${data.token}`,
  };
};
