import React from 'react'
import {InputField} from '../index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { getSearchTitle, getVideoData} from "../../store/videoSlice"
import { useDebounce } from '../../utils/index'

function Search() {
    const {register, handleSubmit} = useForm()
    const dispatch = useDispatch()

     const dispatchTitle = (formData) => (
        dispatch(getSearchTitle(formData.query))
      )
       
    const searching = useDebounce(dispatchTitle, 1000)

    

  return (
    <div>
        <form className='flex' onChange={handleSubmit(searching)}>
        <InputField 
            type="text"
            placeholder = "Search"
            className = "rounded-tl-md rounded-bl-md h-[35px] w-60 pl-2 text-black"
            {...register("query")} />
        
        <button className='rounded-tr-md rounded-br-md bg-blue-600 w-[30px] h-[35px]' type='submit'><FontAwesomeIcon className='h-5'  icon = {faSearch}/></button>
        </form>
    </div>
  )
}

export default Search