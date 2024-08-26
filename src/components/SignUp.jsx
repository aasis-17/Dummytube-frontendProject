import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import authService from '../services/authServices'
import InputField from './InputField'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'

function SignUp() {
    console.log("hello")
    
    const [error, setError] = useState("")
    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const signUphandler = async(data) => {
      
        const formData = new FormData()
        //  formData.append("email", data.email)
        //  formData.append("username", data.username)
        //  formData.append("fullName", data.fullName)
        //  formData.append("password", data.password)
        // formData.append("coverImage", data.coverImage[0])
        // formData.append("avatar", data.avatar[0])
        console.log(formData)

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
    <div className='bg-red  w-full'>
        <form onSubmit={handleSubmit(signUphandler)}>

            <InputField 
                label = "Fullname :"
                placeholder = "Enter your name"
                {...register("fullName", {
                    required : true,
                })
            }
                />
            
            <InputField 
                label = "Username :"
                type = "text"
                placeholder = "Enter your Email"
                {...register("username", {
                    required : true
                })
            }
                />

            <InputField 
                label = "Email :"
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
            
            <InputField 
                label = "Password :"
                type = "password"
                placeholder = "Enter password"
                {...register("password", {
                    required : true
                })
            }
                />

            <InputField 
                label = "Avatar :"
                type = "file"
                placeholder = "Select file"
                {...register("avatar", {
                    required : true
                })
            }
                />

            <InputField 
                label = "Cover Image :"
                type = "file"
                placeholder = "Select file"
                {...register("coverImage")}
                />

                {error && <p>{error}</p>}

                <button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default SignUp