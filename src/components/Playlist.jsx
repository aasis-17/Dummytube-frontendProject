import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PlaylistCard from './PlaylistCard'
import InputField from './InputField'
import { useForm } from 'react-hook-form'
import playlistService from '../services/playlistService'
import { useDebounce } from '../utils'
import { addPlaylist } from '../store/playlistSlice'

function Playlist() {
   
    const loginUserId = useSelector(state => state.authReducer.userData?._id)
    const playlists = useSelector(state => state.playlistReducer.channelPlaylist)

    const [toggleCreateBtn, setCreateBtn] = useState(false)

    const {register, handleSubmit, reset} = useForm()
    const dispatch = useDispatch()


    const handleForm = async(data) => {
        console.log(data)
        try{
        const response = await playlistService.createPlaylist(data.text)
            console.log(response)
            reset({text : ""})
            dispatch(addPlaylist(response.data))
        
        
        }catch(error){
            console.log(error?.message)
        }
        
    }

    const debounceHandleForm = useDebounce(handleForm, 300)

    console.log(playlists)

  return (
    <div> 
        <div className="bg-gray-100 p-6">
            <div className="container mx-auto">
                <div className='flex justify-between relative'>
                    <h1 className="text-3xl font-bold mb-4">Video Playlists</h1>
                    <h1 onClick={() => setCreateBtn(prev => !prev)} className="text-2xl font-medium mb-4 cursor-pointer hover:border-b-4">+ Create </h1>
                    {toggleCreateBtn &&
                    (<form className='rounded-md text-xl p-5 w-96  h-30 absolute top-10 right-0 bg-gray-300' onSubmit={ handleSubmit(debounceHandleForm)}> 
                        <InputField
                        label = "Name"
                        type = "text"
                        className = "h-9 w-full rounded-lg text-xl p-2"
                        {...register("text", {
                            required : true
                        })}
                        />
                        <button className='bg-gray-500 p-2 rounded-lg w-full mt-4' type='submit'>create</button>
                    </form>)}
                </div>    
                
      {/* Playlist Column */}
      <div className="flex flex-col gap-6">
        {playlists.map((playlist) => (
            <PlaylistCard key={playlist._id}  playlist={playlist}/>  
        ))}
      </div>
    </div>
  </div>
  </div>
  )
}




export default Playlist