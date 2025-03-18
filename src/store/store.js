import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // ✅ Ensure this import is correct

const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ The key "auth" should match what you use in `useSelector`
  },
});

export default store;
