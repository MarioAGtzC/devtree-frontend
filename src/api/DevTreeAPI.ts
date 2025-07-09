import { isAxiosError } from 'axios';
import api from '../config/axios';
import type { User } from '../types';

export async function getUser() {
  try {
    const { data } = await api<User>('/user');
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response?.data?.error);
    }
  }
}

export async function updateProfile(formData: User) {
  try {
    const { data } = await api.patch<User>('/user', formData);
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      if(error.response?.data?.error) {
        throw new Error(error.response?.data?.error);
      }
      throw error.response?.data?.errors
    }
  }
}

export async function uploadimage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const { data: { image } } : { data: { image: string } } = await api.post('user/image', formData);
    return image;
    
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response?.data?.error);
    }
  }
}

export async function getUserByUsername(username: string) {
  try {
    const { data } = await api(`/${username}`);
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      if(error.response?.data?.error) {
        throw new Error(error.response?.data?.error);
      }
      throw error.response?.data?.errors
    }
  }
}