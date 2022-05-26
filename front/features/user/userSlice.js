import { createSlice } from "@reduxjs/toolkit";
export const userAccount = createSlice({
  name: "user",
  initialState: {
    //estimateInfo: { name: "Mi Lista de Compra", items: [], totalPrice: 0, type: "week" },
    estimateInfo: {
      name: "Listado compra",
      items: [
        {
          _id: "628e739cf5d50db6aa53dd70",
          title: "Floralys Papel higiénico",
          link: "https://lolamarket.com/es/es/tienda/lidl/limpieza-y-hogar/limpieza-del-hogar/",
          price: 4.79,
          currency: "€",
          img: "https://d2ohdpvxj0yo9f.cloudfront.net/products/hi/higienico-3-capas-de-lidl0-1647679307_s.jpg",
          features: ["superMercado", "limpieza", "hogar"],
          priceHistory: [{ price: 4.79, dateTime: "2022-05-25 20:21" }],
          createdAt: "2022-05-25T18:21:00.000Z",
          updatedAt: "2022-05-25T18:21:00.000Z",
          priceDiference: 0,
          info: { addicionalInfo: "4,79 € / ud", priceDetails: "4,79 € / ud", prod_quantity: "12 rollos x 160 servicios" },
          __v: 0,
          qty: 3,
          frequency: "month",
          totalPrice: 14.370000000000001,
        },
        {
          _id: "628e739cf5d50db6aa53dd76",
          title: "Floralys Servilletas 1 capa",
          link: "https://lolamarket.com/es/es/tienda/lidl/limpieza-y-hogar/limpieza-del-hogar/",
          price: 1,
          currency: "€",
          img: "https://d2ohdpvxj0yo9f.cloudfront.net/products/se/servilletas-1-capa-de-lidl0-1647679251_s.jpg",
          features: ["superMercado", "limpieza", "hogar"],
          priceHistory: [{ price: 1, dateTime: "2022-05-25 20:21" }],
          createdAt: "2022-05-25T18:21:00.000Z",
          updatedAt: "2022-05-25T18:21:00.000Z",
          priceDiference: 0,
          info: { addicionalInfo: "1 € / ud", priceDetails: "1 € / ud", prod_quantity: "200 uds" },
          __v: 0,
          qty: 1,
          frequency: "week",
          totalPrice: 1,
        },
        {
          _id: "628e739cf5d50db6aa53dd73",
          title: "W5 Lejía con detergente",
          link: "https://lolamarket.com/es/es/tienda/lidl/limpieza-y-hogar/limpieza-del-hogar/",
          price: 1.05,
          currency: "€",
          img: "https://d2ohdpvxj0yo9f.cloudfront.net/products/le/lejia-detergente-de-lidl0-1647677046_s.jpg",
          features: ["superMercado", "limpieza", "hogar"],
          priceHistory: [{ price: 1.05, dateTime: "2022-05-25 20:21" }],
          createdAt: "2022-05-25T18:21:00.000Z",
          updatedAt: "2022-05-25T18:21:00.000Z",
          priceDiference: 0,
          info: { addicionalInfo: "1,05 € / ud, 0,53 € / L", priceDetails: "1,05 € / ud", prod_quantity: "2 l" },
          __v: 0,
          qty: 1,
          frequency: "week",
          totalPrice: 1.05,
        },
      ],
      totalPrice: 71.77,
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
