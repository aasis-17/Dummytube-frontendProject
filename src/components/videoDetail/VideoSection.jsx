import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart} from "@fortawesome/free-regular-svg-icons"
import likeService from '../../services/likeServices'
import userService from '../../services/userServices'
import subService from '../../services/subscriptionServise'
import { useSelector } from 'react-redux'
import PlaylistSection from './PlaylistSection'


function VideoSection({ videoDetail, setVideoLike}) {

    const [publicId, setPublicId] = useState("")
    const [channelProfile, setChannelProfile] = useState({})
    const [subscribe, setSubscribe] = useState()
    const [playlistDisplay, setPlaylistDisplay] = useState(false)
    console.log(videoDetail )

    const navigate = useNavigate()
    const loginUserId = useSelector((state) => state.authReducer.userData?._id)

      const getPublicId = (videoFile) =>  {
        const arr = videoFile.split("/")
        return arr[arr.length - 1].replace(".mp4", "")
    }

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

      const toggleSubscription = async (channelId) => {
        try {
          const response = await subService.toggleSubscription(channelId)
          response.ok && setSubscribe((prev) => !prev)
        } catch (error) {
          console.log(error?.message)
          
        }
      }

      useEffect(() => {
        userService.getUserProfile(videoDetail.owner, loginUserId)
        .then((data) => (
          setChannelProfile(data.data),
          setSubscribe(data.data.isSubscribed),
          console.log(channelProfile)
        ))
        .catch((error) => console.log(error?.message))

        setPublicId(getPublicId(videoDetail.videoFile))
    },[publicId, subscribe])

  return (
    <div className='relative'>
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
        <div className='flex gap-4 items-center w-[50%] justify-around'>
          <div onClick={() => navigate("/channel-profile")} className='flex cursor-pointer w-full gap-12'>
            <div className='w-12 h-12 rounded-full overflow-hidden'>
                <img src={channelProfile.avatar} className='w-full h-full'/>
            </div>
            <div className='flex flex-col'>
                <h2>{channelProfile.username}</h2>
                <h5>{channelProfile.subscriberCount}</h5>
            </div>
            </div>
            <div onClick={() => toggleSubscription(channelProfile._id)} className='cursor-pointer bg-red-500 w-32 h-12 text-center rounded-2xl'>
                {channelProfile.isSubscribed ? "Subscribed" : "Subscribe"}
            </div>
        </div>
        <div className='flex items-center gap-2 w-[40%] cursor-pointer justify-evenly'>
            <div onClick={() => toggleLike(videoDetail._id)}>
            <FontAwesomeIcon icon={faHeart} style={{color: videoDetail.isLiked ? "#db0f4c" : ""}} />
            <span>{videoDetail.videoLikeCount}</span>
            </div>
            <div onClick={() => setPlaylistDisplay((prev => !prev))} className='cursor-pointer'>
              playlist
            { playlistDisplay &&  
            (
                <PlaylistSection videoId={videoDetail._id} userId = {loginUserId} />
            )
               }
              </div>
        </div>
      </div>
        </div>
      </div>
    
  )
}

export default VideoSection