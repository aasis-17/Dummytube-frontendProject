import React, { useState } from 'react'
import CommentSection from './CommentSection'
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import DescriptionSection from './DescriptionSection'

function LeftSection({videoId, description}) {
  console.log(description)

  // const params = useParams()
  // const videoId = params.videoId

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
    //<div>
        <div className="w-1/3  bg-gray-200 p-4 h-[550px]">
        <nav className='h-11 flex gap-7  text-center mb-2 '>
          {
            navItems.map((item) => {
              return <NavLink key={item.name}  to={item.slug} className={ ({isActive}) => (isActive ? "bg-gray-300 " : "") + "px-1 text-lg font-bold hover:bg-gray-300 rounded-md transition-all delay-100 "}>{item.name}</NavLink>
            })
          }
        </nav>
        <div>
        <Outlet context = {{description, videoId}} /> 
        </div>
    </div>
  )
}

export default LeftSection