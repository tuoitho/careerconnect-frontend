import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { localStorageUtils } from '../../utils/localStorage';
import { authService } from '../../services/authService.js'; // Assuming this path is correct
import { toast } from 'react-toastify'; // Assuming react-toastify

// Define the async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // No need for setLoading(true) here, handled by .pending
      const response = await authService.logout();
      toast.success(response.message || 'Logged out successfully!'); // Use response message or default
      // Clear local storage here after successful API call
      localStorageUtils.removeToken();
      localStorageUtils.removeUser();
      // No need to return data, state updates handled in extraReducers
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Logout failed';
      localStorageUtils.removeToken();
      localStorageUtils.removeUser();
      // toast.error(message);
      // Even on failure, potentially clear local storage depending on desired behavior
      // localStorageUtils.removeToken();
      // localStorageUtils.removeUser();
      return rejectWithValue(message); // Pass error message to rejected action
    }
    // No need for finally setLoading(false), handled by .fulfilled/.rejected
  }
);

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
      // This synchronous reducer is removed, logic moved to extraReducers
    },
    // setLoading(state) { // This can be handled by the thunk's pending state
    //     state.status = 'loading';
    // },
    updateUser(state, action) {
        state.user = { ...state.user, ...action.payload };
        // Optionally update localStorage here if needed
    },
    // Add other reducers like registrationSuccess, registrationFailed etc. if needed
    setLoading(state) {
      state.status = 'loading';
      state.error = null; // Clear previous errors on new attempt},
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear previous errors on new attempt
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.status = 'idle'; // Reset status after success
        state.error = null;
        // localStorage is cleared within the thunk itself upon success
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Store the error message from rejectWithValue
        // Decide if you want to clear auth state even on failed logout API call
        // state.isAuthenticated = false;
        // state.user = null;
        // state.token = null;
      })

    // Add other extraReducers for login/register thunks if needed

  },
});

// Export the thunk if needed elsewhere, but primarily used via dispatch
// export { logoutUser };

// Update exported actions - remove old logout, keep others
export const { loginSuccess, loginFailed, setLoading, updateUser } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
