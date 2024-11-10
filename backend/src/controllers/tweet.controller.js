import { asyncHandler } from "../utiles/asyncHandler.js"
import { ApiError } from "../utiles/ApiErrors.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "content missing!!")
    }

    const createTweet = await Tweet.create(
        {
            content : content,
            owner : req.user?._id
        }
    )

    return res.status(200).json( new ApiResponse(200, createTweet, "tweet sucessfully created!!"))

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id!!")
    }

    const userTweet = await Tweet.find({
        owner : userId
    })

    if(!userTweet){
        throw new ApiError(400, "Tweet not found!!")
    }

    return res.status(200).json( new ApiResponse(200, userTweet, "User tweet successfully fetched!!"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {updatedContent} = req.body

    if(!updatedContent){
        throw new ApiError(400, "Content is missing!!")
    }

    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    const updateTweet = await Tweet.findByIdAndUpdate(tweetId, {
        $set : {
            content : updatedContent
        }
    },{
        new : true
    }) 

    return res.status(200).json( new ApiResponse(200, updateTweet, "Tweet updated successfully!!"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id!!")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(400, "Tweet not found!!")
    }

    return res.status(200).json( new ApiResponse(200, deletedTweet, "Tweet deleted successfully!!"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}