import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { LogoutBtn,Logo, Search, SideNav } from "../index.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

function Header() {

const [sidebar, setSidebar] = useState(false)

const navigate = useNavigate()

const authStatus = useSelector((state) => state.authReducer.status)

const userData = useSelector((state) => state.authReducer.userData)


  return (
    <div className='h-14 text-white '>
            <nav className='sticky bg-gray-900 z-10 top-0  px-4 py-2 flex items-center justify-between '>
                {!authStatus ? (
                    <Link to={"/login" }>
                        <div className='flex gap-2 items-center'>
                            <div className='w-8 h-8 overflow-hidden  rounded-full  '>
                                <FontAwesomeIcon icon={faCircleUser} /> 
                            </div>
                             <div>
                                 Login
                            </div>
                        </div>
                    </Link>)
                 : 
                (<button onClick={() => setSidebar((prev) => !prev)}>
                    <div className='flex gap-2 items-center'>
                    <div className='w-8 h-8 overflow-hidden  rounded-full'>
                        <div className='w-full object-cover bg-white'>
                            <img src={userData.avatar} alt='ava'/>
                        </div>
                    </div>
                    <div>
                        {userData.fullName}
                    </div>
                </div>
                </button>)
                 }

                <div onClick={() => navigate("/")} className="text-2xl font-semibold">  
                    <Logo />
                </div>
                <div className='w-[300px]'>
                    <Search />
                 </div>
            </nav>
                     
                 <SideNav setSidebar={setSidebar}  sidebar = {sidebar}/> 
            </div>

        
        
    
  )
}

export default Header