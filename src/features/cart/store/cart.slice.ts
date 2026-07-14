import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartState = {
  count: number;
};

const initialState: CartState = {
  count: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartCount: (
      state,
      action: PayloadAction<number>
    ) => {
      state.count = action.payload;
    },

    increaseCartCount: (state) => {
      state.count += 1;
    },

    decreaseCartCount: (state) => {
      if (state.count > 0) {
        state.count -= 1;
      }
    },
  },
});

export const cartSliceReducer = cartSlice.reducer;

export const {
  setCartCount,
  increaseCartCount,
  decreaseCartCount,
  
} = cartSlice.actions;