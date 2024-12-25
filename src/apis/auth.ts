import { AxiosResponse } from 'axios';
import axios from '../utils/axios';

export const signIn = (payload: object): Promise<AxiosResponse> =>
  axios.post('/users/users/sign_in', payload);

export const getCurrentUser = (): Promise<AxiosResponse> => axios.get('/users/users/current');
export const updateProfile = (payload: object): Promise<AxiosResponse> =>
  axios.put('/users/users/current', payload);
export const changePassword = (payload: object): Promise<AxiosResponse> =>
  axios.put('/users/users/current/password', payload);
