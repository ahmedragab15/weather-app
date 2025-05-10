import { configureStore } from "@reduxjs/toolkit";
import FetchDataReducer from "../features/fetchDataSlice";

const store = configureStore({
  reducer: {
    weatherApi: FetchDataReducer,
  },
});

export default store;
