import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import { ApiError } from "../utiles/ApiErrors.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import { asyncHandler } from "../utiles/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id!!")
    }

    const totalSubscribers = await Subscription.countDocuments({
        channel : channelId
    })

    const totalVideos = await Video.countDocuments({
        owner : channelId
    })

    const totalLikes = await Like.aggregate([
        {
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField  : "_id",
                as : "video_owner"
            }
        },
 
        {
            $addFields: {
              video_owner: {
                $first: '$video_owner.owner'
              }
            }
          },
        {
            $match : {
                video_owner : new mongoose.Types.ObjectId(channelId)
            }
        },{
            $group : {
                _id : "$video_owner",
                totalLikes : {
                    $sum : 1
                }
            }
        }
    ])

    return res.status(200).json ( new ApiResponse(200, {totalSubscribers, totalLikes, totalVideos}, "total likes channel obtained!"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel Id!!")
    }

    const channelVideos = await Video.find({owner : channelId})

    if(!channelVideos){
        throw new ApiError(500, "channel does not exists!!")
    }

    return res.status(200).json ( new ApiResponse(200, channelVideos, "Channel videos fetched successfully!!"))
})

export {
    getChannelStats, 
    getChannelVideos
    }