import { createSlice } from "@reduxjs/toolkit";
import { formatDate, recalculatePriceTime } from "../../utils/shared";
export const userAccount = createSlice({
  name: "user",
  initialState: {
    estimateInfo: {
      totalPrice: "9.36",
      items: [
        {
          _id: "6278d1037c79227316cdb0b3",
          link: "https://www.carrefour.es/supermercado/patata-lavada-carrefour-5-kg/R-525888361/p",
          __v: 0,
          createdAt: "2022-05-09T08:29:00.000Z",
          currency: "€",
          features: ["Supermercado"],
          img: "https://static.carrefour.es/hd_350x_/img_pim_food/793632_00_1.jpg",
          price: 4.99,
          priceHistory: [
            {
              price: 4.99,
              dateTime: "2022-05-09 10:29",
            },
          ],
          title: "Patata lavada Carrefour 5 Kg",
          unitPrice: 1,
          qty: 2,
          updatedAt: "2022-05-09T08:29:00.000Z",
        },
        {
          _id: "6278d1037c79227316cdb0c2",
          link: "https://www.carrefour.es/supermercado/brocoli-carrefour-500-g/R-prod1000504/p",
          __v: 0,
          createdAt: "2022-05-09T08:29:00.000Z",
          currency: "€",
          features: ["Supermercado"],
          img: "https://static.carrefour.es/hd_350x_/img_pim_food/078932_00_1.jpg",
          price: 1.19,
          priceHistory: [
            {
              price: 1.19,
              dateTime: "2022-05-09 10:29",
            },
          ],
          qty: 1,
          title: "Brócoli Carrefour 500 g",
          unitPrice: 2.38,
          updatedAt: "2022-05-09T08:29:00.000Z",
        },
        {
          _id: "6278d1037c79227316cdb0c8",
          link: "https://www.carrefour.es/supermercado/queso-rallado-cuatro-quesos-carrefour-sin-gluten-200-g/R-521030772/p",
          __v: 0,
          createdAt: "2022-05-09T08:29:00.000Z",
          currency: "€",
          features: ["Supermercado", "SIN GLUTEN"],
          img: "https://static.carrefour.es/hd_350x_/img_pim_food/712501_00_1.jpg",
          price: 1.59,
          priceHistory: [
            {
              price: 1.59,
              dateTime: "2022-05-09 10:29",
            },
          ],
          qty: 1,
          title: "Queso rallado cuatro quesos Carrefour sin gluten 200 g.",
          unitPrice: 7.95,
          updatedAt: "2022-05-09T08:29:00.000Z",
        },
      ],
      name: "Mi Listado de la compra",
      type: "month",
      date: formatDate(null, "HH:mm DD-MM-YYYY"),
    },
  },
  reducers: {
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

export const { setUserProducts, setEstimatePriceType, addNewProduct, deleteProduct, deleteAllProducts, setEstimateName } = userAccount.actions;

export default userAccount.reducer;
