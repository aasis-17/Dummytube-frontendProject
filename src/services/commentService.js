class commentServices {

    async getVideoComment (videoId){
        const response = await fetch(`/api/v1/comment/getall-video-comments/${videoId}`)
        return response.ok && response 
    }

    async addComment (videoId, data) {
        console.log(data)
        const response = await fetch(`/api/v1/comment/add-comment/${videoId}`,
            {
                method: "POST",
                headers :{
                    "content-type" : "application/json"
                },
                body : JSON.stringify({
                    content : data.text
                })
            }
        )
        return response.ok && response
    }

  
}

const commentService = new commentServices()

export default commentService