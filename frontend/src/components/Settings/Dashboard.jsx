import React from 'react'
import { useQueries, useQuery } from 'react-query'
import authService from '../../services/authServices'
import { useSelector } from 'react-redux'

function Dashboard() {
    
  const loginUserId = useSelector(state => state.authReducer.userData?._id)
    
  const {data, error, isLoading} = useQuery({
      queryFn : () => authService.channelDashboard(loginUserId)
    })
    console.log(data)

  if(isLoading) return <div>loading dashboard...</div> 

  if(error) <div>{error}</div>

  return (
    <div className="p-6 max-w-6xl mx-auto mt-4">
      
    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Total Subscribers */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-600">Total Subscribers</h2>
        <p className="text-3xl font-bold text-blue-600 mt-4">
          {data.data.totalSubscribers.toLocaleString()}
        </p>
      </div>

      {/* Total Videos */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-600">Total Videos</h2>
        <p className="text-3xl font-bold text-green-600 mt-4">
          {data.data.totalVideos.toLocaleString()}
        </p>
      </div>

      {/* Total Video Likes */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-600">Total Video Likes</h2>
        <p className="text-3xl font-bold text-red-600 mt-4">
          {data.data.totalLikes.length.toLocaleString()}
        </p>
      </div>
    </div>
  </div>
  )
}

export default Dashboard