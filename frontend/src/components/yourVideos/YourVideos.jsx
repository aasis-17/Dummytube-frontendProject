import React, {useState} from 'react'
import { useMutation, useQuery } from 'react-query'
import videoService from '../../services/videosService'
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom"
import {YourVideoCard, UploadVideo} from '../index'



function YourVideos() {

  const [toggleVideoForm, setToggleVideoForm] = useState(false)

  const loginUserId = useSelector(state => state.authReducer.userData?._id)

  const {data, isLoading, error} = useQuery({
    queryFn : () => videoService.getAllVideos("", loginUserId),
    queryKey : ["userVideos"],
    refetchOnWindowFocus: false
  })


  if(isLoading) return <p>Loading...</p>

  if(error) return <p>{error}</p>

  console.log(data)
    
  return (
    <div className='bg-gray-200 h-screen'>
      <div className='flex justify-between px-4 h-20 items-center'>
        <div className='text-3xl font-semibold'>Your Videos</div>
        <span onClick={() => setToggleVideoForm(prev => !prev)} className='cursor-pointer text-2xl font-medium'>+ Upload</span>
      </div>
      <div className="flex flex-col gap-5 max-w-auto px-5">
      {data.data.allVideos.length !== 0 ?  data.data.allVideos.map((video) => (

        <YourVideoCard key={video._id} video={video} />

          )) : (<p>No videos!!</p>)
          }
          </div>

          {
            toggleVideoForm && 
            (<div onClick={ () => setToggleVideoForm(false)} className='backdrop-blur-sm w-screen h-screen absolute top-0'>
              <UploadVideo setToggleVideoForm={setToggleVideoForm} edit={false} />
            </div>)
            
          }
    
</div>
  )
}

export default YourVideos