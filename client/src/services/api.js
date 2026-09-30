import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://online-canteen.onrender.com/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// =================== Auth ===================
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// =================== Menu ===================
export const getMenuItems = (category) =>
  API.get(`/menu${category ? `?category=${category}` : ''}`);
export const getMenuItemById = (id) => API.get(`/menu/${id}`);
export const addMenuItem = (data) => API.post('/menu', data);
export const updateMenuItem = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);

// =================== Orders ===================
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });

// =================== Real Bank Payments (Razorpay / GPay / PhonePe) ===================
export const createRazorpayOrder = (amount) => API.post('/payment/create-order', { amount });
export const verifyPaymentAndCreateOrder = (paymentData) => API.post('/payment/verify', paymentData);

export default API;
