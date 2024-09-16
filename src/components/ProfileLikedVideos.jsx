import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import likeService from '../services/likeServices'
import { setChannelProfile } from '../store/videoSlice'

function ProfileLikedVideos() {

  const channelLikedVideos = useSelector(state => state.videoReducer.channelProfile.channelLikedVideos)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

   useEffect(() => {
    if(!channelLikedVideos)  {
    setError("")
    likeService.getAllLikedVideos()
    .then((data) => dispatch(setChannelProfile({
      channelLikedVideos : data.data
    })))
    .catch(error => setError(error?.message))
    .finally(() => setLoading(false))
  } else{
    setLoading(false)
  }

  },[]) 

  return !loading ? (
    <div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {channelLikedVideos.length !== 0 ?  channelLikedVideos.map((video) => (
            <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={video.thumnail} alt={video.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{video.title}</h4>
              </div>
            </div>
          )) : (<p>No liked videos!!</p>)
        }
        </div>
        <p>{error && error}</p>
    </div>
  ) : (<p>loading...</p>)
}

export default ProfileLikedVideos