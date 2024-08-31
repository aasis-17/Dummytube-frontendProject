import React, { useEffect, useState } from 'react'
import playlistService from '../../services/playlistService'
import PageProtector from '../AuthLayout'

function PlaylistSection({userId, videoId}) {

  const [loading, setLoading] = useState(true)

    const [allPlaylist, setAllPlaylist] = useState([])
    const [togglePlaylist, setTogglePlaylist] =useState(false)

    const [playlistName, setPlaylistName] = useState("")
    const [ toggleReadonly, setToggleReadonly] = useState(false)

    const addVideoToPlaylist = async (playlistId, videoId) => {
      try{
       // setTogglePlaylist(e.target.checked),

        if(!togglePlaylist){
          const response = await playlistService.addVideoToPlaylist(playlistId, videoId)
          const data = await response.json()
          console.log(data)
          
        }else{
          const response = await playlistService.removeVideoFromPlaylist(playlistId, videoId)
          const data = await response.json()
          console.log(data)
        }
      }catch(error){
        console.log(error?.message)
      }
      
    }

    const createPlaylist = async (name) =>{
      try{
        const response = await playlistService.createPlaylist(name)
        response.ok && setToggleReadonly(false)
      }catch(error){
        console.log(error?.message)
      }
     

    }

    useEffect(() => {

        const response = playlistService.getUserPlaylist(userId)
        response.then((response) => response.json())
        .then((data) => (
          console.log(data),
          setAllPlaylist(data.data)
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
                allPlaylist.map((item) => (
                    <li onClick={(e) => e.stopPropagation()} key={item._id} className='flex justify-between px-4 py-4 shadow-sm hover:shadow-lg'>
                      <label id={item._id}>{item.name}</label>
                      <input 
                        className='cursor-pointer'
                        id={item._id}
                        type='checkbox'
                        name={item.name}
                        defaultChecked = {togglePlaylist}
                        onClick={
                          (e) => (
                            console.log(e.target.checked),
                            setTogglePlaylist(prev => !prev),
                            addVideoToPlaylist(item._id, videoId ))
                        } />
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