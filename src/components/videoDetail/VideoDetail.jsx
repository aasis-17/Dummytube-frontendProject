import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import videoService from '../../services/videosService'
import { useSelector } from 'react-redux'
import VideoSection from './VideoSection'
import LeftSection from './LeftSection'
import CommentSection from './CommentSection'
import DescriptionSection from './DescriptionSection'

function VideoDetail() {

  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const params = useParams()
  const videoId = params.videoId

    const loginUser = useSelector((state) => state.authReducer.userData?._id)


    const [videoDetail, setVideoDetail] = useState({})
    const [videoLike, setVideoLike] = useState()

    useEffect(() => {
        setError("") 
        const videoPromise = videoService.getVideo(videoId, loginUser)

        const response = Promise.all([videoPromise])
        response.then((data) =>   data.map((value) => value.json()))
        .then((data) => ( 
          data[0].then((data) => (
            setVideoDetail(data.data),
            setVideoLike(data.data.isLiked)
          ))
      ))
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false))
        
    },[videoLike])
    
  return !loading? (
    <div>
        
    <div className="flex flex-col p-2">
      <div className="flex flex-1">

        <LeftSection 
        videoId={videoId}
         description = {videoDetail.description} />

        {/* Video Section */}

        <div className="flex-1 ml-4 rounded-lg">
          <VideoSection  
            videoDetail={videoDetail} 
            setVideoLike={setVideoLike} 
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