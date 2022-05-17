import { createSlice } from "@reduxjs/toolkit";
import { recalculatePriceTime } from "../../utils/shared";
export const userAccount = createSlice({
  name: "user",
  initialState: {
    default: "week",
    estimateInfo: { name: "Mi Lista de Compra", items: [], totalPrice: 0, type: "week" },
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
      state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items, state.estimateInfo.type, state.default);
    },
    deleteProduct: (state, action) => {
      const item = state.estimateInfo.items.find((prod) => prod._id === action.payload);
      if (item) {
        if (item.qty === 1) {
          const filtered = state.estimateInfo.items.filter((prod) => prod._id !== action.payload);
          state.estimateInfo.items = [...filtered];
        } else {
          state.estimateInfo.items.map((prod) => {
            if (prod._id === action.payload) prod.qty = prod.qty - 1;
            return prod;
          });
        }
        state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items, state.estimateInfo.type);
      }
    },
    removeEstimateInfo: (state) => {
      state.estimateInfo = { name: "Mi Lista de Compra", items: [], totalPrice: 0 };
    },
    removeAllTypeProducts: (state, action) => {
      const filtered = state.estimateInfo.items.filter((prod) => prod._id !== action.payload);
      state.estimateInfo.items = [...filtered];
      state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items, state.estimateInfo.type);
    },
    setEstimatePriceType: (state, action) => {
      const items = recalculateQuantities(state.estimateInfo.items, action.payload, state.estimateInfo.type);
      state.estimateInfo.items = items;
      state.estimateInfo.totalPrice = recalculatePriceTime(state.estimateInfo.totalPrice, state.estimateInfo.type, action.payload);
      state.estimateInfo.type = action.payload;
    },
  },
});

const recalculateQuantities = (items, newTime, oldTime) => {
  items.map((prod) => {
    if (newTime !== oldTime) {
      if (oldTime === "week") {
        if (newTime === "month") prod.qty = prod.qty * 4;
        if (newTime === "trimonth") prod.qty = prod.qty * 4 * 3;
        if (newTime === "year") prod.qty = prod.qty * 365;
      } else if (oldTime === "month") {
        if (newTime === "week") prod.qty = prod.qty / 4;
        else if (newTime === "trimonth") prod.qty = prod.qty * 3;
        else if (newTime === "year") prod.qty = prod.qty * 12;
      } else if (oldTime === "trimonth") {
        if (newTime === "month") prod.qty = prod.qty / 3;
        else if (newTime === "week") prod.qty = prod.qty / 3 / 4;
        else if (newTime === "year") prod.qty = (prod.qty / 3) * 12;
      } else if (oldTime === "year") {
        if (newTime === "month") prod.qty = prod.qty / 12;
        else if (newTime === "trimonth") prod.qty = (prod.qty / 12) * 3;
        else if (newTime === "week") prod.qty = prod.qty / 12 / 4;
      }
    }
  });
  return items;
};

const recalculateTotalPrice = (items, timeFrame, defTime) => {
  let price = 0;

  items.map((prod) => {
    if (prod.qty > 1) price += +prod.price * +prod.qty;
    else price += +prod.price;
  });
  if (timeFrame === defTime) return price.toFixed(2);
  if (timeFrame === "month") return (price / 4).toFixed(2);
  if (timeFrame === "triMonth") return (price * 3).toFixed(2);
  if (timeFrame === "year") return (price * 12).toFixed(2);
  return price.toFixed(2);
};

export const { setUserProducts, removeAllTypeProducts, setEstimatePriceType, importEstimate, addNewProduct, deleteProduct, removeEstimateInfo, setEstimateName } =
  userAccount.actions;

export default userAccount.reducer;
