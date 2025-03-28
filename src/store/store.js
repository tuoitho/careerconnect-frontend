import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// Import other reducers here as they are created
// import jobReducer from './slices/jobSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here
    // jobs: jobReducer,
  },
  // Middleware can be added here if needed
  // devTools integration is enabled by default in development mode
});

export default store;
