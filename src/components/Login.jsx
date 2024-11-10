import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useForm } from 'react-hook-form'
import authService from '../services/authServices'
import { login as storeLogin } from '../store/authSlice'
import {Container, InputField} from '../components/index'
import useDataFetch from '../utils/useDataFetch'

function Login() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [handleError, setHandleError] = useState("")
    const {register, handleSubmit} = useForm()

    const loginHandle = async(data)=> {
        setHandleError("")
        try{
            const userStatus = await authService.login(data)
            if(userStatus){
                const userData = await authService.getCurrentUser()
                console.log("userdata :", userData)
                if(userData) dispatch(storeLogin(userData))
                navigate("/")
            }
        }catch(error){
            setHandleError(error.message)
        }
    }

  const fetcher = () => {
    return authService.refreshAccessToken()
  }

  const {isLoading, error, data} = useDataFetch(fetcher)

  if (isLoading) return <div>loading refresh...</div>

  if(data) navigate('/')

  return  (
    <Container>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

        <form className="mt-6 space-y-4" onSubmit={ handleSubmit(loginHandle)}>
            <div>
            <InputField 
            label = "Email"
            type = "email"
            classLabel="block text-m font-medium text-gray-700"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder = "Email or username"
            {...register("email", {
                reuired : true
            })}
             />
             </div>

            <div>
            <InputField 
            label = "Password"
            type = "password"
            classLabel="block text-m font-medium text-gray-700"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            placeholder = "password.."
            {...register("password", {
                reuired : true
            })}
             />
             </div>

             <div className="text-sm">
              <Link  className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</Link>
            </div>

             <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" type='submit'>Login</button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to={'/create-account'} className="text-blue-600 hover:text-blue-500 font-medium">Sign Up</Link>
        </p>
    </div>
    </div>
    </Container>
  )
}

export default Login