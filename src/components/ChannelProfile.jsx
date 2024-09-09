import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userService from '../services/userServices'
import videoService from '../services/videosService'
import Navigation from './Navigation'
import { Outlet, useParams } from 'react-router-dom'
import { setChannelProfile } from '../store/videoSlice'


function ChannelProfile() {
    const userData = useSelector((state) => state.authReducer.userData)
    const channelProfile = useSelector(state => state.videoReducer.channelProfile)
    const [loading, setLoading] = useState(true)

    const params = useParams()
    const channelId = params.channelId

    const dispatch = useDispatch()

    const navItems = [
      {
        name : "Videos",
        slug : `/channel-profile/${channelId}/videos`
      },
      {
        name : "Playlist",
        slug : `/channel-profile/${channelId}/playlist`
      },
      {
        name : "Liked Videos",
        slug : `/channel-profile/${channelId}/likedVideos`
      }
    ]

    useEffect(() => {
        try{
            const channelProfile = userService.getUserProfile(channelId)
            const userVideos = videoService.getAllVideos("",channelId)

            Promise.all([channelProfile, userVideos])
            .then((data) => (
                console.log(data),
                dispatch(setChannelProfile({
                  channelOwnerProfile : data[0].data,
                  userSubscribedChannel : data[0].data.isSubscribed,
                  channelVideos : data[1].data
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
          className={({isActive}) => (isActive ? "text-2xl font-semibold mb-4 border-b-4 border-solid  border-black" : ""  ) + "text-2xl font-semibold mb-4"  }/>
        </div>

      <Outlet />
{/*         
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {channelProfile.channelVideos.allVideos.length !== 0 ?  channelProfile.channelVideos.allVideos.map((video) => (
            <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={video.thumnail} alt={video.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{video.title}</h4>
              </div>
            </div>
          )) : (<p>No video uploaded!!</p>)
        }
        </div> */}

      </div>
    </div>
  
    </div>
  ) : (<p>loading...</p>)
}

export default ChannelProfile