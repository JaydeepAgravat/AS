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
  Login: undefined;
  Home: undefined;
  ProductDetail: { product: Product };
};
