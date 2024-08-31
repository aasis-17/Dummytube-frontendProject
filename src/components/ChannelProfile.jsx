import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import userService from '../services/userServices'
import videoService from '../services/videosService'


function ChannelProfile() {
    const userData = useSelector((state) => state.authReducer.userData)
    console.log(userData)
    const [channelDetail, setChannelDetail] = useState({})
    const [channelVideos, setChannelVideos] = useState([])

    useEffect(() => {
        try{
            const channelProfile = userService.getUserProfile( userData._id)
            const userVideos = videoService.getAllVideos("",userData._id)

            Promise.all([channelProfile, userVideos])
            .then((data) => (
                console.log(data),
             setChannelDetail(data[0].data) ,
             setChannelVideos(data[1].data.allVideos)
            ))
            .catch((error) => console.log(error?.message))
    
   
    
        }catch(error){
            console.log(error?.message)
        }
       
    },[])
       
  return (
    <div>
        
    <div className="min-h-screen bg-gray-100 ">
      {/* Cover Image */}
      <div className=" h-64 bg-cover bg-center flex place-items-end " style={{ backgroundImage: `url(${userData.coverImage})` }}>
        {/* Profile Picture and Info */}
        <div className="pl-6  p-5 flex items-center">
          <img
            src={userData.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <div className="ml-4 text-gray-700">
            <h2 className="text-2xl font-semibold">{userData.username}</h2>
            <p className="text-sm">{channelDetail.subscriberCount} Subscribers</p>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-semibold mb-4">Channel Videos</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channelVideos.length !== 0 ?  channelVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{video.title}</h4>
              </div>
            </div>
          )) : (<p>No video uploaded!!</p>)
        }
        </div>

      </div>
    </div>
  
    </div>
  )
}

export default ChannelProfile