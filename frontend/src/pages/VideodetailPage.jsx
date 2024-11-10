import React from 'react'
import { PageProtector, VideoDetail } from '../components'

function VideodetailPage() {
  return (
    <PageProtector authentication = {false}>
        <VideoDetail />
    </PageProtector>
  )
}

export default VideodetailPage