import axios from 'axios';
// import { cookies } from 'next/headers';
import Cookies from 'js-cookie';

import { COOKIES_KEYS } from './app-constants';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

axiosInstance.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    let locale = Cookies.get('locale') || 'en';
    config.headers['Accept-Language'] = locale;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const confirmed = window.confirm('session expired');
      if (confirmed) {
        Cookies.remove(COOKIES_KEYS.token);
        Cookies.remove(COOKIES_KEYS.tokenExpireTime);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
