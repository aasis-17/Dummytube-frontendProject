import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import videoService from '../services/videosService'
import userService from '../services/userServices'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart} from "@fortawesome/free-regular-svg-icons"
import likeService from '../services/likeServices'
import { useSelector } from 'react-redux'

function VideoDetail() {
    const params = useParams()
    const videoId = params.videoId

    const username = useLocation()
    const navigate = useNavigate()

    const loginUser = useSelector((state) => state.authReducer.userData._id)

    const [loading, setLoading] = useState(true)
    const [videoDetail, setVideoDetail] = useState({})
    const [userProfile, setUserProfile] = useState({})
    const [error, setError] = useState("")
    const [publicId, setPublicId] = useState("")
    const [videoLike, setVideoLike] = useState()

    const getPublicId = (videoFile) =>  {
        const arr = videoFile.split("/")
        return arr[arr.length - 1].replace(".mp4", "")
    }

    useEffect(() => {
        setError("")
        
        const videoPromise = videoService.getVideo(videoId, loginUser)
        const userPromise = userService.getUserProfile(username.state)

        const response = Promise.all([videoPromise, userPromise])
        response.then((data) =>   data.map((value) => value.json()))
        .then((data) => ( 
          data[0].then((data) => (
            setPublicId(getPublicId(data.data.videoFile)),
            setVideoDetail(data.data),
            setVideoLike(data.data.isLiked),
            console.log(videoLike),
            console.log(videoDetail)
          )),
          data[1].then((data) => (
          setUserProfile(data.data)
           )
        )))
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false))
        
    },[publicId, videoId, videoLike])

    const toggleLike = async (videoId) => {
      try{
        const response = await likeService.toggleVideoLike(videoId)
        if(response.ok) setVideoLike((prev) => !prev)
        else {
              navigate("/login")
      }
      }catch(error){
        console.log(error?.message)
      }
      
    }

    
  return !loading? (
    <div>
        
    <div className="flex flex-col p-2">
      <div className="flex flex-1">
        {/* Comment Section */}
        <div className="w-1/3 bg-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Comments</h2>
          <div className="space-y-4">
            <p>Comment 1: Lorem ipsum dolor sit amet.</p>
            <p>Comment 2: Consectetur adipiscing elit.</p>
            <p>Comment 3: Integer nec odio. Praesent libero.</p>
            {/* Add more comments here */}
          </div>
        </div>

        {/* Video Section */}
        <div className="flex-1 ml-4 rounded-lg">
        <iframe
        className='rounded-2xl object-fill'
        width="100%"
        height="450"
        src={`https://player.cloudinary.com/embed/?public_id=${publicId}&cloud_name=backend-project-chai&player[controls]=true`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        
      ></iframe>
      <div className='w-full bg-white h-[100px] '>
        <div className='h-10 px-4 py-2'>{videoDetail.title}</div>
        <div className='flex items-center justify-between px-2'>
        <div className='flex gap-4 items-center w-[50%]'>
            <div className='w-12 h-12 rounded-full overflow-hidden'>
                <img src={userProfile.avatar} className='w-full h-full'/>
            </div>
            <div className='flex flex-col'>
                <h2>{userProfile.username}</h2>
                <h5>{userProfile.subscriberCount}</h5>
            </div>
            <div className='bg-red-500 w-32 h-12 text-center rounded-2xl'>
                {userProfile.isSubscribed ? "Subscribed" : "Subscribe"}
            </div>
        </div>
        <div className='flex items-center gap-2 w-[40%]'>
            <div onClick={() => toggleLike(videoDetail._id)}>
            <FontAwesomeIcon icon={faHeart} style={{color: videoLike ? "#db0f4c" : ""}} />
            <span>{videoDetail.videoLikeCount}</span>
            </div>
            <div>playlist</div>
        </div>
        

      </div>
        </div>
        </div>
      </div>

      {/* Related Videos */}
      <div className="bg-gray-300 p-4 mt-4 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Related Videos</h2>
        <div className="flex space-x-4">
          <div className="w-1/3 bg-gray-400 h-32 flex items-center justify-center">
            Video 1
          </div>
          <div className="w-1/3 bg-gray-400 h-32 flex items-center justify-center">
            Video 2
          </div>
          <div className="w-1/3 bg-gray-400 h-32 flex items-center justify-center">
            Video 3
          </div>
          {/* Add more related videos here */}
        </div>
      </div>
    </div>
    <p>{error.message}</p>
    </div>
  )  : <p>loading...</p>
}

export default VideoDetail