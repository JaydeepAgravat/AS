import { Product } from '../types';
import { apiClient } from './client';

export const fetchProductsApi = async (): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>('/products');
  return data;
};
