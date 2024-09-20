import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from 'react-query';
import userService from '../../services/userServices';
import { useForm} from "react-hook-form"

const AccountInfo = () => {
  // Initial state for the account information
  const loginUser = useSelector(state => state.authReducer.userData)
  console.log(loginUser)
  const [account, setAccount] = useState(loginUser);
  

  const {mutate, isSuccess} = useMutation({
    mutationFn : () => userService.updateDetail(account),
    
  })
   // Dummy data for channel stats
   const stats = {
    totalSubscribers: 12500,
    totalVideos: 75,
    totalLikes: 47000,
  };


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
    toggleEdit(field)
    setAccount(prev => ({...prev, [field] : loginUser[field]}))
  }

  const handleImage = (e, field) => {
    console.log(field)
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
 
  //  reader.onloadend = () => {
    
  //    setAccount((prev) => ({ ...prev, [field]: reader.result }));
  //  };
  //  if (file) {
  //    reader.readAsDataURL(file);
  //  }
  }

  const handleImageChange = (data) => {

      const formData = new FormData()
      formData.append("avatar",data.avatar[0])
      console.log(formData)
    //  userService.updateAvatar(formData)
    //  .then((data) => console.log(data))
    //  .catch(error => console.log(error))
 

  };

  // Handler for toggling edit mode
  const toggleEdit = (field) => {
    if(["fullname", "username"].some((arrField) => arrField === field) && isEditing[field]){
      mutate()
      console.log("success")
    }

     setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    


  };

  return (
    <div>
      {/* Cover Image */}
      <div className="relative h-48 w-full rounded-lg overflow-hidden">
        <img src={account.coverImage} alt="Cover" className="object-coverImage w-full h-full" />

        
{/* <form onSubmit={handleSubmit(handleImageChange)}> */}

    <label hidden={isEditing.coverImage} onClick={() => toggleEdit("coverImage")} htmlFor="example" className="absolute top-2 right-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg" >
      edit
      </label>
    {isEditing.coverImage && (
      <div className='absolute top-2 right-2 flex flex-col gap-3' >
      <button type='submit' className=" px-4 py-2 bg-gray-800 text-white text-sm rounded-lg">save</button>
      <button onClick={() => cancelImage("coverImage")} className=" px-4 py-2 bg-gray-800 text-white text-sm rounded-lg" >cancel</button>
      </div>
    )}
  <input
    id='example'
    type="file"
    accept="image/*"
    onChange={(e) => handleImage(e, 'coverImage')}
    className="absolute top-2 left-20"
    hidden     
  />

    {/* </form> */}
           
      </div>

      {/* Avatar and Information */}
      <div className="flex items-center space-x-4 ">
        {/* Avatar */}
        <div className="relative">
          <img
            src={account.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-coverImage border-4 border-white shadow-lg"
          />

          {/* <form onSubmit={handleSubmit(handleImageChange)}> */}
      <label hidden={isEditing.avatar} onClick={() => toggleEdit("avatar")} htmlFor="example1" className="absolute top-2 right-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg" >
      edit
      </label>

    {isEditing.avatar && (
      <div className='absolute top-30 right-2 flex gap-3' >
      <button type='submit' className=" px-2 py-1  bg-gray-800 text-white text-xs rounded-lg">save</button>
      <button onClick={() => cancelImage("avatar")} className=" px-1 py-1  bg-gray-800 text-white text-xs rounded-lg" >cancel</button>
      </div>
    )}
            
            <input
              id='example1'
              type="file"
              accept="image/*"
              onChange={() => console.log("hello")}
              className="absolute bottom-0 right-0"
              hidden      
              {...register("avatar",{required : true})}
            />
            {/* </form>  */}
          
        </div>

        {/* Account Information */}
        <div>
          {/* Fullname */}
          <div className="flex items-center space-x-2">
            {isEditing.fullname ? (
              <input
                type="text"
                name="fullName"
                value={account.fullName}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg"
                
              />
            ) : (
              <h2 className="text-2xl font-bold">{account.fullName}</h2>
            )}
            <button
              onClick={() => toggleEdit('fullname')}
              className="text-sm text-blue-500"
            >
              {isEditing.fullname ? 'Save' : 'Edit'}
            </button>
          </div>

          {/* Username */}
          <div className="flex items-center space-x-2 mt-2">
            {isEditing.username ? (
              <input
                type="text"
                name="username"
                value={account.username}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-lg"
              />
            ) : (
              <p className="text-gray-600">@{account.username}</p>
            )}
            <button
              onClick={() => toggleEdit('username')}
              className="text-sm text-blue-500"
            >
              {isEditing.username ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

    
 
    <div className="p-6 max-w-6xl mx-auto mt-4">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Subscribers */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-600">Total Subscribers</h2>
          <p className="text-3xl font-bold text-blue-600 mt-4">
            {stats.totalSubscribers.toLocaleString()}
          </p>
        </div>

        {/* Total Videos */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-600">Total Videos</h2>
          <p className="text-3xl font-bold text-green-600 mt-4">
            {stats.totalVideos.toLocaleString()}
          </p>
        </div>

        {/* Total Video Likes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-600">Total Video Likes</h2>
          <p className="text-3xl font-bold text-red-600 mt-4">
            {stats.totalLikes.toLocaleString()}
          </p>
        </div>
      </div>
    </div>



    </div>
  );
};

export default AccountInfo;

