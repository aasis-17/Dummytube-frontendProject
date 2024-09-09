import React, { useEffect, useState } from 'react'
import videoService from '../services/videosService'
import { useDispatch, useSelector } from 'react-redux'
import { getVideoData } from '../store/videoSlice'
import { Link } from "react-router-dom"
import { Container } from "./index"
import { useTimeConverterHook } from '../utils'


function Home() {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const dispatch = useDispatch()

  const storeVideos = useSelector((state) => state.videoReducer.allVideos)
  const searchTitle = useSelector((state) => state.videoReducer.searchTitle)
      
      useEffect(() => {
        setError("")

          videoService.getAllVideos(searchTitle)
          .then((data) => dispatch(getVideoData(data.data.allVideos)))
          .catch((error) => setError(error?.message))
          .finally(() => setLoading(false))
        
       },[searchTitle])
    
   return  !loading ?  (
    <>
    <Container>
      <div className=" h-full flex justify-evenly flex-wrap gap-y-6 " >   
        { storeVideos.map((video) => {
          const convertTime = useTimeConverterHook(video.createdAt)
            return(
              <div key={video._id}>

              <Link state={video.owner.username} className="cursor-pointer"  to={`/video-detail/${video._id}/description`}  >
                <div className="  bg-gray-300 w-[350px] h-[230px] rounded  shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className=" h-full rounded overflow-hidden shadow-lg">
                    <div className='bg-blue-300 h-34 overflow-hidden cursor-pointer'>
                      <img className="w-full h-[160px] object-cover" src={video.thumnail} alt="Video Thumbnail"/>
                    </div>
                 
                    <div className="bg-red-50 h-full  px-2 py-1 ">
                      <div className="font-semibold text-lg">{video.title}</div>
                        <div className='flex justify-between'>
                            <div className="text-gray-600 text-base ">{video.owner.fullName}</div>
                            <div className="text-gray-500 text-sm">{convertTime}</div>
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
        {error && <p>{error}</p>}
    </>
  ) 
  :
   (<h1>loading...</h1>)

 
  
}

export default Home