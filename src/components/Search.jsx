import React from 'react'
import InputField from './InputField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import videoService from '../services/videosService'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getVideoData} from "../store/videoSlice"

function Search() {
    const {register, handleSubmit} = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const searching = async (formData) => {
      try{
        const res = await videoService.getAllVideos(formData.query)
        console.log(formData)
        dispatch(getVideoData(res.data.allVideos))
        navigate("/")
    
      }catch(error){
        console.log(error?.message)
      }
   

    }
  return (
    <div>
        <form className='flex' onSubmit={handleSubmit(searching)}>
        <InputField 
            type="text"
            placeholder = "Search"
            className = "rounded-tl-md rounded-bl-md h-[35px] w-60 pl-2 text-black"
            {...register("query")} />
        
        <button className='rounded-tr-md rounded-br-md bg-blue-600 w-[30px] h-[35px]' type='submit'><FontAwesomeIcon className='h-5'  icon = {faSearch}/></button>
        </form>
    </div>
  )
}

export default Search