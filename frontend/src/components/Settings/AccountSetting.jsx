import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from 'react-query';
import userService from '../../services/userServices';
import { useForm} from "react-hook-form"
import { updateUserData } from '../../store/authSlice';

const AccountInfo = () => {
  // Initial state for the account information
  const loginUser = useSelector(state => state.authReducer.userData)

  const [account, setAccount] = useState(loginUser);
  const dispatch = useDispatch()
  let inputRef = useRef(null)

  const mutateAccountDetail = useMutation({
    mutationFn : () => userService.updateDetail({fullName : account.fullName, username : account.username}),
    onSuccess : () => {
      dispatch(updateUserData(account))
    },
    onError : () => {
      dispatch(updateUserData(loginUser))
    }
    
  })

  const mutateAvatar = useMutation({
    mutationFn : (formData) =>{ 
      userService.updateAvatar(formData)},
    onSuccess : () => {
      dispatch(updateUserData(account))
      toggleEdit("avatar")
    },
    onError : () => {
      dispatch(updateUserData(loginUser))
    }

  })

  const mutateCoverImage = useMutation({
    mutationFn : (formData) => userService.updateCoverImage(formData),
    onSuccess : () => {
      dispatch(updateUserData(account))
      toggleEdit("coverImage")
    },
    onError : () => {
      dispatch(updateUserData(loginUser))
    }

  })


  // State for managing edit mode
  const [isEditing, setIsEditing] = useState({
    fullname: false,
    username: false,
    avatar: false,
    coverImage: false,
  });

  const {register, handleSubmit} = useForm()

  // Handlers for updating each field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));

  };

  const cancelImage = (field) => {

    inputRef.current = null
    toggleEdit(field)
    setAccount(prev => ({...prev, [field] : loginUser[field]}))
  }

  const handleImage = (e, field) => {
    
    console.log(field)
    const file = e.target.files[0];
    const reader = new FileReader();
 
   reader.onloadend = () => {
     setAccount((prev) => ({ ...prev, [field]: reader.result }));  
   };
   if (file) {
     reader.readAsDataURL(file);
   }
   
    inputRef.current = file
    e.target.value = null
   
  }

  const handleImageChange = (data, field) => {

    const formData = new FormData()
    formData.append(field, inputRef.current)

      switch (field) {

        case "avatar" : 

          mutateAvatar.mutateAsync(formData)
          break;
        

        case "coverImage" : 
        
          mutateCoverImage.mutateAsync(formData)
          break;
      }
  };

  // Handler for toggling edit mode
  const toggleEdit = (field) => {
    if(["fullname", "username"].some((arrField) => arrField === field) && isEditing[field]){
      mutateAccountDetail.mutate()
      
      console.log("success")
    }
     setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  
  };

  return (
    <div>
      {/* Cover Image */}
      <div className="relative h-48 w-full rounded-lg overflow-hidden">
        <img src={account.coverImage} alt="Cover" className="object-coverImage w-full h-full" />

        <form onSubmit={handleSubmit((data) => handleImageChange(data, "coverImage"))}>

    <label hidden={isEditing.coverImage} onClick={() => toggleEdit("coverImage")} htmlFor="example" className="absolute top-2 right-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg" >
      edit
      </label>
    {isEditing.coverImage && (
      <div className='absolute top-2 right-2 flex flex-col gap-3' >
      <button  type='submit' className=" px-4 py-2 bg-gray-800 text-white text-sm rounded-lg">save</button>
      <button type='button' onClick={() => cancelImage( "coverImage")} className=" px-4 py-2 bg-gray-800 text-white text-sm rounded-lg" >cancel</button>
      </div>
    )}
  <input
    id='example'
    type="file"
    accept="image/*"
    onInput = {(e) => handleImage(e, 'coverImage')}
    className="absolute top-2 left-20"
    hidden     
    ref={inputRef}
    {...register("coverImage")}
  />

    </form>
           
      </div>

      {/* Avatar and Information */}
      <div className="flex mt-5 items-center space-x-4 ">
        {/* Avatar */}
        <div className="relative mr-5">
          <img
            src={account.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-2xl object-coverImage border-2   shadow-lg"
          />

    <form onSubmit={handleSubmit((data) => handleImageChange(data, "avatar"))}>
      <label hidden={isEditing.avatar} onClick={() => toggleEdit("avatar")} htmlFor="example123" className="absolute text-xs top-0  px-2 py-1 bg-gray-800 text-white  rounded-lg" >
        edit
      </label>
    {isEditing.avatar && (
      <div className='absolute top-2 right-2 flex flex-col gap-3' >
        <button type='submit' className=" px-4 py-2 bg-gray-800 text-white text-sm rounded-lg">save</button>
        <button type='button' onClick={() => cancelImage( "avatar")} className=" px-4 py-2 bg-gray-800 text-white text-sm rounded-lg" >cancel</button>
      </div>
    )}
  <input
    id='example123'
    type="file"
    accept="image/*"
    onInput={(e) => handleImage(e, 'avatar')}
    className="absolute top-2 left-20"
    hidden  
    {...register("avatar")}   
  />
</form> 
          
        </div>

        {/* Account Information */}
        
        <div >
          {/* Fullname */}
          <div className="flex mt-2 items-center space-x-2 text-gray-700">
          <label className="text-2xl font-semibold">Fullname :</label>
            {isEditing.fullname ? (
              <input
                type="text"
                name="fullName"
                value={account.fullName}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg"                
              />
            ) : (
              <>
                  <p className="text-2xl font-semibold">{account.fullName}</p>
              </>    
            )}
            <button
              onClick={() => toggleEdit('fullname')}
              className="text-sm text-blue-500"
            >
              {isEditing.fullname ? 'Save' : 'Edit'}
            </button>
            {mutateAccountDetail.isLoading && <p>loading..</p>}
          </div>

          {/* Username */}
          <div className="flex items-center space-x-2 mt-2 text-gray-700">
          <label className="text-2xl font-semibold">Username :</label>
            {isEditing.username ? (
              <input
                type="text"
                name="username"
                value={account.username}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg"
              />
            ) : (<>
                 
                   <p className="text-2xl font-semibold">{account.username}</p>
            </>
             
            )}
            <button
              onClick={() => toggleEdit('username')}
              className="text-sm text-blue-500"
            >
              {isEditing.username ? 'Save' : 'Edit'}
            </button>

          </div>
          <div className="flex items-center space-x-2 mt-2 text-gray-700">
              <label className="text-2xl font-semibold">Email :</label>
              <p className="text-2xl font-semibold">{account.email}</p>
            </div>
        </div>
      </div>

    
    

     </div>
  );
};

export default AccountInfo;

