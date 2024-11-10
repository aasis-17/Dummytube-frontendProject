import React, { useEffect, useState } from 'react'
import playlistService from '../../services/playlistService'
import {PageProtector} from '../index'
import { useSelector, useDispatch } from 'react-redux'
import { setChannelPlaylist } from '../../store/playlistSlice'
import { useDebounce } from '../../utils/index'
import useDataFetch from '../../utils/useDataFetch'


function PlaylistSection() {
  
  const channelId = useSelector(state => state.authReducer.userData?._id)
  const videoId = useSelector ((state) => state.videoReducer.videoDetail.detail._id)

  const [handleError, setHandleError] = useState("")

  const [playlistName, setPlaylistName] = useState("")
  const [ toggleReadonly, setToggleReadonly] = useState(false)

  const fetcher = () => {
    return playlistService.getUserPlaylist(channelId)
  }

  const {isLoading, error, data} = useDataFetch(fetcher, channelId)

  const handleChange = async(e, playlistId) => {  
      setHandleError("") 
      const {name, checked} = e.target
      try{
        if(checked){
          await playlistService.addVideoToPlaylist(playlistId, videoId)
          alert(`video added to ${name} playlist`)
        }else{
          await playlistService.removeVideoFromPlaylist(playlistId, videoId)
          alert(`video deleted from ${name} playlist`)
        }
      }catch(error){
        setHandleError(error?.message)
      }

    }

    const debounceHandleChange = useDebounce(handleChange, 300)

    const createPlaylist = async (name) =>{
      setHandleError("")
      try{
        await playlistService.createPlaylist(name)
        setToggleReadonly(false)
      }catch(error){
        setHandleError(error?.message)
      }
    }

  return (
    <PageProtector>
      <div className='w-56  bg-white absolute bottom-24 right-16 rounded-lg '>
        {isLoading && <div>Loading Playlist...</div>}
        {error && <h1>{error}</h1>}
        {handleError && (<div>{handleError}</div>)}

        <ul className=' flex flex-col gap-1  text-xl'>
            {
                data?.data.map((playlist) => (
                    <li onClick={(e) => e.stopPropagation()} key={playlist._id} className='flex justify-between px-4 py-4 shadow-sm hover:shadow-lg'>
                      <label id={playlist._id}>{playlist.name}</label>
                      <input 
                        className='cursor-pointer'
                        id={playlist._id}
                        type='checkbox'
                        name={playlist.name}
                        onClick={(e) => debounceHandleChange(e,playlist._id)} />
                    </li>
                  
                ))                
            }
            <li 
              onClick={
              (e) => (setToggleReadonly(prev => !prev),
                     e.stopPropagation() )
                    }  
              className='flex px-3 py-4 shadow-md hover:shadow-lg'> 
              <input 
                className='outline-none w-full cursor-pointer'
                type='text'
                value={toggleReadonly ? playlistName : "Create Playlist +"}
                onChange={(e) => setPlaylistName(e.target.value)} 
                readOnly = {!toggleReadonly}  
                />
              {toggleReadonly && <button onClick={() => createPlaylist(playlistName)}>+</button>}
            </li>
        </ul>
    </div>
  </PageProtector>
  )
}

export default PlaylistSection