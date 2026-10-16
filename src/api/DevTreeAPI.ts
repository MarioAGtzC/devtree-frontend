import { isAxiosError } from 'axios';
import api from '../config/axios';
import type { User, Username } from '../types';

// Shown when the server answers without an error message (e.g. a 500 with an HTML body)
const GENERIC_ERROR = 'Something went wrong, please try again';

export async function getUser() {
  try {
    const { data } = await api<User>('/user');
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || GENERIC_ERROR);
    }
    throw error;
  }
}

export async function updateProfile(formData: User) {
  try {
    const { data } = await api.patch<User>('/user', formData);
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      if(error.response.data?.error) {
        throw new Error(error.response.data.error);
      }
      if(error.response.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(GENERIC_ERROR);
    }
    throw error;
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
      throw new Error(error.response.data?.error || GENERIC_ERROR);
    }
    throw error;
  }
}

export async function getUserByUsername(username: string) {
  try {
    const { data } = await api<Username>(`/${username}`);
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      if(error.response.data?.error) {
        throw new Error(error.response.data.error);
      }
      if(error.response.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(GENERIC_ERROR);
    }
    throw error;
  }
}

export async function searchByUsername(username: string) {
  try {
    const { data } = await api.post<string>('/search', {username});
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      if(error.response.data?.error) {
        throw [{ msg: error.response.data.error }];
      }
      if(error.response.data?.errors) {
        throw error.response.data.errors;
      }
      throw new Error(GENERIC_ERROR);
    }
    throw error;
  }
}