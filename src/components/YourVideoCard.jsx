import React, { useState} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsisVertical} from "@fortawesome/free-solid-svg-icons"
import { useTimeConverterHook } from "../utils"
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import videoService from '../services/videosService'

function YourVideoCard({video}) {
    const [toggleThreeDots, setToggleThreeDots] = useState(false)

    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const mutation =  useMutation(
        {
            mutationFn : (videoId) => videoService.deleteVideo(videoId),
            onSuccess : () => queryClient.invalidateQueries({ queryKey : ["userVideos"]})
        }
    )

  return (

      <div key={video._id} onClick={() =>{navigate(`/video-detail/${video._id}/description`)}} className="cursor-pointer bg-white w-full rounded-lg min-h-28 shadow-md flex items-center justify-between ">  
        <div className="p-4 flex justify-between items-center w-[70%]">           
          <img src={video.thumnail} alt={video.title} className=" h-24 object-cover px-3" />
          <h4 className="text-lg font-semibold">{video.title}</h4>
          <h3>{useTimeConverterHook(video.createdAt)}</h3>
        </div>
        <div className='relative '>
          <span onClick={(e) => {
            e.stopPropagation()
            setToggleThreeDots(prev => !prev)}} className='cursor-pointer'>
            <FontAwesomeIcon className='w-5 px-4 h-8' icon={faEllipsisVertical} />
          </span>

          {toggleThreeDots &&
                      <div className='bg-white shadow-md rounded-lg min-w-32 min-h-22 absolute top-7 right-8 '>
                        <h3 className='cursor-pointer p-2 hover:shadow-md hover:bg-gray-50'>Edit</h3>
                        <h3 onClick={(e) =>{
                            e.stopPropagation()
                            mutation.mutate(video._id)
                        } } className='cursor-pointer p-2 hover:bg-slate-50 hover:shadow-lg'>Remove</h3>
                    </div>
          }

        </div>

      </div>

  )
}

export default YourVideoCard