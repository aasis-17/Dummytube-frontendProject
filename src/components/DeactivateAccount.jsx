import React, {useState} from 'react'
import authService from '../services/authServices'
import {  useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userDeactivate} from '../store/authSlice'


function DeactivateAccount() {
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleClick = async () => {
        try {
            const response = await authService.deactivateAccount()
            alert("Account deactivated successfully!!")
            dispatch(userDeactivate())
            navigate("/")
            
        } catch (error) {
            setError(error.message)
            alert(error?.message)
        }
    }
  return (
    <div >
        <p>All your videos and data will be erased !!</p>

        <button className='bg-gray-500 p-1 rounded-md mt-6' onClick={handleClick}>Deactivate</button>
    </div>
  )
}

export default DeactivateAccount