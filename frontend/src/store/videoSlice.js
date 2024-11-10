import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allVideos : null,
    searchTitle : "",
    
    videoDetail : {
        detail : null,
        userLikedVideo : false,
    }, 

    channelProfile : {
        userSubscribedChannel : false,
        channelOwnerProfile : null,
        channelVideos : null,
        channelLikedVideos : null
    }
   
}

const videoSlice = createSlice({
    name : "video",
    initialState,
    reducers : {

        getVideoData : (state, action) =>{
            state.allVideos = action.payload
        },

        getSearchTitle : (state, action) => {
            state.searchTitle = action.payload
        },

        setVideoDetails : (state, action) => {
           state.videoDetail = {
            ...state.videoDetail,
            ...action.payload
           }
            
        },

        setChannelProfile : (state,action) => {
            state.channelProfile =  {
                ...state.channelProfile,
                ...action.payload
            }
        }
    }
})

export const {
    getVideoData,
    getSearchTitle,
    setChannelProfile,
    setVideoDetails} = videoSlice.actions 

export default videoSlice.reducer