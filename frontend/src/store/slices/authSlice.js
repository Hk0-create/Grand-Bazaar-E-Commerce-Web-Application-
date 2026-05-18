import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('gb_token', data.token);
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('gb_token', data.token);
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Registration failed');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const registerAdmin = createAsyncThunk('auth/registerAdmin', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register-admin', userData);
    toast.success(data.message);
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Request failed');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('gb_token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('gb_token') || null,
    loading: false,
    initialized: false,
  },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; },
    setToken: (state, action) => { state.token = action.payload; },
    clearAuth: (state) => { state.user = null; state.token = null; localStorage.removeItem('gb_token'); },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state) => { state.loading = false; })
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state) => { state.loading = false; })
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false; state.initialized = true; state.token = null; localStorage.removeItem('gb_token');
      })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.token = null; });
  },
});

export const { setUser, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
