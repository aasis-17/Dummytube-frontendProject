import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userService from '../../services/userServices'
import videoService from '../../services/videosService'
import {Navigation} from "../index"
import { Outlet, useParams } from 'react-router-dom'
import { setChannelProfile } from '../../store/videoSlice'
import likeService from '../../services/likeServices'
import useDataFetch from '../../utils/useDataFetch'


function ChannelProfile() {
  
    const loginUserId = useSelector((state) => state.authReducer.userData?._id)

    const params = useParams()
    const channelId = params.channelId
    console.log(channelId, loginUserId)

    const dispatch = useDispatch()

    const navItems = [
      {
        name : "Videos",
        slug : `/channel-profile/${channelId}/videos`,
        status : true
      },
      {
        name : "Playlist",
        slug : `/channel-profile/${channelId}/playlist`,
        status : true
      },
      {
        name : "Liked Videos",
        slug : `/channel-profile/${channelId}/likedVideos`,
        status : channelId === loginUserId
      }
    ]

  const fetcher = (channelId) => {
            const channelProfile = userService.getUserProfile(channelId)
            const userVideos = videoService.getAllVideos("",channelId)
            const likedVideos = likeService.getAllLikedVideos()

          return  Promise.allSettled([channelProfile, userVideos, likedVideos])
  }

  const {isLoading, error, data} = useDataFetch(fetcher, channelId)

  const channelOwnerProfile = data && data[0].value.data

  const channelVideos = data && data[1].value.data

  const channelLikedVideos = data && data[2].value.data
 

  if(isLoading) return <div>loading profile...</div>

  if (error) return <div>{error}</div>
       
  return (
    <div>
        
    <div className="min-h-screen bg-gray-300 ">
      {/* Cover Image */}
      <div className=" h-64 bg-cover bg-center flex place-items-end " style={{ backgroundImage: `url(${channelOwnerProfile.coverImage})` }}>
        {/* Profile Picture and Info */}
        <div className="pl-6  p-5 flex items-center">
          <img
            src={channelOwnerProfile.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <div className="ml-4 text-black">
            <h2 className="text-2xl font-semibold">{channelOwnerProfile.username}</h2>
            <p className="text-sm inline-block">{channelOwnerProfile.subscriberCount} Subscribers . {channelVideos.pagination.totalVideosCount} Videos</p>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="container mx-auto px-4 ">

        <div className='flex gap-16 mt-14'>
        <Navigation
          navItems={navItems}
          className={ " text-2xl font-semibold mb-4 list-none"}
          classNameNav={({isActive}) => (isActive ? "border-b-4 border-gray-500 " :"") }/>
        </div>

      <Outlet context={ {channelVideos, channelLikedVideos} }
   />

      </div>
    </div>
  
    </div>
  ) 
}

export default ChannelProfile