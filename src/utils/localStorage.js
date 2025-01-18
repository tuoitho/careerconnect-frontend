import { LOCAL_STORAGE_KEYS } from './constants';

export const localStorageUtils = {
  setToken: (token) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
  },

  getToken: () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  },

  removeToken: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
  },

  setUser: (user) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
  },

  clearAll: () => {
    localStorage.clear();
  },
};