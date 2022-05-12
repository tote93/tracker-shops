import { createSlice } from "@reduxjs/toolkit";

export const common = createSlice({
  name: "common",
  initialState: {
    loading: false,
    featuredTags: [],
    notification: { duration: 1000 },
    estimateInfo: { totalPrice: 0, items: [] },
  },
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    deleteNotification: (state) => {
      state.notification = {};
    },
    setModalStatus: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const { setModalStatus, setUserFeaturedProducts, removeFromFeatured, setFeaturedProducts, setShops, setNotification, deleteNotification } = common.actions;

export default common.reducer;
