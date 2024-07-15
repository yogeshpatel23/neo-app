import { Script } from "@/types/Script";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  ceScript: Script | null;
  peScript: Script | null;
  ceScript2: Script | null;
  peScript2: Script | null;
  ceScript3: Script | null;
  peScript3: Script | null;
  ceScript4: Script | null;
  peScript4: Script | null;
  eqScript: Script | null;
} = {
  ceScript: null,
  peScript: null,
  ceScript2: null,
  peScript2: null,
  ceScript3: null,
  peScript3: null,
  ceScript4: null,
  peScript4: null,
  eqScript: null,
};

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
          if (action.payload.script.optType === "CE-CALL") {
            state.ceScript = action.payload.script;
          } else {
            state.peScript = action.payload.script;
          }
          break;
        case "2":
          if (action.payload.script.optType === "CE-CALL") {
            state.ceScript2 = action.payload.script;
          } else {
            state.peScript2 = action.payload.script;
          }
          break;
        case "3":
          if (action.payload.script.optType === "CE-CALL") {
            state.ceScript3 = action.payload.script;
          } else {
            state.peScript3 = action.payload.script;
          }
          break;
        case "4":
          if (action.payload.script.optType === "CE-CALL") {
            state.ceScript4 = action.payload.script;
          } else {
            state.peScript4 = action.payload.script;
          }
          break;
        case "EQ":
          state.eqScript = action.payload.script;
          break;

        default:
          break;
      }
    },
    updateScript: (
      state,
      action: PayloadAction<{ exchangeId: string; lp: string }>
    ) => {
      if (state.ceScript != null) {
        if (state.ceScript.exchangeId === action.payload.exchangeId) {
          state.ceScript.ltp = action.payload.lp;
        }
      }
      if (state.peScript != null) {
        if (state.peScript.exchangeId === action.payload.exchangeId) {
          state.peScript.ltp = action.payload.lp;
        }
      }
      if (state.ceScript2 != null) {
        if (state.ceScript2.exchangeId === action.payload.exchangeId) {
          state.ceScript2.ltp = action.payload.lp;
        }
      }
      if (state.peScript2 != null) {
        if (state.peScript2.exchangeId === action.payload.exchangeId) {
          state.peScript2.ltp = action.payload.lp;
        }
      }
      if (state.ceScript3 != null) {
        if (state.ceScript3.exchangeId === action.payload.exchangeId) {
          state.ceScript3.ltp = action.payload.lp;
        }
      }
      if (state.peScript3 != null) {
        if (state.peScript3.exchangeId === action.payload.exchangeId) {
          state.peScript3.ltp = action.payload.lp;
        }
      }
      if (state.ceScript4 != null) {
        if (state.ceScript4.exchangeId === action.payload.exchangeId) {
          state.ceScript4.ltp = action.payload.lp;
        }
      }
      if (state.peScript4 != null) {
        if (state.peScript4.exchangeId === action.payload.exchangeId) {
          state.peScript4.ltp = action.payload.lp;
        }
      }
      if (state.eqScript != null) {
        if (state.eqScript.exchangeId === action.payload.exchangeId) {
          state.eqScript.ltp = action.payload.lp;
        }
      }
    },
  },
});

export const { addToWatchlist, updateScript } = watchlistSlice.actions;

export default watchlistSlice.reducer;
