import { apiClient } from '@/lib/axios';
import { User } from '@/types';

export const login = async (username: string, password: string): Promise<User> => {
  const response = await apiClient.post<User>('/auth/login', {
    username,
    password,
    expiresInMins: 60, // Optional, defaults to 60 mins
  });
  return response.data;
};
