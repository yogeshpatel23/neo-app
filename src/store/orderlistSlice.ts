import { OrderBook } from "@/types/orderbook";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: OrderBook[] = [];

const orderlistSlice = createSlice({
  name: "orderlist",
  initialState,
  reducers: {
    initOrderlist: (state, action: PayloadAction<OrderBook[]>) => {
      state = action.payload;
      return state;
    },
    updateOrderltp: (
      state,
      action: PayloadAction<{ token: string; lp: string }>
    ) => {
      state.map((order) => {
        if (order.tok === action.payload.token) {
          order.ltp = action.payload.lp;
        }
        return order;
      });
    },
    removeOrdrer: (state, action: PayloadAction<string>) =>
      state.filter((order) => order.nOrdNo !== action.payload),
  },
});

export const { initOrderlist, updateOrderltp, removeOrdrer } =
  orderlistSlice.actions;

export default orderlistSlice.reducer;
