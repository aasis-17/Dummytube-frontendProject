import React, {useState} from 'react'
import {useForm} from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { InputField } from "../index"
import { useMutation, useQueryClient } from 'react-query'
import videoService from '../../services/videosService'

function UploadVideo({setToggleVideoForm, edit, video}) {

  const [videoPreview, setVideoPreview] = useState({       
    file: {},
    imagePreviewUrl: ""
  })

  const {register, handleSubmit} = useForm()

  const queryClient = useQueryClient()

  const {mutateAsync, isLoading, isError, error} = useMutation(
    {
      mutationFn : (formData) => 
      !edit ? videoService.uploadVideo(formData) : 
      videoService.updateVideo(video._id, formData),
      onSuccess : () => {
        queryClient.invalidateQueries({queryKey : "userVideos"})
        setToggleVideoForm(false)
      }
    }
  )

  const handleFormSubmit = (data) => {

    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if(["thumnail", "videoFile"].includes(key)) {
        formData.append(key, data[key][0])
      }else{
        formData.append(key, data[key])
      }
    })
    console.log(formData.get("thumnail"))
    mutateAsync(formData)
  }

  const handleVideoPreview = (e) => {
  
    let file = e.target.files[0];
    let reader = new FileReader()
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
      <h2 className="text-2xl font-semibold mb-6">{ !edit ? "Upload Video" : "Edit video"}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    
    {/* <!-- Left Form Section --> */}
    <form onSubmit={ handleSubmit(handleFormSubmit)} className="space-y-6">
      
      {/* <!-- Title Field --> */}
      <div>
        
        <InputField 
          type="text"
          label = "Title" 
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          defaultValue = {!edit ? "" : video.title} 
          placeholder="Enter video title"
          {...register("title", {required : true})} />
      </div>

      {/* <!-- Thumbnail Field --> */}
      <div>
        
        <InputField 
          type="file"
          label = "Thumbnail" 
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          {...register("thumnail")}/>
      </div>

      {/* <!-- Video File Field --> */}
      { !edit && (
              <div> 
              <InputField 
                label = "Video"
                type="file" 
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                onInput ={(e) => handleVideoPreview(e)}
                {...register("videoFile", {required : true})}/>
            </div>
      )}


      {/* <!-- Description Field --> */}
      <div>
        
        <textarea  
          rows="4" 
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          defaultValue={!edit ? "" : video.description}
          placeholder="Enter video description"
          {...register("description", {required : true})}></textarea>
      </div>

       {/* Submit Button */}
      <div>
        <button 
          type="submit"
          disabled ={isLoading} 
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Upload Video
        </button>
      </div>
    </form>

    {/* <!-- Right Video Preview Section --> */}
    {!edit && (
       <div className="flex justify-center items-center">
       <div className="w-full h-auto">
         <video id="video-preview" type='video/mp4' src={videoPreview.imagePreviewUrl} controls className="w-full max-h-64 bg-gray-100 rounded-lg">
           Your browser does not support the video tag.
         </video>
       </div>
     </div>
    )}
   

  </div>
  {isError && <div>{error}</div>}
</div>

  )
}

export default UploadVideo