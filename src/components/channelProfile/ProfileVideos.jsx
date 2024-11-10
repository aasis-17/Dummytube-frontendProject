import React from 'react'
import { useSelector } from 'react-redux'
import { useOutletContext } from 'react-router-dom'

function ProfileVideos() {
    //const channelProfile = useSelector(state => state.videoReducer.channelProfile)
    const {channelVideos} = useOutletContext()
    console.log(channelVideos)
 
  return  (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {channelVideos?.allVideos.length !== 0 ?  channelVideos?.allVideos.map((video) => (
            <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={video.thumnail} alt={video.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{video.title}</h4>
              </div>
            </div>
          )) : (<p>No videos!!</p>)
        }
        </div>
    </div>
  )  
}

export default ProfileVideos