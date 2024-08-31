 class userServices{

    async getUserProfile(username, loginUser= ""){
        try{
        const response = await fetch(`/api/v1/users/channel-profile/${username}?loginUser=${loginUser}`)
        return response.ok && response
        }catch(error){
            throw error?.message
        }     
    }
}

const userService = new userServices()

export default userService

