import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { LocalStorage } from '../../local/LocalStorage';

const lanIpFromExpo = (): string | null => {
  const extraHost = Constants.expoConfig?.extra?.apiHost;
  if (typeof extraHost === 'string' && extraHost.trim() !== '') {
    return extraHost.trim();
  }

  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.linkingUri,
  ];

  for (const value of candidates) {
    const match = String(value ?? '').match(/(\d{1,3}(?:\.\d{1,3}){3})/);
    if (match) {
      return match[1];
    }
  }
  return null;
};

const HOST =
  Platform.OS === 'web'
    ? '127.0.0.1'
    : lanIpFromExpo() ?? (Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1');

export const API_BASE_URL = `http://${HOST}:4000/api`;

const ApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

ApiClient.interceptors.request.use(async (config) => {
  const { getItem } = LocalStorage();
  const raw = await getItem('user');
  if (raw) {
    const stored = JSON.parse(raw);
    if (stored?.session_token) {
      config.headers.Authorization = `Bearer ${stored.session_token}`;
    }
  }
  return config;
});

export { ApiClient };
