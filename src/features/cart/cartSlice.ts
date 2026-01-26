import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
  restaurantId: string;
  restaurantName: string;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

function findItem(items: CartItem[], id: string, restaurantId: string) {
  return items.find((i) => i.id === id && i.restaurantId === restaurantId);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "qty">>) => {
      const existing = findItem(
        state.items,
        action.payload.id,
        action.payload.restaurantId,
      );

      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },

    increaseQty: (
      state,
      action: PayloadAction<{ id: string; restaurantId: string }>,
    ) => {
      const item = findItem(
        state.items,
        action.payload.id,
        action.payload.restaurantId,
      );
      if (item) item.qty += 1;
    },

    decreaseQty: (
      state,
      action: PayloadAction<{ id: string; restaurantId: string }>,
    ) => {
      const item = findItem(
        state.items,
        action.payload.id,
        action.payload.restaurantId,
      );
      if (!item) return;

      item.qty -= 1;

      if (item.qty <= 0) {
        state.items = state.items.filter(
          (i) =>
            !(
              i.id === action.payload.id &&
              i.restaurantId === action.payload.restaurantId
            ),
        );
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    clearCartByRestaurant: (
      state,
      action: PayloadAction<{ restaurantId: string }>,
    ) => {
      state.items = state.items.filter(
        (it) => it.restaurantId !== action.payload.restaurantId,
      );
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  clearCart,
  clearCartByRestaurant,
} = cartSlice.actions;

export default cartSlice.reducer;
