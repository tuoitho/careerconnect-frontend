import { createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/authService.js';
import { toast } from 'react-toastify';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { setLoading, setUser, setError, clearError } = authSlice.actions;

// Thunk actions
export const login = (userData, tk) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authService.login(userData.username, userData.password, tk);
    dispatch(setUser(response.user));
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('authToken', response.accessToken);
    toast.success('Login successful');
    return response;
  } catch (error) {
    dispatch(setError(error.message));
    toast.error(error.message);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authService.logout();
    dispatch(setUser(null));
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    toast.success(response.message);
  } catch (error) {
    toast.error(error.response?.message || 'Logout failed');
  } finally {
    dispatch(setLoading(false));
  }
};

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;
