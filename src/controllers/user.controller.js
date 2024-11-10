import { asyncHandler } from "../utiles/asyncHandler.js"
import { ApiError } from "../utiles/ApiErrors.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { Playlist } from "../models/playlist.model.js"
import { Comment} from "../models/comment.model.js"
import { Like } from "../models/like.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Subscription } from "../models/subscription.model.js"
import { deleteFileOnCloudinary, uploadOnCloudinary } from "../utiles/cloudinaryOrFileupload.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose, { isValidObjectId } from "mongoose"




const generateAccessAndRefreshToken = async(userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave : false })

        return {
            accessToken, refreshToken
        }
    }catch(err){
        throw new ApiError(500, "Something went wrong while generating access or refresh token!!",err)
    }   
    
    
}

const registerUser = asyncHandler( async (req, res) => {

    //get user details from frontend
    const {fullName, email, password, username} = req.body
    console.log(req.body)
    //validate user details from frontend (no empty fields)
     if ([fullName, email, password, username].some((field) => field?.trim() === "" )){
         throw new ApiError(400, "All fields are required !!")
     }

    // //check if user already existed!
     const existedUser = await User.findOne({
         $or : [{username}, {email}]
     })

     if(existedUser){
         throw new ApiError(400, "Username or email already exist!!")
     }

    // //check for file if compulsary(we compulsary avatar)
     const avatarLocalPath = req.files?.avatar[0]?.path
     console.log(avatarLocalPath)
     

     // =checking for coverImage, if not given undefined will be returned so we need solve it. 

     let coverImageLocalPath;
     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
     }


     if(!avatarLocalPath){
         throw new ApiError(400, "Avatar file is required!!")
     }

    // //Upload on Cloudinary (files)
     const avatar = await uploadOnCloudinary(avatarLocalPath)
     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // // check if avatar is uploaded or not
     if(!avatar){
         throw new ApiError(400, "avatar file is required!!")
     } 

    // // create user object - entry in database
     const user = await User.create({
         fullName,
         username : username.toLowerCase(),
         password,
         email,
         avatar : avatar.url,
         coverImage : coverImage?.url || "",
     })

    // //check if user is created on database 
    // //.select() method by default selects all fields so, by adding fields it unselects those fields and return
     const createdUser = await User.findById(user._id).select("-password -refreshToken")

     if(!createdUser){
         throw new ApiError(500, "Something went wrong while registering user!!")
     }

     createdUser.avatarPublic_id = avatar.public_id
     createdUser.coverImagePublic_id = coverImage?.public_id || ""
     await createdUser.save({validateBeforeSave : false})

    // //return response
    return res.status(201).json(
         new ApiResponse(200, createdUser, "User registered successfully!!")
        
    )

})


//login user

const loginUser = asyncHandler(async (req, res) => {

    const {password, username, email} = req.body;
    console.log(req.body, password)

    if(!username && !email){
        throw new ApiError(400, "username and  email is required!! ")
    }

    const user = await User.findOne({
        $or : [{username},{email}]
    })

    if(!user){
        throw new ApiError(404, "user doesnot exist!!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user password !!")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const login = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
             {
                user : login, accessToken, refreshToken
            },
            "user loggedin successfully!!"
        )
    )

 })

 //logout controller

 const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id,
        {
            $unset : {
                refreshToken : 1
            }
        },
            {
                new : true
            }

    )
    const options = {
        httpOnly : true,
        secure : true
    } 

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200,{},"user loggedout successfully!!")
    )
 })

 const refreshAccessToken = asyncHandler(async(req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request!!")
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id)

    if(!user){
        throw ApiError(400, "Invalid refreshtoken!!")
    }
    //console.log(user.refreshToken)
    console.log(incomingRefreshToken)

    if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(400, "Refreshtoken expired or used!!")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200, {
            accessToken,
            refreshToken : refreshToken
        }, "AccessToken refreshed successfully!!"
    ))
 })

 const changeOldPassword = asyncHandler(async(req, res) => {

    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invaild oldpassword!!")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave : false })

    return res.status(200)
    .json( new ApiResponse(201, {}, "user password changed successfully!!"))
 })

 const updateAccountDetails = asyncHandler(async(req, res) => {

    const {fullName, email} = req.body

    if(!fullName && !email){
        throw new ApiError(400, "fullname and email both are required!!")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set : {
                fullName,
                email
            }
        },
        {
            new : true
        }
    ).select("-password")

    return res.status(200)
    .json( new ApiResponse(201,
        user, "Details updates successfully !!"
    ))

 })

 const updateAvatar = asyncHandler(async(req, res) => {

    const loginUser = await User.findById(req.user?._id)

    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file missing!!")
    }

    await deleteFileOnCloudinary(loginUser.avatarPublic_id)
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(500, "error while uploading on cloudinary!!")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set : {
                avatar : avatar.url,
                avatarPublic_id : avatar.public_id
            }
        },
        {
            new : true
        }
    ).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(201, user, "Avatar updated successfully!!"
        )
    )
})

