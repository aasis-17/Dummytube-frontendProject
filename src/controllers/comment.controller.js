import { isValidObjectId } from "mongoose"
import { ApiError } from "../utiles/ApiErrors.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import { asyncHandler } from "../utiles/asyncHandler.js"
import { Comment } from "../models/comment.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid VideoId !!")
    }

    const pageNo = parseInt(page)
    const limitNo = parseInt(limit)

    const skip = (pageNo - 1) * limitNo

    const videoComments = await Comment.find( {video : videoId}).skip(skip).sort("-createdAt")

    const totalCommentCount = await Comment.countDocuments({ video : videoId})

    const pagination = {
        currentPage : pageNo,
        totalPage : Math.ceil(totalCommentCount / limitNo),
        totalCommentCount 
    }

    return res.status(200).json( new ApiResponse(200,{pagination,videoComments },  "Video comments fetched successfully!!"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(400, "Unauthorized access!!")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id!!")
    }

    if(!content){
        throw new ApiError(400, "Comment is missing!!")
    }

    const comment = await Comment.create({
        content,
        video : videoId,
        owner : userId
    })

    return res.status(200).json( new ApiResponse(200, comment, "comment added to video successfully!!"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment id!!")
    }
    if(!content){
        throw new ApiError(400,"Comment is missing!!")
    }

    const updatedComment = await Comment.findOneAndUpdate({_id : commentId, owner : req.user?._id}, {

        $set : {
            content
        }
    })

    if(!updatedComment){
        throw new ApiError(500, "Comment doesnot Exists!! or Unauthorized access!")
    }

    return res.status(200).json(new ApiResponse(200, updatedComment, "comment updated successfully!!"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invaild comment id!")
    }

    const deletedComment = await Comment.findOneAndDelete({_id : commentId, owner : req.user?._id})

    if(!deletedComment){
        throw new ApiError(500, "comment does not exists!!")
    }

    return res.status(200).json( new ApiResponse(200, deletedComment, "Comment deleted successfully!!"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }