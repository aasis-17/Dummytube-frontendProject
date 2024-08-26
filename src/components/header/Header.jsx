import React, { useState } from 'react'
import Logo from '../Logo.jsx'
import { useSelector } from 'react-redux'
import Container from '../container/Container.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { LogoutBtn, Search, SideNav } from "../index.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'




function Header() {
const [sidebar, setSidebar] = useState(false)
const navigate = useNavigate()
const authStatus = useSelector((state) => state.authReducer.status)
const userData = useSelector((state) => state.authReducer.userData)
console.log(userData)
console.log(authStatus)


  return (
    
            <header className="bg-gray-900 text-white shadow-md sticky h-20"> 
            
            <nav className=' mx-auto px-4 py-6 flex items-center justify-between'>
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
                    <div className='w-8 h-8 overflow-hidden  rounded-full  '>
                        <div className='w-full object-cover'>
                            <img src={userData.avatar} alt='ava'/>
                        </div>
                    </div>
                    <div>
                        {userData.fullName}
                    </div>
                </div>
                </button>)
                 }

                <div className="text-2xl font-semibold">  
                    <Logo />
                </div>
                <div className='w-[300px]'>
                    <Search />
                 </div>
            </nav>
                 
                 
                {
                    <SideNav  sidebar = {sidebar}/>
                // (<div onClick={() =>  setSidebarWidth("-translate-x-full")} className='overflow-hidden w-full'>
                //     <SideNav  sidebarWidth = {sidebarWidth} setSidebarWidth = {setSidebarWidth}/>
                // </div>)
                  
                }
            </header>
    

        
        
    
  )
}

export default Header