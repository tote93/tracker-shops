import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "../features/common/common";
import userReducer from "../features/user/userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    common: commonReducer,
  },
});
