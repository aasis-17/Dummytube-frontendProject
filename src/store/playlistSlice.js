import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    channelPlaylist : [],

}

const playlistSlice = createSlice({
    name : "playlist",
    initialState,
    reducers : {
        setChannelPlaylist : (state, action) => {
            state.channelPlaylist = action.payload
        },

        addPlaylist : (state, action) => {
            state.channelPlaylist.push(action.payload)
        },

        deletePlaylist : (state, action) => {
            state.channelPlaylist = state.channelPlaylist.filter((item) => (
                item._id !== action.payload
            ))
        },

        removeVideoFromPlaylist : (state, action) => {
            console.log(action)
            state.channelPlaylist = state.channelPlaylist.map((playlist) => (
                playlist._id === action.payload.playlistId ? { ...playlist, videos : playlist.videos.filter((video) => video._id !== action.payload.videoId)}
            : {...playlist}))
        }
    }
})

export const {setChannelPlaylist, addPlaylist, deletePlaylist, removeVideoFromPlaylist} = playlistSlice.actions

export default playlistSlice.reducer