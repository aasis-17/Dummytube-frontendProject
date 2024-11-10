
class videoServices {

    async getAllVideos (query="", userId="", page=1, limit=10,sortBy="createdBy", sortType="des") {
        console.log("userId",userId,"query", query)
        try {
            const response = await fetch
            (`/api/v1/video/get-allVideos?query=${query}&userId=${userId}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`)
            if (response.ok) return response.json()
            else{
                throw new Error("something went wrong!!")
            }
    
        }catch(error){
            throw new Error(error?.message);
        }
    }

    async getVideoById(videoId, loginUser="") {
        try {
            const response = await fetch(`/api/v1/video/get-video/${videoId}?loginUser=${loginUser}`)
            if (response.ok) return response.json()
            else{
                throw new Error("something went wrong!!")
            }
    
        }catch(error){
            throw new Error(error?.message);
        }
    }

    async uploadVideo (formData) {
        try {
            const response = await fetch("/api/v1/video/upload-video",{
                method : "POST",
                body : formData
            })
            if (response.ok) return response.json()
            else{
                throw new Error("something went wrong!!")
            }
    
        }catch(error){
            throw new Error(error?.message);
        }
    }

    async deleteVideo (videoId){
        try{
            const response = await fetch(`/api/v1/video/deleteVideo/${videoId}`)
            if (response.ok) return response.json()
            else{
                throw new Error("something went wrong!!")
            }
    
        }catch(error){
            throw new Error(error?.message);
        }
    }

    async updateVideo (videoId, formData){
        try {
            const response = await fetch(`/api/v1/video/updateVideo/${videoId}`,{
                method : "PATCH",
                body : formData
            })
            if (response.ok) return response.json()
            else throw new Error("Something went wrong!!")
        } catch (error) {
            throw new Error(error?.message)
        }
    }
}

const videoService = new videoServices()

export default videoService