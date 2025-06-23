// store/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface UIState {
  mode: "create" | "edit";
  toastMode: "create" | "edit" | "delete";
  showCreate: "side" | null;
  showSuccess: boolean;
  visible: boolean;
}

const initialState: UIState = {
  mode: "create",
  toastMode: "create",
  showCreate: null,
  showSuccess: false,
  visible: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<"create" | "edit">) => {
      state.mode = action.payload;
    },
    setToastMode: (state, action: PayloadAction<"create" | "edit" | "delete">) => {
      state.toastMode = action.payload;
    },
    setShowCreate: (state, action: PayloadAction<"side" | null>) => {
      state.showCreate = action.payload;
    },
    setShowSuccess: (state, action: PayloadAction<boolean>) => {
      state.showSuccess = action.payload;
    },
    setVisible: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
  },
});

export const {
  setMode,
  setToastMode,
  setShowCreate,
  setShowSuccess,
  setVisible,
} = uiSlice.actions;

export default uiSlice.reducer;
