import { asyncHandler } from "../utiles/asyncHandler.js"
import { ApiError } from "../utiles/ApiErrors.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utiles/cloudinaryOrFileupload.js"
import { ApiResponse } from "../utiles/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {

    //get user details from frontend
    const {fullName, email, password, username} = req.body
    console.log(fullName)
    //validate user details from frontend (no empty fields)
     if ([fullName, email, password, username].some((field) => field?.trim() === "" )){
         throw new ApiError(400, "All fields are required !!")
     }

    // //check if user already existed!
     const existedUser = await User.findOne({
         $or : [{username}, {email}]
     })

     if(existedUser){
         throw new ApiError(400, "Username or email already exist!!")
     }

    // //check for file if compulsary(we compulsary avatar)
     const avatarLocalPath = req.files?.avatar[0]?.path;

     // =checking for coverImage, if not given undefined will be returned so we need solve it. 

     let coverImageLocalPath;
     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
     }


     if(!avatarLocalPath){
         throw new ApiError(400, "Avatar file is required!!")
     }

    // //Upload on Cloudinary (files)
     const avatar = await uploadOnCloudinary(avatarLocalPath)
     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // // check if avatar is uploaded or not
     if(!avatar){
         throw new ApiError(400, "avatar file is required!!")
     } 

    // // create user object - entry in database
     const user = await User.create({
         fullName,
         username : username.toLowerCase(),
         password,
         email,
         avatar : avatar.url,
         coverImage : coverImage?.url || ""
     })

    // //check if user is created on database 
    // //.select() method by default selects all fields so, by adding fields it unselects those fields and return
     const createdUser = await User.findById(user._id).select("-password -refreshToken")

     if(!createdUser){
         throw new ApiError(500, "Something went wrong while registering user!!")
     }
    // //return response
    return res.status(201).json(
         new ApiResponse(200, createdUser, "User registered successfully!!")
        
    )

})

export {registerUser}