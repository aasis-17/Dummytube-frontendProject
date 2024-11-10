import React from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import playlistService from '../../services/playlistService'
import { useDispatch } from 'react-redux'
import { deletePlaylist as removePlaylist, removeVideoFromPlaylist as removeVideo } from '../../store/playlistSlice'
import { useDebounce } from '../../utils/index'

function PlaylistCard({playlist}) {

    const [handleError, setHandleError] = useState("")
    const [togglePlaylist,setTogglePlaylist] = useState(false)

    const dispatch = useDispatch()

    const deletePlaylist = async(playlistId) => {
      setHandleError("")
        try{
            const response = await playlistService.deletePlaylist(playlistId)
            dispatch(removePlaylist(playlistId))
            alert(response.data?.name  +"Playlist deleted successfully!!")
            
        }catch(error){
            setHandleError(error.message)
            alert("Error while deleting playlist")
        }
    
    }

    const removeVideoFormPlaylist = async(playlistId, videoId) => {
      setHandleError("")
        try{
            const response = await playlistService.removeVideoFromPlaylist(playlistId, videoId)
            dispatch(removeVideo({playlistId, videoId}))
            console.log(response)
            alert( "video removed from" + playlist.name)
        }catch(error){
            setHandleError(error?.message)
            alert("something went wrong !! try again")
        }
    }
    const debounceReomveVideoFromPlaylist = useDebounce(removeVideoFormPlaylist, 300)
    const debounceDeletePlaylist = useDebounce(deletePlaylist, 300)

  return (
    <div>
        <div  className=" bg-white shadow-md rounded-lg p-4 ">
            <div className='flex items-center justify-between'>
                <h2 className="text-xl font-semibold mb-2">{playlist.name}</h2>
                <span className='cursor-pointer' onClick={()=> debounceDeletePlaylist(playlist._id)}>delete</span>
                <span className='cursor-pointer ' onClick={()=>setTogglePlaylist(prev => !prev)}>
                    {!togglePlaylist ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleUp} />}
                </span>
            </div>

            {/* Video List */}
            {togglePlaylist &&  (
            <ul  className={` bg-red-50  w-full left-0 z-10`}>

              {
              playlist.videos.map((video) => (
                <li key={video._id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg shadow">
                  <img src={video.thumnail} width={'120px'} />
                  <span>{video.title}</span>
                  <button
                    className="text-red-500 hover:text-red-700 font-bold"
                    onClick={() => debounceReomveVideoFromPlaylist(playlist._id, video._id)}
                  >
                    Remove
                  </button>
                </li>
              ))
              }

            </ul>
            ) }

          </div>
    </div>
  )
}

export default PlaylistCard