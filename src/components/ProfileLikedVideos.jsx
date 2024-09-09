import React from 'react'

function ProfileLikedVideos() {
  return (
    <div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {channelProfile.channelVideos.allVideos.length !== 0 ?  channelProfile.channelVideos.allVideos.map((video) => (
            <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={video.thumnail} alt={video.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{video.title}</h4>
              </div>
            </div>
          )) : (<p>No video uploaded!!</p>)
        }
        </div>
    </div>
  )
}

export default ProfileLikedVideos