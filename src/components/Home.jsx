import React, { useEffect, useState } from 'react'
import videoService from '../services/videosService'
import { useDispatch, useSelector } from 'react-redux'
import { getVideoData } from '../store/videoSlice'
import { Link } from "react-router-dom"
import { Container } from "./index"

function Home() {
    const storeVideos = useSelector((state) => state.videoReducer.data)
    const [videos, setVideos] = useState(storeVideos)

      
      useEffect(() => {
        if(!storeVideos){
          videoService.getAllVideos()
          .then((data) => setVideos(data.data.allVideos))
        }else{
          setVideos(storeVideos)
        }   
       },[storeVideos])
    

  if(videos && videos.length !== 0) 
    return (
    <>
    <Container>
      <div className=" h-full flex justify-evenly flex-wrap gap-y-6 " >   
        { videos.map((video) => {
            return(
              <div key={video._id}>
              <Link state={video.owner.username} className="cursor-pointer"  to={`/video-detail/${video._id}`}  >
                <div className="  bg-gray-300 w-[350px] h-[230px] rounded  shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className=" h-full rounded overflow-hidden shadow-lg">
                    <div className='bg-blue-300 h-34 overflow-hidden cursor-pointer'>
                      <img className="w-full h-[160px] object-cover" src={video.thumnail} alt="Video Thumbnail"/>
                    </div>
                 
                    <div className="bg-red-50 h-full  px-2 py-1 ">
                      <div className="font-semibold text-lg">{video.title}</div>
                        <div className='flex justify-between'>
                            <div className="text-gray-600 text-base ">{video.owner.fullName}</div>
                            <div className="text-gray-500 text-sm">{video.createdAt}</div>
                        </div>
                       
                    </div>
                </div>
                </div>
              </Link>
              </div>
            )
        })}
        </div>
        </Container>
    </>
  )
  else if(videos && videos.length === 0){
   return <p>Video not found</p>
  }
  else{
    return <h1>loading...</h1>
  } 
}

export default Home