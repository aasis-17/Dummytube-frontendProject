import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js"
import videoReducer from "./videoSlice.js";

const store = configureStore({
    reducer : {authReducer, videoReducer}
})

export default store;