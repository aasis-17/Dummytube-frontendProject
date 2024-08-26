class likeServices {

    async toggleVideoLike (videoId) {
        try{
            const response = await fetch(`/api/v1/like/toggle-videoLike/${videoId}`)
            return response.ok && response
        }catch(error){
            console.log(error?.message)
        }
    }
}

const likeService = new likeServices()
export default likeService