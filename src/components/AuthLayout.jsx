import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function PageProtector({children, authentication = true}) {
    const [loader, setLoader] = useState(true)
    const navigate = useNavigate()
    const authStatus = useSelector((state) => state.authReducer.status)
    

    useEffect(() => {
        if(authentication && authStatus !== authentication){
            navigate("/login")
        }else if(!authentication && authStatus !== authentication){
            navigate("/")
        }
        setLoader(false)
    },[authStatus, navigate, authentication])


  return !loader ? 
  (<div>{children}</div>) 
  : (<div>loading...</div>)
}

export default PageProtector