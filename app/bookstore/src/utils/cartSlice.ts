import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  bookid: number;
  title: string;
  price: number;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [], 
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i.bookid === action.payload.bookid);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.bookid !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.bookid === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.bookid === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
  },
});

export const { setCart, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
