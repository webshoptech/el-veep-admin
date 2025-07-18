import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://apiamh.crosshubdigital.com/api/v1/admin',
  withCredentials: true, 
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie
      .split('; ')
      .reduce((acc: Record<string, string>, cookie) => {
        const [key, val] = cookie.split('=');
        acc[key] = decodeURIComponent(val);
        return acc;
      }, {});

    const token = cookies['token'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;
