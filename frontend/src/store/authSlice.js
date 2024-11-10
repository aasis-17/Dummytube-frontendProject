import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData : null,

    userVideos : null
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {

        login : (state, action) => {
            state.status = true
            state.userData = action.payload
        },

        logout : (state) => {
            state.status = false
            state.userData = null
        },

        userDeactivate : (state) => {
            state.status = false
            state.userData = null
        },

        updateUserData : (state, action) => {
            state.userData = action.payload
        },

        addVideo : (state, action) => {
            state.userVideos.push(action.payload)
        },

        deleteVideo : (state, action) => {
            state.userVideos = state.userVideos.filter((video) => video._id !== action.payload )
        },

        editVideoDetail : (state, action) => {
            state.userVideos = state.userVideos.map((video) => {
                if(video._id === action.payload.videoId){
                    return {
                        ...video,
                        ...action.payload.videoDetail
                    }
                }else{
                    return video
                }
        })
        }
    }
})

export const {userDeactivate, login, logout, addVideo, deleteVideo, editVideoDetail, updateUserData} = authSlice.actions

export default authSlice.reducer