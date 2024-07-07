import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_NAME, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try{
            if(!localFilePath) return null

            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type : "auto"
            })
            console.log("file has been uploded on cloudinary")
            return response;
        }catch (error){

            fs.unlinkSync(localFilePath) // this removes locally saved temporary files as upload operation fails
            return null;
        }
    }

    export {uploadOnCloudinary}