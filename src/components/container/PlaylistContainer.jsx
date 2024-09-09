import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import playlistService from '../../services/playlistService'
import { useDispatch } from 'react-redux'
import { setChannelPlaylist } from '../../store/playlistSlice'

function PlaylistContainer({children}) {

    const [loading, setLoading] = useState(true)

    const params = useParams()
    const channelId = params.channelId

    const dispatch = useDispatch()
    
    console.log(channelId)

    useEffect(() => {

        const response = playlistService.getUserPlaylist(channelId)
        response.then((response) => response.json())
        .then((data) => (
          console.log(data),
          dispatch(setChannelPlaylist(data.data))
        ))
        .catch((error) => console.log(error?.message))
        .finally(()=> setLoading(false))
    },[])

  return !loading ?  (
    <>
        {children}
    </>
  ) : <p>loading...</p>
}

export default PlaylistContainer