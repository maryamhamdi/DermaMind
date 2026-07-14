import { configureStore } from "@reduxjs/toolkit";
import {
  authIntialState,
  authSliceReducer,
} from "../features/auth/store/auth.slice";
import wishlistReducer from "../features/wishlist/store/wishlist.slice";
import { useDispatch, useSelector } from "react-redux";
import { cartSliceReducer } from "../features/cart/store/cart.slice";
import { CartState } from "../features/cart/store/cart.slice";

export type preloadedStateType = {
  auth: authIntialState;
  cart: CartState;
  wishlist: {
    count: number;
  };
};

export function createStore(preloadedState: preloadedStateType) {
  const store = configureStore({
    reducer: {
      auth: authSliceReducer,
      cart: cartSliceReducer,
      wishlist: wishlistReducer,
    },
    preloadedState,
  });

  return store;
}

export type AppStore = ReturnType<typeof createStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppSelector = useSelector.withTypes<AppState>();

export const useAppDispatch = () => useDispatch<AppDispatch>();