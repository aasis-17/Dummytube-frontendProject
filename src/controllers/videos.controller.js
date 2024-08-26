import { User } from "../models/user.model.js"
import { ApiError } from "../utiles/ApiErrors.js"
import { Video } from "../models/video.model.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import { asyncHandler } from "../utiles/asyncHandler.js"
import { deleteFileOnCloudinary, uploadOnCloudinary } from "../utiles/cloudinaryOrFileupload.js"
import mongoose, { isValidObjectId } from "mongoose"





const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy= "createdAt", sortType="dec", userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    console.log(req.query)
    const filter = {}
    const sort = {}

    if(userId){
        filter.owner = mongoose.Types.ObjectId(userId)
    }

    if(query){
        filter.title = {$regex : query, $options : "i"}
    }

    if(sortBy && sortType){
       sort[sortBy] = sortType === "asc" ? 1 : -1; 
    }

    const pageNo = parseInt(page)
    const limitNo = parseInt(limit)

    const skip = (pageNo - 1) * limitNo; //NOTE : skip no of videos 

    //const allVideos = await Video.find(filter).sort(sort).skip(skip).limit(limit)
    const allVideos = await Video.aggregate([
        {
            $match : filter
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "owner",
                pipeline : [
                    {
                        $project : {
                            fullName : 1,
                            avatar : 1,
                            username : 1

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
        },
        {
            $sort : sort
        }
    ])

    //for pagination


    const totalVideosCount = await Video.countDocuments(filter)

    const pagination = {
        currentPage : pageNo,
        totalPage : Math.ceil(totalVideosCount / limitNo),
        totalVideosCount 
    }

    return res.status(200).json( new ApiResponse(200, {allVideos, pagination}, "Videos fetched successfully!!"))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if(!title && !description){
        throw new ApiError(400, "title or description missing!!")
    }

    const user = await User.findById(req.user?._id)

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const videoThumnailPath = req.files?.thumnail[0]?.path

    if(!videoLocalPath){
        throw new ApiError(404, "videoFile is reuired!!")
    }

    if(!videoThumnailPath){
        throw new ApiError(404, "Thumnail is required!!")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumNail = await uploadOnCloudinary(videoThumnailPath)
    

    const userVideo = await Video.create(
        {
            videoFile : videoFile.url,
            thumnail : thumNail.url,
            owner : user._id,
            title : title,
            description : description,
            duration : video.duration
        }
    )

    const video = await Video.findById(userVideo._id)

    if(!videoPublished){
        throw new ApiError(500, "Video has not been published!!")
    }

    return res.status(200)
    .json( new ApiResponse(200, video, "Video uploaded successfully!!"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId, loginUser } = req.params
    console.log(req.params)
    //TODO: get video by id

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "videoid invalid!!")
    }

    const video = await Video.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup :{
                from : "likes",
                localField : "_id",
                foreignField : "video",
                as : "videoLike"
            }
        },
        {
            $addFields : {
                videoLikeCount : {
                    $size : "$videoLike"
                },
                isLiked : {
                    $cond : {
                        if : { $in : [new mongoose.Types.ObjectId(loginUser), "$videoLike.likedBy"]},
                        then : true,
                        else : false
                    }
                }
            }
        }, 
        {
            $project : {
                videoFile : 1,
                thumnail : 1,
                title : 1,
                description : 1,
                owner : 1,
                duration : 1,
                videoLikeCount : 1,
                isLiked : 1

            }
        }
    ])

    if(!video) {
        throw new ApiError(400, "Video doesnot exists!!")
    }

    return res.status(200).json( new ApiResponse(200, video[0], "video sucessfully fetched!!"))


})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invaild videoId!!")
    }

    const {title, description} = req.body

    if(title?.trim() === "" && description?.trim() === ""){
        throw new ApiError(400, "title and description is required!!")
    }

    const updateThumnailLocalPath = req.files?.thumnail[0]?.path

    if(!updateThumnailLocalPath){
        throw new ApiError(400, "thumnail is missing!!")
    }

    const video = await Video.findById(videoId)

    const existingThumnailPublicId = video.thumnail.slice(60, 80) // NOTE : We need public_id of existing file in order to delete existing file on cloudinary!

    const response = await deleteFileOnCloudinary(existingThumnailPublicId)

    const updatedThumnail = await uploadOnCloudinary(thumnailLocalPath) 

    const updatedVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set : {
                title : title,
                description : description,
                thumnail : updatedThumnail.url
            }
        },{
            new : true
        }
    )


    return res.status(200).json( new ApiResponse(200, {updatedVideo, response}, "Video updated successfully!!"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId!!")
    }

   
    const deleteVideo = await Video.findByIdAndDelete(videoId)

    if(!deleteVideo){
        throw new ApiError(400, "Video doesnot exists!!")
    }

    const videoPublicId = deleteVideo.videoFile.slice(60, 80)

    const response = await deleteFileOnCloudinary(videoPublicId)
    
    console.log(videoPublicId)
    

    return res
    .status(200)
    .json( new ApiResponse(200, {deleteVideo, response}, "Video has been deleted successfully!!" ))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId!!")
    }

    const video = await Video.findById(videoId)

    console.log(video.owner, req.user._id)

    if(video.owner.equals(req.user?._id) ){  // NOTE: for comparing ObjectId we use .equals() method
        video.isPublished = true
        await video.save({ validateBeforeSave : false })
    }else{
        video.isPublished = false
        await video.save({ validateBeforeSave : false })
    }

    const updatedVideo = await Video.findById(videoId)

    return res.status(200).json( new ApiResponse(200, updatedVideo, "isPublished toggled successfully !!"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}