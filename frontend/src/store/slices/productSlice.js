import { createSlice } from '@reduxjs/toolkit';
const productSlice = createSlice({ name: 'products', initialState: { list: [], featured: [], loading: false, total: 0 }, reducers: {} });
export default productSlice.reducer;
