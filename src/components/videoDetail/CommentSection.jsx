import React, { useState,useEffect } from 'react'
import commentService from '../../services/commentService'
import { useOutletContext, useParams } from 'react-router-dom'
import InputField from '../InputField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart} from "@fortawesome/free-regular-svg-icons"
import { useForm } from 'react-hook-form'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { useSelector } from 'react-redux'
import useTimeConverterHook from '../../utils/usetimeConverterHook'
import likeService from '../../services/likeServices'
import { useDebounce } from "../../utils"

function CommentSection() {
  const [ loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loginUser = useSelector((state) => state.authReducer.userData)
  const videoId = useSelector(state => state.videoReducer.videoDetail.detail._id)

  const [allComments, setAllComments] = useState([])
  const [commentLike, setCommentLike] = useState()


  const {register, handleSubmit, reset} =useForm()
  const [resetForm, setResetForm] = useState(false)

  const addAComment = async(data) => {
    setError("")
    try{
      const response = await commentService.addComment(videoId, data)
      response.ok && setResetForm(true)
    }catch(error){
      setError(error?.message)
    }  
  }

  const toggleCommentLike = async (commentId) => {
    try{
      const response = await likeService.toggleCommentLike(commentId)
      response.ok && setCommentLike(prev => !prev)
    }catch(error){
      console.log(error.message)
    }
  }

  const debounceToggleCommentLike = useDebounce(toggleCommentLike, 300)


  useEffect(() => {
    setError("")
     commentService.getVideoComment(videoId)
    .then((response) => response.json())
    .then((data) => (
      setAllComments(data.data),
      setCommentLike(data.data.videoComments.isLiked)))
    .catch((error) => setError(error?.message))
    .finally(() => setLoading(false))

    resetForm && reset({text : ""})
  },[resetForm, commentLike])

 

    return (
    
    <div>
        {!loading ? (<div className='h-[370px] overflow-auto'>
          {
            allComments.videoComments.map((comment) => {
              const convertedTime = useTimeConverterHook(comment.createdAt)
              console.log(comment.updatedAt)
              return (
                <div key={comment._id} className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mb-2">
                   {/* Comment Section */}
  <div  className="flex items-start mb-4">
  {/* User Photo */}
  <img className="w-10 h-10 rounded-full mr-4" src={comment.ownerDetail.avatar} alt="User Photo" />
  
  {/* Comment Content */}
  <div className="flex-1">
    <div className="flex justify-between items-center mb-1">
      {/* User Name */}
      <h4 className="text-sm font-semibold">{comment.ownerDetail.username}</h4>
      {/* Comment Time */}
      <span className="text-xs text-gray-500">{convertedTime}</span>
    </div>
    {/* Comment Text */}
    <p className="text-sm text-gray-700 mb-2">
     {comment.content}
    </p>
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
          
          }
      
          { error && <p>{error}</p>}

          
</div>

    
  ) : (<p>loading comments...</p>)
}

<div className='flex mt-9 items-center w-full h-16 bg-gray-500 gap-2 rounded-md justify-between'>
<div className='w-14'>
  <img src={loginUser.avatar} className='w-9 h-9 rounded-full mx-3'/>
</div>

<form className='flex gap-1' onSubmit={handleSubmit(addAComment)}>
  <InputField 
    type = "text"
    placeholder = "Add a comment."
    className="w-[360px] h-9 rounded-sm outline-none text-left px-2" 
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