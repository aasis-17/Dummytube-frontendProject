import { ApiError } from "../utiles/ApiErrors.js"
import { ApiResponse} from "../utiles/ApiResponse.js"
import { asyncHandler} from "../utiles/asyncHandler.js"
import { Playlist } from "../models/playlist.model.js"
import mongoose, { isValidObjectId } from "mongoose"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist

    if(!name){
        throw new ApiError(400, "Name is missing!!")
    }

    const playlist = await Playlist.create({
        name : name,
        description,
        owner : req.user?._id
    })

    if(!playlist){
        throw new ApiError(500,"Problem while creating playlist!!")
    }

    return res.status(200).json( new ApiResponse(200, playlist, "Playlist successfully created!!"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid userId!!")
    }

    const userPlaylists = await Playlist.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "videos",
                foreignField: "_id",
                as :"videos"
            }
        }
    ])

    if(!userPlaylists ){
        throw new ApiError(500, "error while fetching playlist!!")
    }

    return res.status(200).json( new ApiResponse(200, userPlaylists, "User playlist successfully fetched!!"))

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist Id!!")
    }

    const playlist = await Playlist.aggregate([{

        $match : {
            _id : new mongoose.Types.ObjectId(playlistId)
        }
    },
    {
        $lookup : {
            from : "videos",
            localField : "videos",
            foreignField : "_id",
            as : "videos"
        }   
    }])

    if(!playlist){
        throw new ApiError(400, "playlist does not exists!!")
    }

    return res.status(200).json( new ApiResponse(200, playlist, "playlist successfully fetched!!"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if(!isValidObjectId(playlistId) && !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist and video id!!!")
    }


    const playlist = await Playlist.findOneAndUpdate({_id: playlistId, owner : req.user?._id },{

        $push : {
             videos : videoId
            }
    }, {
        new : true
    })

    if(!playlist) {
        throw new ApiError(500, "Error while adding video to playlist!!")
    }

    return res.status(200).json( new ApiResponse(200, playlist, "Video added to playlist successfully!!"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(playlistId) && !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist or video Id!!")
    }

    const removedPlaylistVideo = await Playlist.findOneAndUpdate({_id : playlistId, owner : req.user?._id}, {
        $pull : {
            videos : videoId
        }
    },
    {
            new : true
    })  

    if (!removedPlaylistVideo){
        throw new ApiError(500, "error while removing video !!")
    }

    return res.status(200).json( new ApiResponse(200, removedPlaylistVideo, "Video successfully removed from playlist!!"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist Id!!")
    }

    const deletedPlaylist = await Playlist.findOneAndDelete({_id : playlistId, owner : req.user?._id})

    if(!deletePlaylist){
        throw new ApiError(500, "playlist doesnot exists!!")
    }

    return res.status(200).json( new ApiResponse(200, deletedPlaylist, "playlist successfully deleted!!"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id!!")
    }

    if(!name && !description){
        throw new ApiError(400, "name or description is missing!!")
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate({_id : playlistId, owner : req.user?._id }, 
        {
            $set : {
                name,
                description
            }
        },{
            new : true
        }
    )

    if(!updatedPlaylist){
        throw new ApiError(500, "playlsit does not exists!!")
    }

    return res.status(200).json ( new ApiResponse(200, updatedPlaylist, "playlist successfully updated!!")
    )
})



export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}