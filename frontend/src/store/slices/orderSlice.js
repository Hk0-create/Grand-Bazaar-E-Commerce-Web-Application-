import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders', orderData);
    toast.success('Order placed successfully!');
    return data.order;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to place order');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/my-orders');
    return data.orders;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data.order;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { list: [], current: null, loading: false },
  reducers: {
    clearCurrentOrder: (state) => { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.list.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state) => { state.loading = false; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
