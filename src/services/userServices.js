 class userServices{

    async getUserProfile(channelId, loginUser= ""){
        try{
        const response = await fetch(`/api/v1/users/channel-profile/${channelId}?loginUser=${loginUser}`)
        return response.ok && response.json()
        }catch(error){
            throw error?.message
        }     
    }
}

const userService = new userServices()

export default userService

