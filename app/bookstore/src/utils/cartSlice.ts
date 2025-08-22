import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  bookid: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.bookid === action.payload.bookid
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.items)); // ✅ persist
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.bookid !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
    const item = state.items.find((i) => i.bookid === action.payload);
    if (item) {
        item.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(state.items));
    }
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
    const item = state.items.find((i) => i.bookid === action.payload);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(state.items));
    }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
