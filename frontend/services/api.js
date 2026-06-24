import Constants from 'expo-constants';
import { Platform } from 'react-native';

const LAN_IP = '192.168.31.13';
const runtimeApiUrl = Constants?.expoConfig?.extra?.apiUrl || Constants?.manifest?.extra?.apiUrl;

const pickApiUrl = () => {
  if (runtimeApiUrl) return runtimeApiUrl;

  if (typeof Platform !== 'undefined') {
    if (Platform.OS === 'android' && __DEV__) return `http://10.0.2.2:5000/api`;
    if (Platform.OS === 'ios') return `http://${LAN_IP}:5000/api`;
  }

  return `http://${LAN_IP}:5000/api`;
};

const DEFAULT_API_URL = pickApiUrl();

let authToken = null;
let apiBaseUrl = DEFAULT_API_URL;

export const setApiBaseUrl = (url) => {
  apiBaseUrl = url || DEFAULT_API_URL;
};

export const setAuthToken = (token) => {
  authToken = token;
};

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const hasBody =
    options.body !== null &&
    options.body !== undefined &&
    typeof options.body !== 'function';

  const body = hasBody
    ? typeof options.body === 'string'
      ? options.body
      : JSON.stringify(options.body)
    : undefined;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
    body: body ?? options.body
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const api = {
  health: () => request('/health'),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  profile: () => request('/auth/profile'),
  updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: payload }),

  products: (params = {}) => {
    const search = new URLSearchParams(params);
    return request(`/products?${search.toString()}`);
  },

  product: (id) => request(`/products/${id}`),

  createOrder: (payload) => request('/orders', { method: 'POST', body: payload }),
  myOrders: () => request('/orders/my-orders')
};