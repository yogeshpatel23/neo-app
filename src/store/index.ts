import { configureStore } from "@reduxjs/toolkit";
import WatchlistReducer from "@/store/watchlistSlice";
import OrderlistReducer from "@/store/orderlistSlice";
import PositionsReducer from "@/store/positionsSlice";

export const store = configureStore({
  reducer: {
    watchlist: WatchlistReducer,
    orderlist: OrderlistReducer,
    positions: PositionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
