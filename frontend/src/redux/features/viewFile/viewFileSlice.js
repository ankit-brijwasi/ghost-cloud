import { createSlice } from "@reduxjs/toolkit";

export const viewFileSlice = createSlice({
  name: "viewFile",
  initialState: {
    open: false,
    error: null,
    data: {},
  },
  reducers: {
    open: (state, action) => {
      state.open = true;
      state.data = action.payload;
    },
    close: (state) => {
      state.open = false;
      state.data = {};
    },
    error: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { open, close } = viewFileSlice.actions;
export default viewFileSlice.reducer;
