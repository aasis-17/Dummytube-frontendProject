import React, { useEffect, useState } from 'react'
import playlistService from '../../services/playlistService'
import PageProtector from '../AuthLayout'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setChannelPlaylist } from '../../store/playlistSlice'
import { useDebounce } from '../../utils'


function PlaylistSection(
 // {userId, videoId}
) {
  const allPlaylist = useSelector(state => state.playlistReducer.channelPlaylist)
  const channelId = useSelector(state => state.authReducer.userData?._id)
  const videoId = useSelector ((state) => state.videoReducer.videoDetail.detail._id)

  const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)

    const [playlistName, setPlaylistName] = useState("")
    const [ toggleReadonly, setToggleReadonly] = useState(false)


    const handleChange = async(e,playlistId) => {
      const {name, checked} = e.target
      try{
        if(checked){
          const response = await playlistService.addVideoToPlaylist(playlistId, videoId)
          response.ok && alert(`video added to ${name} playlist`)
        }else{
          const response = await playlistService.removeVideoFromPlaylist(playlistId, videoId)
          response && alert(`video deleted from ${name} playlist`)
        }
      }catch(error){
        console.log(error?.message)
      }

    }

    const debounceHandleChange = useDebounce(handleChange, 300)

    const createPlaylist = async (name) =>{
      try{
        const response = await playlistService.createPlaylist(name)
        response.ok && setToggleReadonly(false)
      }catch(error){
        console.log(error?.message)
      }
    }

    useEffect(() => {

        const response = playlistService.getUserPlaylist(channelId)
        response.then((response) => response.json())
        .then((data) => (
          console.log(data),
          dispatch(setChannelPlaylist(data.data))
        ))
        .catch((error) => console.log(error?.message))
        .finally(()=> setLoading(false))
    },[toggleReadonly])

  return (
    <PageProtector>
      {!loading &&
    <div className='w-56  bg-white absolute bottom-24 right-16 rounded-lg '>
      
        <ul className=' flex flex-col gap-1  text-xl'>
            {
                allPlaylist.map((playlist) => (
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
 } 
    </PageProtector>
  )
}

export default PlaylistSection