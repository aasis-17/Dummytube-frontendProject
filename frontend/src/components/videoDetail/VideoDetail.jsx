import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import videoService from '../../services/videosService'
import userService from '../../services/userServices'
import { useDispatch, useSelector } from 'react-redux'
import {VideoSection, LeftSection, PageProtector} from '../index'
import { setVideoDetails, setChannelProfile} from '../../store/videoSlice'
import useDataFetch from '../../utils/useDataFetch'

function VideoDetail() {
 
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const params = useParams()
  const videoId = params.videoId

  const dispatch = useDispatch()

  const loginUserId = useSelector((state) => state.authReducer.userData?._id)
  
      const videoDetail = async() =>{
        try{
          const data = await videoService.getVideoById(videoId, loginUserId)
          console.log(data)
          dispatch(setVideoDetails(
            {
            detail : data.data,
            userLikedVideo : data.data.isLiked,
          }))
          const videoOwnerProfile  = await userService.getUserProfile(data.data.owner, loginUserId)
          console.log(videoOwnerProfile)
          dispatch(setChannelProfile(
            {
              channelOwnerProfile : videoOwnerProfile.data,
              userSubscribedChannel : videoOwnerProfile.data.isSubscribed
            }
          ))
        }catch(error){
          setError(error?.message)
        }finally{
          setIsLoading(false)
        }      
      }

      useEffect(() => {
        setError("") 
        videoDetail()
    },[])

  if(isLoading) return <div>Loading details...</div>
  if(error) return <p>{error}</p>
    
  return (
    <>     
      <div className="flex flex-col p-2">
        <div className="flex flex-1">

          <LeftSection />

          {/* Video Section */}

          <div className="flex-1 ml-4 rounded-lg">
             <VideoSection />           
          </div>
        
        </div>

          {/* Related Videos */}
        <div className="bg-gray-300 p-4 mt-4">
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
    </>
  )  
}

export default VideoDetail