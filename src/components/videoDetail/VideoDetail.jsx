import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import videoService from '../../services/videosService'
import userService from '../../services/userServices'
import { useDispatch, useSelector } from 'react-redux'
import VideoSection from './VideoSection'
import LeftSection from './LeftSection'
import { setVideoDetails} from '../../store/videoSlice'

function VideoDetail() {
 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const params = useParams()
  const videoId = params.videoId

  const dispatch = useDispatch()

  const loginUser = useSelector((state) => state.authReducer.userData?._id)
  const videoDetail = useSelector ((state) => state.videoReducer.videoDetail)
 

   // const [videoDetail, setVideoDetail] = useState({})
   // const [videoLike, setVideoLike] = useState()

   const getVideoDetail = videoService.getVideo(videoId, loginUser)
   

    useEffect(() => {
        setError("") 
        Promise.all([getVideoDetail])
        .then((data) => ( 
          console.log(data),
            dispatch(setVideoDetails(
              {
              detail : data[0].data,
              userLikedVideo : data[0].data.isLiked,
              // videoOwnerProfile : null,
              // userSubscribedChannel : false
            }))
           // setVideoLike(data.data.isLiked)
          ))

        .catch((error) => setError(error.message))
        .finally(() => setLoading(false))
        
    },[])
    
  return !loading? (
    <div>
        
    <div className="flex flex-col p-2">
      <div className="flex flex-1">

        <LeftSection 
         videoId={videoId}
         //description = {videoDetail.detail.description}
          />

        {/* Video Section */}

        <div className="flex-1 ml-4 rounded-lg">
          <VideoSection  
            //videoDetail={videoDetail} 
            //setVideoLike={setVideoLike} 
            />
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