import { createSlice } from "@reduxjs/toolkit";
import { formatDate, recalculatePriceTime } from "../../utils/shared";
export const userAccount = createSlice({
  name: "user",
  initialState: {
    estimateInfo: { name: "Mi Lista de Compra", items: [] },
  },
  reducers: {
    importEstimate: (state, action) => {
      state.estimateInfo = action.payload;
    },
    setEstimateName: (state, action) => {
      state.estimateInfo.name = action.payload;
    },
    setUserProducts: (state, action) => {
      state.estimateInfo.items = [...action.payload];
      state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items, state.estimateInfo.type);
    },
    addNewProduct: (state, action) => {
      const found = state.estimateInfo.items.findIndex((e) => e._id === action.payload._id);
      if (found !== -1) {
        let newItems = state.estimateInfo.items;
        newItems[found].qty = newItems[found].qty + 1;
        state.estimateInfo.items = [...newItems];
      } else state.estimateInfo.items = [...state.estimateInfo.items, action.payload];
      state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items, state.estimateInfo.type);
    },
    deleteProduct: (state, action) => {
      const filtered = state.estimateInfo.items.filter((prod) => prod._id !== action.payload);
      state.estimateInfo.items = [...filtered];
      state.estimateInfo.totalPrice = recalculateTotalPrice(filtered, state.estimateInfo.type);
    },
    deleteAllProducts: (state) => {
      state.estimateInfo.items = [];
      state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items, state.estimateInfo.type);
    },
    setEstimatePriceType: (state, action) => {
      state.estimateInfo.totalPrice = recalculatePriceTime(state.estimateInfo.totalPrice, state.estimateInfo.type, action.payload);
      state.estimateInfo.type = action.payload;
    },
  },
});

const recalculateTotalPrice = (items, timeFrame) => {
  let price = 0;
  items.map((prod) => {
    if (prod.qty > 1) price += +prod.price * +prod.qty;
    else price += +prod.price;
  });
  if (timeFrame === "week") return (price / 4).toFixed(2);
  if (timeFrame === "triMonth") return (price * 3).toFixed(2);
  if (timeFrame === "year") return (price * 12).toFixed(2);
  return price.toFixed(2);
};

export const { setUserProducts, setEstimatePriceType, importEstimate, addNewProduct, deleteProduct, deleteAllProducts, setEstimateName } = userAccount.actions;

export default userAccount.reducer;
