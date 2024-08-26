import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data : null
}

const videoSlice = createSlice({
    name : "video",
    initialState,
    reducers : {
        getVideoData : (state, action) =>{
            state.data = action.payload
        }
    }
})

export const {getVideoData} = videoSlice.actions 
export default videoSlice.reducer