import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./BlogSlice";
import toastReducer from "./ToastSlices";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    toast: toastReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
