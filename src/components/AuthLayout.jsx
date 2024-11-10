import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authServices'

function PageProtector({children, authentication = true}) {
  
    const navigate = useNavigate()
    const authStatus = useSelector((state) => state.authReducer.status)

    const [isLoading, setIsLoading] = useState(true)
    

    useEffect(() => {
        if(authentication && authStatus !== authentication){
            navigate("/login")
        }
        // else if(!authentication && authStatus === authentication){
        //     navigate("/")
        // }
        setIsLoading(false)

    },[authStatus, navigate, authentication])

    if(isLoading) return <div>loading...</div>

    return  <div>{children}</div>
}

export default PageProtector