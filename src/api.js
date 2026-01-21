import axios from 'axios';

const API = axios.create({
  baseURL: 'https://zahra-honey-storebackend--falconamrici.replit.app',
  withCredentials: true
});

// إضافة التوكن لكل طلب تلقائياً
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// تأكد من وجود كلمة default هنا
export default API;
