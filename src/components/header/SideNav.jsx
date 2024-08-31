import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { faCirclePlay, faHeart, faListUl, faClockRotateLeft, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authServices'
import { logout as storeLogout } from '../../store/authSlice'

function SideNav({sidebar}) {
    console.log(sidebar)
    const authStatus = useSelector((state) => state.authReducer.status)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logout =async () => {
        try{
            const response = await authService.logout()
            if (response.ok){
                dispatch(storeLogout())
                navigate("/")
            } 
        }catch(error){
            console.log(error?.message)
        } 
    }

    const navItems = [
        {
            name : "Your channel",
            slug : "/channel-profile",
            keep : true,
            logo :faCircleUser
        },
        {
            name : "History",
            slug : "",
            keep :  true,
            logo : faClockRotateLeft
        },
        {
            name : "Your videos",
            slug : "/create-account",
            keep : authStatus,
            logo : faCirclePlay
        },
        {
            name : "Playlsit",
            slug : "",
            keep : authStatus,
            logo : faListUl,
        },
        {
            name : "Liked videos",
            slug : "",
            keep : authStatus,
            logo : faHeart
        },
        {
            name : "Setting",
            slug : "/setting",
            keep : true,
            logo : faScrewdriverWrench 

        }    
    ]

    const logOutBtn = {
        name : "Signout",
        logo : faRightFromBracket
    }

  return (
    <div onClick={(e) => e.stopPropagation()}  className={`${sidebar? "" : "-translate-x-full"} w-[300px] h-[500px] bg-gray-700   bg-opacity-95 sticky  transition delay-100  `}>
        <nav className=' flex flex-col gap-7 text-xl'>
            <ul className='flex-1 px-5' >
                {navItems.map((item) => {
                    if(item.keep){
                       return (
                        <li className="block my-3 py-3.5 px-3  rounded transition duration-200 hover:bg-blue-600 hover:text-white" key={item.name}>
                            <Link  to={item.slug}>
                            <FontAwesomeIcon className='h-6 pr-7 ' icon={item.logo}/>

                             {item.name} 
                             
                            </Link>
                            </li>
                            
                        )
                    }
                    
})}
                <li onClick={logout} className="block my-3 py-3.5 px-3  rounded transition duration-200 hover:bg-blue-600 hover:text-white" key={logOutBtn.name}>
                            <FontAwesomeIcon className='h-6 pr-7 ' icon={logOutBtn.logo}/>
                             {logOutBtn.name}  
                            </li>
            </ul>
        </nav>
    </div>
  )
}

export default SideNav