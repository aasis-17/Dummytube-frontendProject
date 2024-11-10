import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import authService from '../services/authServices'
import {InputField} from '../components/index'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'

function SignUp() {
    
    const [error, setError] = useState("")
    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const signUphandler = async(data) => {
      
        const formData = new FormData()

        Object.keys(data).forEach((key) => {
            if(key === "coverImage" || key === "avatar"){
                formData.append(key, data[key][0])
            }else{
                formData.append(key, data[key])
            }
        })
        setError("")
        try{
            const user = await authService.createAccount(formData)
            if(user){
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(login(userData))
                navigate("/")
            }
        }catch(error){
            setError(error.message)
        }
        
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit(signUphandler)}>
            <div className="mb-4">
                <InputField 
                classLabel = "block text-sm font-medium text-gray-700"
                className = "mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                label = "Fullname"
                placeholder = "Enter your name"
                {...register("fullName", {
                    required : true,
                })
            }
                />
            </div>
            <div className="mb-4">
            <InputField 
                label = "Username"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                classLabel = "block text-sm font-medium text-gray-700"
                type = "text"
                placeholder = "Enter your Email"
                {...register("username", {
                    required : true
                })
            }
                />
            </div>

            <div className="mb-4">
            <InputField 
                label = "Email"
                classLabel = "block text-sm font-medium text-gray-700"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                type = "email"
                placeholder = "Enter your Email"
                {...register("email", {
                    required : true,
                    validate : {
                        matchPatern : (value) => /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi.
                        test(value) ||
                        "email address must be valid address"
                    }
                })
            }
                />
            </div>
            
            <div className="mb-4">
            <InputField 
                label = "Password"
                classLabel = "block text-sm font-medium text-gray-700"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                type = "password"
                placeholder = "Enter password"
                {...register("password", {
                    required : true
                })
            }
                />
            </div>

            <div className="mb-4">
            <InputField 
                label = "Avatar"
                classLabel = "block text-sm font-medium text-gray-700"
                className = "mt-1 block  text-sm text-gray-500  focus:outline-none focus:ring focus:ring-blue-200"
                type = "file"
                placeholder = "Select file"
                {...register("avatar", {
                    required : true
                })
            }
            />
            </div>

            <div className="mb-4">
            <InputField 
                label = "Cover Image"
                classLabel = "block text-sm font-medium text-gray-700" 
                className = "mt-1 block text-sm text-gray-500  rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                type = "file"
                placeholder = "Select file"
                {...register("coverImage")}
            />
            </div>

            {error && <p>{error}</p>}

            <button 
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            type='submit'>Submit</button>
        </form>
    </div>
    </div>
  )
}

export default SignUp