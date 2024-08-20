import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  //cart
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const newCart = {
        id: action.payload.id,
        name: action.payload.name,
        price: action.payload.price,
        favorite: action.payload.favorite,
        descreption: action.payload.descreption,
        stars: action.payload.stars,
        imageUrl: action.payload.imageUrl,
        count: 1,
        totalPrice: action.payload.price,
      };
      let found = false;

      state.forEach((element) => {
        if (element.id === newCart.id) {
          element.count += 1;
          element.totalPrice += element.price;
          found = true;
        }
      });

      if (!found) {
        state.push(newCart);
      }
    },
    removeFromCart: (state, action) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
    increCount: (state, action) => {
      return state.forEach((element) => {
        if (element.id === action.payload.id) {
          element.count = action.payload.count;
          element.totalPrice = action.payload.count * element.price;
        }
      });
    },
  },
});
export const { addToCart, removeFromCart, increCount } = cartSlice.actions;
export default cartSlice.reducer;
