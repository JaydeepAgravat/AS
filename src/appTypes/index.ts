import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SCREENS } from '@utils/screens';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type RootStackParamList = {
  [SCREENS.LOGIN]: undefined;
  [SCREENS.HOME]: undefined;
  [SCREENS.PRODUCT_DETAILS]: { product: Product };
};

export type AppStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
