import { apiClient } from '@/lib/axios';
import { Product, ProductsResponse } from '@/types';

interface FetchProductsParams {
  limit?: number;
  skip?: number;
  q?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const fetchProducts = async ({
  limit = 10,
  skip = 0,
  q = '',
  category = '',
  sortBy = '',
  order = 'asc',
}: FetchProductsParams, signal?: AbortSignal): Promise<ProductsResponse> => {
  let url = '/products';
  
  if (q) {
    url = `/products/search`;
  } else if (category) {
    url = `/products/category/${category}`;
  }

  const params: Record<string, any> = { limit, skip };
  
  if (q) {
    params.q = q;
  }
  
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  const response = await apiClient.get<ProductsResponse>(url, { params, signal });
  return response.data;
};

export const fetchProductById = async (id: string | number): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

export const fetchCategories = async (): Promise<{ slug: string, name: string }[]> => {
  const response = await apiClient.get<{ slug: string, name: string }[]>('/products/categories');
  return response.data;
};

export const addProduct = async (productData: Partial<Product>): Promise<Product> => {
  const response = await apiClient.post<Product>('/products/add', productData);
  return response.data;
};

export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  const response = await apiClient.put<Product>(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<{ isDeleted: boolean; deletedOn: string }> => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};
