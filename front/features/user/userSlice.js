import { createSlice } from "@reduxjs/toolkit";
export const userAccount = createSlice({
  name: "user",
  initialState: {
    //estimateInfo: { name: "Mi Lista de Compra", items: [], totalPrice: 0, type: "week" },
    estimateInfo: {
      name: "Mi Lista de Compra",
      items: [
        {
          _id: "6283b14cd7a26d49e20ba0e0",
          link: "https://www.carrefour.es/supermercado/cerveza-mahou-5-estrellas-especial-pack-de-28-latas-de-33-cl/R-520661305/p",
          createdAt: "2022-05-09T08:56:00.000Z",
          currency: "€",
          features: ["Bebidas"],
          img: "https://static.carrefour.es/hd_350x_/img_pim_food/718560_00_1.jpg",
          price: 13.8,
          priceHistory: [
            {
              price: 17.75,
              dateTime: "2022-05-09 10:56",
            },
            {
              price: 17.75,
              dateTime: "2022-05-15 12:08",
            },
            {
              price: 13.8,
              dateTime: "2022-05-18 16:30",
            },
          ],
          title: "Cerveza Mahou 5 Estrellas especial pack de 28 latas de 33 cl.",
          unitPrice: 1.92,
          updatedAt: "2022-05-18T14:30:00.000Z",
          priceDiference: 3.95,
          qty: 2,
          frequency: "month",
          totalPrice: 27.6,
        },
        {
          _id: "6283b14cd7a26d49e20ba0e0",
          link: "https://www.carrefour.es/supermercado/cerveza-mahou-5-estrellas-especial-pack-de-28-latas-de-33-cl/R-520661305/p",
          createdAt: "2022-05-09T08:56:00.000Z",
          currency: "€",
          features: ["Bebidas"],
          img: "https://static.carrefour.es/hd_350x_/img_pim_food/718560_00_1.jpg",
          price: 13.8,
          priceHistory: [
            {
              price: 17.75,
              dateTime: "2022-05-09 10:56",
            },
            {
              price: 17.75,
              dateTime: "2022-05-15 12:08",
            },
            {
              price: 13.8,
              dateTime: "2022-05-18 16:30",
            },
          ],
          title: "Cerveza Mahou 5 Estrellas especial pack de 28 latas de 33 cl.",
          unitPrice: 1.92,
          updatedAt: "2022-05-18T14:30:00.000Z",
          priceDiference: 3.95,
          qty: 2,
          frequency: "week",
          totalPrice: 27.6,
        },
      ],
      totalPrice: 55.2,
      type: "week",
    },
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
      state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items);
    },
    addNewProduct: (state, action) => {
      const found = state.estimateInfo.items.findIndex((e) => e._id === action.payload._id && e.frequency === action.payload.frequency);
      if (found !== -1) {
        let newItems = state.estimateInfo.items;
        newItems[found].qty = newItems[found].qty + 1;
        newItems[found].totalPrice = newItems[found].price * newItems[found].qty;
        state.estimateInfo.items = [...newItems];
      } else state.estimateInfo.items = [...state.estimateInfo.items, action.payload];
      state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items);
    },
    deleteProduct: (state, action) => {
      const item = state.estimateInfo.items.find((prod) => prod._id === action.payload._id && prod.frequency === action.payload.frequency);
      if (item) {
        if (item.qty === 1) {
          const filtered = [];
          state.estimateInfo.items.forEach((prod) => {
            if (prod._id !== action.payload._id) filtered.push(prod);
            else if (prod._id == action.payload._id && prod.frequency !== action.payload.frequency) filtered.push(prod);
          });

          state.estimateInfo.items = [...filtered];
        } else {
          console.log("---", JSON.parse(JSON.stringify(state.estimateInfo.items)));
          const filtered = [];
          state.estimateInfo.items.forEach((prod) => {
            if (prod._id !== action.payload._id) filtered.push(prod);
            else if (prod._id === action.payload._id && prod.frequency !== action.payload.frequency) filtered.push(prod);
            else if (prod._id === action.payload._id && prod.frequency === action.payload.frequency) {
              let product = prod;
              product.qty = product.qty - 1;
              filtered.push(product);
            }
          });
          console.log("filtered", JSON.parse(JSON.stringify(filtered)));
          state.estimateInfo.items = [...filtered];
        }
        state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items);
      }
    },
    removeEstimateInfo: (state) => {
      state.estimateInfo = { name: "Mi Lista de Compra", items: [], totalPrice: 0, type: "week" };
    },
    removeAllTypeProducts: (state, action) => {
      if (action.payload.frequency) {
        const filtered = [];
        state.estimateInfo.items.forEach((prod) => {
          if (prod._id !== action.payload._id) filtered.push(prod);
          else if (prod.frequency !== action.payload.frequency) filtered.push(prod);
        });
        state.estimateInfo.items = [...filtered];
      } else {
        const filtered = state.estimateInfo.items.filter((prod) => prod._id !== action.payload._id);
        state.estimateInfo.items = [...filtered];
      }
      state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items);
    },
    setEstimatePriceType: (state, action) => {
      state.estimateInfo.items = state.estimateInfo.items;
      state.estimateInfo.totalPrice = recalculateTotalPrice(state.estimateInfo.items);
      state.estimateInfo.type = action.payload;
    },
  },
});

const recalculateTotalPrice = (items) => {
  let price = 0;

  items.map((prod) => {
    price += prod.totalPrice;
  });
  /*    */
  return +price.toFixed(2);
};

export const { setUserProducts, removeAllTypeProducts, setEstimatePriceType, importEstimate, addNewProduct, deleteProduct, removeEstimateInfo, setEstimateName } =
  userAccount.actions;

export default userAccount.reducer;
