import { createSlice } from "@reduxjs/toolkit";

export const common = createSlice({
  name: "common",
  initialState: {
    loading: false,
    categories: [],
    products: [],
    countProducts: 0,
    categoryProducts: 0,
    notification: { duration: 1000 },
  },
  reducers: {
    setCategoryProducts: (state, action) => {
      state.categoryProducts = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    deleteNotification: (state) => {
      state.notification = {};
    },
    setModalStatus: (state, action) => {
      state.loading = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setTotalProducts: (state, action) => {
      state.countProducts = action.payload;
    },
  },
});
export const { setCategoryProducts, setTotalProducts, setProducts, setCategories, setModalStatus, setNotification, deleteNotification } = common.actions;

export default common.reducer;
