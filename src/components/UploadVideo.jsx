import React, {useState} from 'react'
import {useForm} from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { InputField } from "./index"
import { useMutation, useQueryClient } from 'react-query'
import videoService from '../services/videosService'

function UploadVideo() {

  const [videoPreview, setVideoPreview] = useState({
  })

  const {register, handleSubmit} = useForm()

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const {mutateAsync} = useMutation(
    {
      mutationFn : (formData) => videoService.uploadVideo(formData),
      onSuccess : () => {
        queryClient.invalidateQueries({queryKey : "userVideos"})
        console.log("done")
      }
    }
  )

  const handleVideoPreview = (e) => {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setVideoPreview({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  
  }

  return (
    <div onClick={(e) => e.stopPropagation()} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg fixed top-10 left-0 right-0 ">
      <h2 className="text-2xl font-semibold mb-6">Upload Video</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    
    {/* <!-- Left Form Section --> */}
    <form onSubmit={handleSubmit(mutateAsync)} className="space-y-6">
      
      {/* <!-- Title Field --> */}
      <div>
        
        <InputField 
          type="text"
          label = "Title" 
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          placeholder="Enter video title"
          {...register("Title", {required : true})} />
      </div>

      {/* <!-- Thumbnail Field --> */}
      <div>
        
        <InputField 
          type="file"
          label = "Thumbnail" 
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          {...register("thumbNail",{required : true})}/>
      </div>

      {/* <!-- Video File Field --> */}
      <div>
        
        <InputField 
          label = "Video"
          type="file" 
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
          
          onChange ={(e) => handleVideoPreview(e)}
          {...register("video", {required : true})}/>
      </div>

      {/* <!-- Description Field --> */}
      <div>
        
        <textarea  
          rows="4" 
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          placeholder="Enter video description"
          {...register("description", {required : true})}></textarea>
      </div>

       {/* Submit Button */}
      <div>
        <button type="submit" 
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Upload Video
        </button>
      </div>
    </form>

    {/* <!-- Right Video Preview Section --> */}
    <div className="flex justify-center items-center">
      <div className="w-full h-auto">
        <video id="video-preview" controls className="w-full max-h-64 bg-gray-100 rounded-lg">
          <source src={videoPreview.imagePreviewUrl} id="video-source" type='video/mp4'/>
          Your browser does not support the video tag.
        </video>
        <p id="no-video-message" className="text-gray-500 text-sm mt-2 text-center">No video selected.</p>
      </div>
    </div>

  </div>
</div>

  )
}

export default UploadVideo