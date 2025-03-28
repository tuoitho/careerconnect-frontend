import { createSlice } from '@reduxjs/toolkit';
import { localStorageUtils } from '../../utils/localStorage';

const initialState = {
  isAuthenticated: !!localStorageUtils.getToken(),
  user: localStorageUtils.getUser() || null, // Updated to use getUser
  token: localStorageUtils.getToken() || null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
      // Note: Persisting to localStorage should ideally happen in the component or thunk
      // calling this reducer, but shown here for simplicity initially.
      // Consider moving localStorage logic outside the reducer.
    },
    loginFailed(state, action) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.status = 'failed';
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorageUtils.removeToken(); // Updated to use localStorageUtils
      localStorageUtils.removeUser(); // Updated to use removeUser
    },
    setLoading(state) {
        state.status = 'loading';
    },
    updateUser(state, action) {
        state.user = { ...state.user, ...action.payload };
        // Optionally update localStorage here if needed
    }
    // Add other reducers like registrationSuccess, registrationFailed etc. if needed
  },
  // Add extraReducers here later for handling async thunks if using createAsyncThunk
});

export const { loginSuccess, loginFailed, logout, setLoading, updateUser } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
