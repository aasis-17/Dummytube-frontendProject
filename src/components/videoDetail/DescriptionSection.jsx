import React from 'react'
import { useSelector } from 'react-redux'
import { useOutletContext } from 'react-router-dom'

function DescriptionSection() {

  const videoDescription = useSelector(state => state.videoReducer.videoDetail.detail?.description)
  return (
    <div>
        {videoDescription}
    </div>
  )
}

export default DescriptionSection