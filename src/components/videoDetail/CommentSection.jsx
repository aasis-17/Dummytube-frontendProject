import React, { useState,useEffect } from 'react'
import commentService from '../../services/commentService'
import {InputField} from '../index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart} from "@fortawesome/free-regular-svg-icons"
import { useForm } from 'react-hook-form'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { useSelector } from 'react-redux'
import {useTimeConverterHook, useDataFetch, useDebounce} from '../../utils/index'
import likeService from '../../services/likeServices'


function CommentSection() {

  const [handleError, setHandleError] = useState("")

  const loginUser = useSelector((state) => state.authReducer.userData)
  const videoId = useSelector(state => state.videoReducer.videoDetail.detail._id)

  const [commentLike, setCommentLike] = useState()


  const {register, handleSubmit, reset} =useForm()
  const [resetForm, setResetForm] = useState(false)

  const addAComment = async(data) => {
    setHandleError("")
    try{
      await commentService.addComment(videoId, data)
      setResetForm(true)
      reset({text : ""})
    }catch(error){
      setHandleError(error?.message)
    }  
  }

  const toggleCommentLike = async (commentId) => {
    setHandleError("")
    try{
      await likeService.toggleCommentLike(commentId)
      setCommentLike(prev => !prev)
    }catch(error){
      setHandleError(error?.message)
    }
  }

  const debounceToggleCommentLike = useDebounce(toggleCommentLike, 300)


  // useEffect(() => {
  //   setError("")
  //    commentService.getVideoComment(videoId)
  //   .then((response) => response.json())
  //   .then((data) => (
  //     setAllComments(data.data),
  //     setCommentLike(data.data.videoComments.isLiked)))
  //   .catch((error) => setError(error?.message))
  //   .finally(() => setIsLoading(false))

  //   resetForm && reset({text : ""})
  // },[resetForm, commentLike])

  const fetcher = () => {
    return commentService.getVideoComment(videoId)
  }
  const {isLoading, error, data} = useDataFetch(fetcher, videoId, commentLike, resetForm)

    if(isLoading) return <div>loading comments..</div>

    console.log(data)

    if(error) return <div>{error}</div>

    return ( 
    <div>
         <div className='h-[370px] overflow-auto'>
          { 
          !data.data.videoComments.length ? (<div>No comments !!</div>) 
          : 
          ( 
             data.data.videoComments.map((comment) => {
              const convertedTime = useTimeConverterHook(comment.createdAt)
              console.log(comment.updatedAt)
              return (
                      <div key={comment._id} className="max-w-lg mx-auto p-2 bg-white rounded-lg shadow-md mb-2">
                   {/* Comment Section */}
                        <div  className="flex items-start mb-2">
  {/* User Photo */}
                          <img className="w-10 h-10 rounded-full mr-3" src={comment.ownerDetail.avatar} alt="User Photo" />
  
  {/* Comment Content */}
                            <div className="flex-1">

                              <div className="flex justify-between items-center mb-2">
      {/* User Name */}
                                <h4 className="text-sm font-semibold">{comment.ownerDetail.username}</h4>
      {/* Comment Time */}
                                  <span className="text-xs text-gray-500">{convertedTime}</span>
                              </div>
    {/* Comment Text */}
                                <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
    {/* Action Buttons */}
                                <div className="flex space-x-4 text-sm text-gray-500">
      {/* Like Button */}
                                  <button onClick={() => debounceToggleCommentLike(comment._id)}  className="flex items-center hover:text-blue-500">
        
                                    <FontAwesomeIcon icon={faHeart} style={{color: comment.isLiked ? "#db0f4c" : ""}} />
                                    <span>{comment.commentLikeCount}</span>
                                  </button>
      {/* Reply Button */}
                                  <button className="flex items-center hover:text-blue-500">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 12a1 1 0 00.707-.293l4-4a1 1 0 10-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l4 4A1 1 0 0010 12z"></path>
                                    </svg>
                                    <span>Reply</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
              )
            })
          
          )}
        
  </div>

<div className='flex mt-14 items-center h-14 bg-gray-500 gap-2 rounded-md '>
  <div className='w-14'>
    <img src={loginUser.avatar} className='w-9 h-9 rounded-full mx-3'/>
  </div>
  <form className='flex w-full' onSubmit={handleSubmit(addAComment)}>
    <InputField 
    type = "text"
    placeholder = "Add a comment."
    className="w-full h-9 rounded-sm outline-none text-left px-2" 
    {...register("text",{
      required : true
    })}/>
    <button type='submit'>
      <FontAwesomeIcon className='w-8  px-2' icon={faPaperPlane} />
      </button>
    
  </form>
</div>

  </div>
    )
}


export default CommentSection