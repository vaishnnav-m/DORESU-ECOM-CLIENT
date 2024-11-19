import { configureStore } from "@reduxjs/toolkit";
import api  from "../services/api";
import adminApi from "../services/adminApi";
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    auth:authReducer,
    [api.reducerPath]: api.reducer,
    [adminApi.reducerPath]:adminApi.reducer,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(api.middleware).concat(adminApi.middleware),
});

