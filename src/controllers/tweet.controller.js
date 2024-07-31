import { asyncHandler } from "../utiles/asyncHandler.js"
import { ApiError } from "../utiles/ApiErrors.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import mongoose from "mongoose"
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

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}