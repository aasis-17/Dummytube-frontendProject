 class userServices{

    async getUserProfile(channelId, loginUser= ""){
        try{
        const response = await fetch(`/api/v1/users/channel-profile/${channelId}?loginUser=${loginUser}`)
        return response.ok && response.json()
        }catch(error){
            throw error?.message
        }     
    }

    async updateDetail (accountDetail){
        try {
            const response = await fetch(`/api/v1/users/update-details`,{
                method : "PATCH",
                body : JSON.stringify(accountDetail),
                headers : {
                    "content-type" : "application/json"
                }
            })
            console.log(response)
            return response.ok && response.json()
        } catch (error) {
            throw  error?.message
        }
    }

    async changePassword (passwords) {
        try {
            const response = await fetch(`/api/v1/users/change-password`,{
                method : "POST",
                body : JSON.stringify(passwords),
                headers : {
                    "content-type" : "application/json"
                }
            })
            return response.ok && response.json()
        } catch (error) {
            throw error?.message
        }

    }

    async updateAvatar (avatar){
        try {
            const response = await fetch("/api/v1/users/update-avatar",
                {
                    method : "POST",
                    body : avatar,

                }
            )
            return response.ok && response.json()
        } catch (error) {
            throw new Error(error?.message)
        }
    }
}

const userService = new userServices()

export default userService

