import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js"
import videoReducer from "./videoSlice.js";
import playlistReducer from "./playlistSlice.js"

const store = configureStore({
    reducer : {authReducer, videoReducer, playlistReducer}
})

export default store;