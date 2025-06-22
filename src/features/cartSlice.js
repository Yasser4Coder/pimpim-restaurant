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
        description: action.payload.description,
        rating: action.payload.rating,
        image: action.payload.image,
        category: action.payload.category,
        count: action.payload.quantity || 1,
        totalPrice: action.payload.totalPrice || action.payload.price,
      };

      const existingItem = state.find((item) => item.id === newCart.id);

      if (existingItem) {
        existingItem.count += newCart.count;
        existingItem.totalPrice = existingItem.count * existingItem.price;
      } else {
        state.push(newCart);
      }
    },
    removeFromCart: (state, action) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
    increCount: (state, action) => {
      const item = state.find((element) => element.id === action.payload.id);
      if (item) {
        item.count = action.payload.count;
        item.totalPrice = action.payload.count * item.price;
      }
    },
    decrementCount: (state, action) => {
      const item = state.find((element) => element.id === action.payload.id);
      if (item && item.count > 1) {
        item.count -= 1;
        item.totalPrice = item.count * item.price;
      }
    },
    clearCart: (state) => {
      return [];
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  increCount,
  decrementCount,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
