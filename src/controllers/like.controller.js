import mongoose, { isValidObjectId } from "mongoose"
import { ApiError } from "../utiles/ApiErrors.js"
import { Video } from "../models/video.model.js"
import { Like } from "../models/like.model.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import { asyncHandler } from "../utiles/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid video Id!!")
    }

   // const video = await Video.findById(videoId)

    const existingLike = await Like.findOne({
        video : videoId,
        likedBy : req.user?._id
    })

    let like;
    if(existingLike){
        like = await Like.findByIdAndDelete(existingLike._id)
    }else{
        like = await Like.create({
            likedBy : req.user?._id,
            video : videoId
        })
    }

    return res.status(200).json( new ApiResponse( 200, like,"Like in video is toggled successfully!!"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}