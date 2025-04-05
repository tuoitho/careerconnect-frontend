import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';

const CACHE_DURATION = 60 * 1000;

const shouldFetchNotifications = (lastFetchTimestamp) => {
  if (!lastFetchTimestamp) return true;
  const now = new Date().getTime();
  return now - lastFetchTimestamp > CACHE_DURATION;
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (forceRefresh = false, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { status, lastFetchTimestamp } = state.notifications;
      console.log('[fetchNotifications] Current state:', { status, lastFetchTimestamp });

      // Chỉ kiểm tra cache, không kiểm tra status === 'loading'
      if (!forceRefresh && !shouldFetchNotifications(lastFetchTimestamp)) {
        console.log('[fetchNotifications] Cache still valid, skipping fetch');
        return rejectWithValue('Cache still valid');
      }

      console.log('[fetchNotifications] Fetching notifications from API');
      const response = await apiService.get("/notifications", {
        params: { page: 0, size: 3 },
      });

      return response.result.data || [];
    } catch (error) {
      console.error('[fetchNotifications] Error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

const initialState = {
  notifications: [],
  status: 'idle',
  error: null,
  lastFetchTimestamp: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.status = 'idle';
      state.error = null;
      state.lastFetchTimestamp = null;
    },
    markNotificationAsReadLocally: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        console.log('[notificationsSlice] Fetch status: loading');
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
        state.lastFetchTimestamp = new Date().getTime();
        console.log('[notificationsSlice] Fetch succeeded');
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        if (action.payload !== 'Cache still valid') {
          state.status = 'failed';
          state.error = action.payload;
          console.log('[notificationsSlice] Fetch failed:', action.payload);
        } else {
          console.log('[notificationsSlice] Fetch skipped:', action.payload);
        }
      });
  },
});

export const { clearNotifications, markNotificationAsReadLocally } = notificationsSlice.actions;

export const selectAllNotifications = (state) => state.notifications.notifications;
export const selectNotificationsStatus = (state) => state.notifications.status;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectLastFetchTimestamp = (state) => state.notifications.lastFetchTimestamp;
export const selectUnreadNotificationsCount = (state) =>
  state.notifications.notifications.filter(n => !n.read).length;

export default notificationsSlice.reducer;