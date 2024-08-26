 class userServices{

    async getUserProfile(username){
        try{
        const response = await fetch(`/api/v1/users/channel-profile/${username}`)
        return response.ok && response
        }catch(error){
            throw error?.message
        }     
    }
}

const userService = new userServices()

export default userService

