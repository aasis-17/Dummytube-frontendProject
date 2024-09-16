import axios from "axios"

class videoServices {

    async getAllVideos (query="", userId="", page=1, limit=10,sortBy="createdBy", sortType="des") {
        console.log("userId",userId,"query", query)
        try {
            const response = await fetch
            (`/api/v1/video/get-allVideos?query=${query}&userId=${userId}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`)
            console.log( response)
                return response.ok &&  response.json()
        } catch (error) {
            console.log(error?.message)     
        } 
    }

    async getVideo(videoId, loginUser="") {
        try {
            const response = await fetch(`/api/v1/video/get-video/${videoId}?loginUser=${loginUser}`)
            return response.ok && response.json()
            
        } catch (error) {
            console.log(error?.message)
            
        }
    }

    async uploadVideo (formData) {
        try {
            const response = await fetch("/api/v1/video/upload-video",{
                method : "post",
                data : JSON.stringify(formData)
            })
            return response.ok && response
        } catch (error) {
            console.log(error?.message)
        }
    }

    async deleteVideo (videoId){
        try{
            const response = await fetch(`/api/v1/video/deleteVideo/${videoId}`)
            return response.ok && response
        }catch(error){
            console.log(error?.message)
        }
    }
}

const videoService = new videoServices()

export default videoService