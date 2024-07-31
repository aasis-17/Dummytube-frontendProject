import { asyncHandler } from "../utiles/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utiles/ApiErrors.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import { isValidObjectId } from "mongoose"
import mongoose from "mongoose"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user?._id

     // TODO: toggle subscription
     if (!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id!!")
     }
    const channelUser = await User.findById(channelId)

    if(!channelUser){
        throw new ApiError(500, "channel not found !!")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber : userId,
        channel : channelId
    } 
    )
    let updated ;
    if(existingSubscription){
        updated = await Subscription.findByIdAndDelete(existingSubscription._id)
    //    updated = await Subscription.findByIdAndUpdate(subscriptions._id, {
    //         $set : {
    //             $pull : {subscriber : userId }
    //         }
    //     },{
    //         new : true
    //     })
    console.log("subscribe")
    }else{
      updated =  await Subscription.create({
            subscriber : userId,
            channel : channelId
        })
        console.log("subscribed")
    }
    

    // if(!channelUser){
    //     throw new ApiError(400, "Invalid channel!!")
    // }


    // if(channelUser.subscribers.includes(userId)){
    //     await Subscription.findByIdAndUpdate(channelId,
    //          {
    //         $set :{
    //              subscriber :{
    //                  $cond : {
    //                     if : {$in : [userId, "$subscribers.subscriber"] },
    //                      then :{ $pull : {$subscriber : userId}},
    //                      else : { $push: { $subscriber: userId }}
    //                  }
    //             }
    //           }
    //   },
    //     {
    //         new : true
    //     }
    // )

    return res.status(200)
    .json(new ApiResponse(200,updated, "Subscription button toggled Successfully !!" ))
})
// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400, "ChannelId missing!!")
    }

    const channelUser = await User.findById(channelId)

    if(!channelUser){
        throw new ApiError(400, "channel not Exists!!!")
    }


    // const channelSubscriber = await Subscription.find({
    //     channel : channelId
    // })
    // console.log(channelSubscriber)

    const subscriberList = await Subscription.aggregate([
        {
            $match : {
                channel : new mongoose.Types.ObjectId(channelId) //NOTE : here we search for subscription document in db, where channel is same. 
            }
    },
    {
        $lookup :{
            from : "users",
            localField : "subscriber", //NOTE : We use subscriber field in localField to retrive subscriber user from searched documents(subscription), 
            foreignField : "_id",       //so we get subscriber data in subscibers_details
            as : "subscribers_details",
            pipeline : [
                {
                    $project : {
                        username : 1,
                        fullName : 1,
                        email : 1,
                        avatar : 1
                    }
                }
            ]
        }
    },
    {
        $addFields : {
            subscribers_details : {
                $first : "$subscribers_details"
            }
        }
    },
    {
        $project : {
            channel :1 ,
            subscriber :1 ,
            subscribers_details : 1
        }
    }
])

    return res.status(200)
              .json(
                 new ApiResponse(200,
                 subscriberList,
                 `subscribers successfully fetched!! subscriber ${subscriberList.length}`))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    
    //const user = await User.findById(req.user?._id)
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "SubscriberId missing!!")
    }

    const subscriberUser = await User.findById(subscriberId)

    if(!subscriberUser){
        throw new ApiError(400, "subscriber doesnot Exists!!")
    }

    // const channelSubscribed = await Subscription.find({
    //     subscriber : subscriberId
    // })

    const channelSubscribedList = await Subscription.aggregate([
        {
            $match :{
                subscriber : new mongoose.Types.ObjectId(subscriberId) //NOTE : Here we are searching subscription document in db that has subscriber field common i.e(subscriberId)
                                                                        // in all documents.This is how we no. of subscription documents that have same subscriber field 
                                                                        //with different channel in channel field in each document and this is how we get no of channel that user has subscribed! 
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "channel",  //NOTE : Here we are selecting channel field as localField because we need channel details 
                                        //that  user has subscribedto, from searched documents.
                                        
                foreignField : "_id",
                as : "channelSubscribedTo_details",
                pipeline : [
                    {
                        $project : {
                            username : 1,
                            fullName : 1,
                            email : 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                channelSubscribedTo_details : {
                    $first : "$channelSubscribedTo_details"
                }
            }
        }
])

    return res.status(200)
    .json(new ApiResponse(200, channelSubscribedList, `Channel user subscribed successfully fetched!! channel${channelSubscribedList.length}`))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}