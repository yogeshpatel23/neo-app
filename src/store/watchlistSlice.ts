import { Script } from "@/types/Script";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Script[][] = [[], [], []];

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWatchlist: (
      state,
      action: PayloadAction<{ script: Script; tabId: string }>
    ) => {
      switch (action.payload.tabId) {
        case "1":
          state[0].push(action.payload.script);
          break;
        case "2":
          state[1].push(action.payload.script);
          break;
        case "3":
          state[2].push(action.payload.script);
          break;
        default:
          break;
      }
    },
    updateScript: (
      state,
      action: PayloadAction<{ exchangeId: string; lp: string }>
    ) => {
      state.forEach((wl) => {
        wl.forEach((script) => {
          if (script.exchangeId === action.payload.exchangeId) {
            script.ltp = action.payload.lp;
          }
        });
      });
    },
    removeScript: (
      state,
      action: PayloadAction<{ exchangeId: string; tabid: string }>
    ) => {
      switch (action.payload.tabid) {
        case "1":
          state[0] = state[0].filter(
            (sy) => sy.exchangeId !== action.payload.exchangeId
          );
          break;
        case "2":
          state[1] = state[1].filter(
            (sy) => sy.exchangeId !== action.payload.exchangeId
          );
          break;
        case "3":
          state[2] = state[2].filter(
            (sy) => sy.exchangeId !== action.payload.exchangeId
          );
          break;
        default:
          break;
      }
    },
  },
});

export const { addToWatchlist, updateScript, removeScript } =
  watchlistSlice.actions;

export default watchlistSlice.reducer;
