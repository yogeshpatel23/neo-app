import { PositionBook } from "@/types/positionbook";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: PositionBook[] = [];

const positionsSlice = createSlice({
  name: "positions",
  initialState,
  reducers: {
    initPositions: (state, action) => action.payload,
    updatePositonltp: (
      state,
      action: PayloadAction<{ token: string; lp: string }>
    ) => {
      let p = state.find((pos) => pos.tok === action.payload.token);
      if (p) {
        p.lp = action.payload.lp;
      }
    },
  },
});

export const { initPositions, updatePositonltp } = positionsSlice.actions;

export default positionsSlice.reducer;
