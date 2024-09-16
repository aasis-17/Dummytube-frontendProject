import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userService from '../services/userServices'
import videoService from '../services/videosService'
import Navigation from './Navigation'
import { Outlet, useParams } from 'react-router-dom'
import { setChannelProfile } from '../store/videoSlice'
import likeService from '../services/likeServices'


function ChannelProfile() {
    const loginUserId = useSelector((state) => state.authReducer.userData?._id)
    const channelProfile = useSelector(state => state.videoReducer.channelProfile)
    console.log(channelProfile)
    const [loading, setLoading] = useState(true)

    const params = useParams()
    const channelId = params.channelId

    console.log(channelId === loginUserId)

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

    useEffect(() => {
        try{
            const channelProfile = userService.getUserProfile(channelId)
            const userVideos = videoService.getAllVideos("",channelId)
            const likedVideos = likeService.getAllLikedVideos()

            Promise.allSettled([channelProfile, userVideos, likedVideos])
            .then((data) => (
                console.log(data[2]),
                dispatch(setChannelProfile({
                  channelOwnerProfile : data[0].value.data,
                  userSubscribedChannel : data[0].value.data.isSubscribed,
                  channelVideos : data[1].value.data,
                  channelLikedVideos : data[2].value ? data[2].value.data : null
                }))
            ))
            .catch((error) => console.log(error?.message))
            .finally(() => setLoading(false))
        }catch(error){
            console.log(error?.message)
        }
       
    },[])
       
  return !loading ? (
    <div>
        
    <div className="min-h-screen bg-gray-300 ">
      {/* Cover Image */}
      <div className=" h-64 bg-cover bg-center flex place-items-end " style={{ backgroundImage: `url(${channelProfile.channelOwnerProfile.coverImage})` }}>
        {/* Profile Picture and Info */}
        <div className="pl-6  p-5 flex items-center">
          <img
            src={channelProfile.channelOwnerProfile.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <div className="ml-4 text-black">
            <h2 className="text-2xl font-semibold">{channelProfile.channelOwnerProfile.username}</h2>
            <p className="text-sm inline-block">{channelProfile.channelOwnerProfile.subscriberCount} Subscribers . {channelProfile.channelVideos.pagination.totalVideosCount} Videos</p>
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

      <Outlet />


      </div>
    </div>
  
    </div>
  ) : (<p>loading...</p>)
}

export default ChannelProfile