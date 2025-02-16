import Cookies from 'js-cookie';
import { COOKIES_KEYS } from '@/app-constants';
import axiosInstance from '@/axiosInstance';
import { LoginResponse } from '@/endpoints/auth/types';

const handleToken = (responseData: LoginResponse | undefined) => {
  if (!responseData?.token) return;
  Cookies.set(COOKIES_KEYS.token, responseData.token);
  axiosInstance.defaults.headers.common['Authorization'] =
    `Bearer ${responseData.token}`;
};

export default handleToken;
