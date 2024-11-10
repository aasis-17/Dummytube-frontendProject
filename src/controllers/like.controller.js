import mongoose, { isValidObjectId } from "mongoose"
import { ApiError } from "../utiles/ApiErrors.js"
import { Video } from "../models/video.model.js"
import { Like } from "../models/like.model.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import { asyncHandler } from "../utiles/asyncHandler.js"
import { Comment } from "../models/comment.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid video Id!!")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video doesnot exists!!")
    }

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

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment Id!!")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400, "Comment doesnot exists or deleted!!")
    }

    const existingCommentLike = await Like.findOne({
        comment : commentId,
        likedBy : req.user?._id
    }) 

    if(existingCommentLike){
        await Like.findByIdAndDelete(existingCommentLike._id)
    }else{
        await Like.create({
            comment : commentId,
            likedBy : req.user?._id
        })
    }

    return res.status(200).json( new ApiResponse(200, {}, "Like in comment is toggled successfully !!"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet Id!!")
    }

    const tweet = await Comment.findById(tweetId)

    if(!tweet){
        throw new ApiError(400, "Tweet doesnot exists or deleted!!")
    }

    const existingTweetLike = await Like.findOne({
        tweet : tweetId,
        likedBy : req.user?._id
    }) 

    if(existingTweetLike){
        await Like.findByIdAndDelete(existingTweetLike._id)
    }else{
        await Like.create({
            tweet : tweetId,
            likedBy : req.user?._id
        })
    }

    return res.status(200).json( new ApiResponse(200, {}, "Like in tweet is toggled successfully !!"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const allLikedVideos = await Like.aggregate([
                {
            $match : {
                likedBy : new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {  
            $group : {
                _id : "$likedBy" ,
                likedVideos : {
                        $push : "$video"
                }
            }
        },


        {
            $lookup : {
                from : "videos",
                localField : "likedVideos",
                foreignField : "_id",
                as : "likedVideos"

            }
        },
       
    ])

    return res.status(200).json ( new ApiResponse(200, allLikedVideos[0]?.likedVideos, "all liked videos by user are fetched successfully!!"))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}