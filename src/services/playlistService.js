import axios from "axios"
class playlistServices {

    async getUserPlaylist (userId){
        try{
            const response = await fetch(`/api/v1/playlist/get-userPlaylist/${userId}`)
            return response.ok && response
        }catch(error){
            console.log(error?.message)
        }

    }

    async addVideoToPlaylist (playlistId, videoId) {
        try {
            const response = await fetch(`/api/v1/playlist/addvideo-to-playlist/${playlistId}/${videoId}`,
                {
                    method : "PATCH"
                }
            )
            return response.ok && response

        } catch (error) {
            console.log(error?.message)
        }
    }
    async removeVideoFromPlaylist (playlistId, videoId) {
        try {
            const response = await fetch(`/api/v1/playlist/remove-video/${playlistId}/${videoId}`,
                {
                    method : "DELETE"
                }
            )
            return response.ok && response

        } catch (error) {
            console.log(error?.message)
        }
    }

    async createPlaylist (name){
        try{
            const response = await fetch('/api/v1/playlist/create-playlist',
                {
                    method : "POST",
                    headers : {
                        "content-type" : "application/json"
                    },
                    body : JSON.stringify(
                        {name,
                        description : name
                    })
            })
            console.log(response.ok)
            return response.ok && response.json()
        }catch(error){
            console.log(error?.message)
        }
    }

    async deletePlaylist(playlistId) {
        try{
            const response = await fetch(`/api/v1/playlist/delete-playlist/${playlistId}`,
                {
                    method : "DELETE"
                }
            )
            return response.ok && response
        }catch(error){
            console.log(error?.message)
        }
       
    }

}

const playlistService = new playlistServices()

export default playlistService