const updateCoverImage = asyncHandler(async(req, res) => {

    const loginUser = await User.findById(req.user?._id)

    const coverImageLocalPath = req.file?.path
    console.log(req.file)

    if(!coverImageLocalPath){
        throw new ApiError(400, "CoverImage file is missing!!")
    }

    await deleteFileOnCloudinary(loginUser.coverImagePublic_id)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(500, "Error while uloading on cloudinary!!")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set : {
                coverImage : coverImage.url,
                coverImagePublic_id : coverImage.public_id
            }
        },
        {
            new : true
        }
    ).select("-password")

    return res.status(200)
    .json( new ApiResponse(201, user, "Cover image updates successfully!!"))
})

const getCurrentUser = asyncHandler(async(req, res) =>{


    return res.status(200)
    .json(new ApiResponse(201, req.user, "Current user fetched successfully!!" ))
})

//getUserChannelProfile

const getUserChannelProfile = asyncHandler(async(req, res) => {

    const {channelId} = req.params
    const {loginUser} = req.query

    let userId;
    if(!isValidObjectId(channelId)){
        throw new ApiError(404, "Invalid channelId!!")
    }

    if(loginUser){
        if(!isValidObjectId(loginUser)){
            throw new ApiError(400, "Invalid login user!!")
        }
        userId = loginUser
    }
    


    const channelProfile = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subscribers"    
            }
        },
        {
            
            $lookup : {
                from : "subscriptions",
                localField : "-id",
                foreignField : "subscriber",
                as : "subscribedTo"
            }
            
        },
        {
            $addFields : {
                subscriberCount : {
                    $size : "$subscribers"
                },
                channelSubscribedToCount : {
                    $size : "$subscribedTo"
                },
                isSubscribed : {
                    $cond : {
                        if : { $in : [new mongoose.Types.ObjectId(userId), "$subscribers.subscriber"]},
                        then : true,
                        else : false
                    }
                }
            }
        },
        {
            $project : {
                fullname : 1,
                username : 1,
                avatar : 1,
                coverImage : 1,
                subscriberCount :1,
                channelSubscribedToCount : 1,
                isSubscribed : 1
            }
        }
    ])

    console.log(channelProfile)
    if(!channelProfile?.length) {
        throw new ApiError(404, "channel doesnot exists!!")
    }

    return res.status(200)
    .json(new ApiResponse(200, channelProfile[0], "User channel successfully fetched!!"))
})

//get watch history 

const getWatchHistory = asyncHandler(async(req, res) => {

    const user = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "watchHistory",
                foreignField : "_id",
                as : "watchHistory",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "owner",
                            pipeline :[
                                {
                                   $project : {
                                        fullName : 1,
                                        username : 1,
                                        avatar : 1
                                   }
                                }
                            ]
                        }
                    },
                    {
                        $addFields : {
                            owner : {
                                $first : "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200, user[0].watchHistory,"watch history successfully fetched!!"))
})

    const deactivateAccount = asyncHandler(async (req, res) => {

        const userId = req.user?._id

        const userVideos = await Video.find({owner : userId})

        console.log(userVideos)

        const deleteFiles = async (video) => (
            await deleteFileOnCloudinary(video.videoPublic_id),
            await deleteFileOnCloudinary(video.thumnailPublic_id)
        )

        userVideos.map((video) => {
            deleteFiles(video)
            console.log("deleted files!!!")
    })
    
        
        // const deletedVideosonCloudinary = await deleteFileOnCloudinary(videoPublicIds.videoPublicId)
        // const deletedVideosThumnailonCloudinary = await deleteFileOnCloudinary(videoPublicIds.thumnailPublicId)
        // console.log(deletedVideosonCloudinary)
        // console.log(deletedVideosThumnailonCloudinary)

        // if(!deletedVideosonCloudinary || !deletedVideosThumnailonCloudinary)
        //      throw new ApiError("error while deleting videos from cloudinary!!")

        const deletedVideos = await Video.deleteMany({owner : userId });
        console.log(deletedVideos)

        const deleteComments = await Comment.deleteMany({owner : userId})

        const deletePlaylist = await Playlist.deleteMany({owner : userId})

        const deleteLikes = await Like.deleteMany({owner : userId})

        const deleteChannelSubscribedTo = await Subscription.deleteMany({subscriber : userId}) 
        const deleteChannelSubscriber = await Subscription.deleteMany({channel : userId})
        
        const deleteTweet = await Tweet.deleteMany({owner : userId})

        if(!deleteComments || !deleteLikes || !deletePlaylist || !deleteChannelSubscriber || !deleteChannelSubscribedTo || !deleteTweet)
            throw new ApiError("error while deleting documents!!")

        const user = await User.findById(userId)

         await deleteFileOnCloudinary(user.coverImagePublic_id)
         await deleteFileOnCloudinary(user.avatarPublic_id)

        const deleteUser = await User.findByIdAndDelete(userId)

        if(!deleteUser){
            throw new ApiError(400, "unable to deactivate!!")
        }

        const options = {
            httpOnly : true,
            secure : true
        } 
    

        return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json( new ApiResponse(200, "User deactivated successfully!!"))
    })

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeOldPassword, 
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory, 
    deactivateAccount
}