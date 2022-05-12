import { createSlice } from "@reduxjs/toolkit";

export const userAccount = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    userProducts: [],
    notifiedProducts: [],
  },
  reducers: {
    addUserInfo: (state, action) => {
      state.userInfo = action.payload;
      let currentState = {};
      action.payload.availableShops.forEach((shop) => {
        if (currentState && currentState.hasOwnProperty(shop)) currentState[shop] = currentState[shop];
        else if (currentState && !currentState.hasOwnProperty(shop)) currentState[shop] = {};
        else currentState = { [shop]: {} };
      });
      action.payload && localStorage.setItem("login_info", JSON.stringify(action.payload));
    },
    setUserProducts: (state, action) => {
      state.userProducts = action.payload.filter((p) => !p.notified);
    },
    setUserNotifiedProducts: (state, action) => {
      state.notifiedProducts = action.payload;
    },
    addUserNotifiedProducts: (state, action) => {
      state.notifiedProducts = [...state.notifiedProducts, action.payload];
    },
    addNewProduct: (state, action) => {
      state.userProducts = [...state.userProducts, action.payload];
    },
    deleteProduct: (state, action) => {
      const filtered = state.userProducts.filter((prod) => prod._id !== action.payload);
      state.userProducts = [...filtered];
    },
    updateProduct: (state, action) => {
      const filtered = state.userProducts.filter((prod) => prod._id !== action.payload._id);
      if (action.payload.notified) {
        state.userProducts = [...filtered];
        state.notifiedProducts = [...state.notifiedProducts, action.payload];
      } else state.userProducts = [...filtered, action.payload];
    },
    deleteAllProducts: (state) => {
      state.userProducts = [];
    },
    deleteAllNotified: (state) => {
      state.notifiedProducts = [];
    },
  },
});

export const { addUserNotifiedProducts, updateProduct, setUserNotifiedProducts, deleteAllNotified, addUserInfo, setUserProducts, addNewProduct, deleteProduct, deleteAllProducts } =
  userAccount.actions;

export default userAccount.reducer;
