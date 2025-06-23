import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    visible: false,
    mode: "create", // "create", "edit", "delete"
  },
  reducers: {
    showToast: (state, action) => {
      state.visible = true;
      state.mode = action.payload;
    },
    hideToast: (state) => {
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;