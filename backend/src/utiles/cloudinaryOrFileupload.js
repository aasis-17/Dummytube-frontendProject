import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try{
            if(!localFilePath) return null

            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type : "auto"
            })
            console.log("file has been uploded on cloudinary")
            console.log(response.public_id)

            fs.unlinkSync(localFilePath)   
            return response;
        }catch (error){

            fs.unlinkSync(localFilePath) // this removes locally saved temporary files as upload operation fails
            return null;
        }
    }

    const deleteFileOnCloudinary = async (localFilePath)=>{
        try {
            console.log(typeof(localFilePath))
            if(typeof(localFilePath) === "string"){
                const response = await cloudinary.uploader
                .destroy(localFilePath, {
                    resource_type: 'image'
                })
                console.log("file has been deleted successfully!!")
                return response;
            }else if(typeof(localFilePath) === "object"){
                const response = await cloudinary.api
                .delete_resources(localFilePath, {resource_type : "video"})
                console.log("file has been deleted successfully!!")
                return response;
            }

        } catch (error) {
            console.log("problem while deleting file", error)
            return null
        
        }
    }

    export {uploadOnCloudinary, deleteFileOnCloudinary}