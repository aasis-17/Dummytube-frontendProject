import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {PlaylistCard, InputField} from '../index'
import { useForm } from 'react-hook-form'
import playlistService from '../../services/playlistService'
import { useDebounce } from '../../utils'
import { addPlaylist, setChannelPlaylist } from '../../store/playlistSlice'
import { useParams } from 'react-router-dom'
import useDataFetch from '../../utils/useDataFetch'

function Playlist() {
   
    const params = useParams()
    const channelId = params.channelId

    const loginUserId = useSelector(state => state.authReducer.userData?._id)
    const playlists = useSelector(state => state.playlistReducer.channelPlaylist)

    const dispatch = useDispatch()

    const [handleError, setHandleError]= useState("")
    const fetcher = () => {
        return  playlistService.getUserPlaylist(channelId)
      }
  
    const {isLoading, error, data} = useDataFetch(fetcher, channelId)

    useEffect(() => {
        dispatch(setChannelPlaylist(data?.data))
    }, [data])


    console.log(playlists)

    const [toggleCreateBtn, setCreateBtn] = useState(false)

    const {register, handleSubmit, reset} = useForm()

    
    const handleForm = async(data) => {
        setHandleError("")
        try{
        const response = await playlistService.createPlaylist(data.text)
        console.log(response)
            reset({text : ""})
            dispatch(addPlaylist(response.data))
            alert("Playlist created Successfully!!")
              
        }catch(error){
            setHandleError(error?.message)
            alert('Something went wrong while creating Playlist, try again!!')
        }
        
    }

    const debounceHandleForm = useDebounce(handleForm, 300)

    if(isLoading) return <div>loading playlist...</div>

    if(error) return <div>{error}</div>

    return (
        <div> 
            <div className="bg-gray-100 p-6 h-screen">
                <div className="container mx-auto">
                    <div className='flex justify-between '>
                        <h1 className="text-3xl font-bold mb-4">Video Playlists</h1>

                        {loginUserId === channelId && <h1 onClick={() => setCreateBtn(prev => !prev)} className=" text-2xl font-medium mb-4 cursor-pointer hover:border-b-4">+ Create </h1>}

                        {toggleCreateBtn &&
                        (<form className='rounded-md text-xl p-5 max-w-96  h-30 absolute top-40 right-0 bg-gray-300' onSubmit={ handleSubmit(debounceHandleForm)}> 
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
        {
            // data?.data
             playlists?.map((playlist) => (
            <PlaylistCard key={playlist._id}  playlist={playlist}/>  
        ))
        }

      </div>
    </div>
  </div>
  </div>
  )
}




export default Playlist