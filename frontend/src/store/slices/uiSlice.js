import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { mobileMenuOpen: false, cartOpen: false, searchOpen: false },
  reducers: {
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false; },
    toggleCart: (state) => { state.cartOpen = !state.cartOpen; },
    closeCart: (state) => { state.cartOpen = false; },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    closeSearch: (state) => { state.searchOpen = false; },
  },
});

export const { toggleMobileMenu, closeMobileMenu, toggleCart, closeCart, toggleSearch, closeSearch } = uiSlice.actions;
export default uiSlice.reducer;
