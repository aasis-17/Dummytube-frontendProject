import React, { useState } from 'react'
import CommentSection from './CommentSection'
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import DescriptionSection from './DescriptionSection'
import {Navigation} from '../index'
import { useSelector } from 'react-redux'

function LeftSection() {

  const videoId = useSelector(state => state.videoReducer.videoDetail.detail?._id) 

    const navItems = [
      {
        name: "Comments",
        slug : `/video-detail/${videoId}/comment`
      },
      {
        name : "Description",
        slug : `/video-detail/${videoId}/description`
      },
      {
        name : "Note",
        slug : "video-detail/note"
      }
    ]
  return (
      <div className="w-1/3  bg-gray-200 p-2 h-[550px]">
          <nav className='h-11 flex gap-7  text-center mb-2 '>

            <Navigation 
              navItems={navItems}
              classNameNav={ ({isActive}) => (isActive ? "bg-gray-300 " : "") + "px-1 text-lg font-bold hover:bg-gray-300 rounded-md transition-all delay-100 "}
            />
            
          </nav>
            <div>
              <Outlet /> 
            </div>
      </div>
  )
}

export default LeftSection