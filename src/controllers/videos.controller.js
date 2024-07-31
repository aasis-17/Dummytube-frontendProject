import { User } from "../models/user.model.js"
import { ApiError } from "../utiles/ApiErrors.js"
import { Video } from "../models/video.model.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import { asyncHandler } from "../utiles/asyncHandler.js"
import { deleteFileOnCloudinary, uploadOnCloudinary } from "../utiles/cloudinaryOrFileupload.js"
import { isValidObjectId } from "mongoose"





const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const filter = {}
    const sort = {}

    if(userId){
        filter.owner = userId
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

    const allVideos = await Video.find(filter).sort(sort).skip(skip).limit(limit)

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
    const { videoId } = req.params
    //TODO: get video by id

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "videoid invalid!!")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(400, "Video doesnot exists!!")
    }

    return res.status(200).json( new ApiResponse(200, video, "video sucessfully fetched!!"))


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

    if(video.owner.equals(req.user?._id) ){  // NOTE: comparind ObjectId we cau use .equals() method
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