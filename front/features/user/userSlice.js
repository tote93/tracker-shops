import { createSlice } from "@reduxjs/toolkit";

export const userAccount = createSlice({
  name: "user",
  initialState: {
    estimateInfo: {
      totalPrice: 0,
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
          updatedAt: "2022-05-09T08:29:00.000Z",
        },
      ],
      name: "Mi Lista de la compra",
      type: "month",
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
      state.estimateInfo.items = [...state.estimateInfo.items, action.payload];
      console.log(state.estimateInfo.items);
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
  items.map((i) => {
    price += +i.price;
  });
  if (timeFrame === "triMonth") return (price * 3).toFixed(2);
  if (timeFrame === "year") return (price * 12).toFixed(2);
  return price.toFixed(2);
};

const recalculatePriceTime = (price, oldTime, newTime) => {
  if (oldTime === "month") {
    if (newTime === "triMonth") return price * 3;
    else if (newTime === "year") return price * 12;
  } else if (oldTime === "triMonth") {
    if (newTime === "month") return price / 3;
    else if (newTime === "year") return (price / 3) * 12;
  } else if (oldTime === "year") {
    if (newTime === "month") return price / 12;
    else if (newTime === "triMonth") return (price / 12) * 3;
  }
};

export const { setUserProducts, setEstimatePriceType, addNewProduct, deleteProduct, deleteAllProducts, setEstimateName } = userAccount.actions;

export default userAccount.reducer;
