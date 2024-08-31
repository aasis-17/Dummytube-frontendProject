class subscriptionServices {

    async toggleSubscription (channelId){
        try{
            const response = await fetch(`/api/v1/subscription/toggle-subscription/${channelId}`)
            return response.ok && response
        }catch(error){
            console.log(error?.message)
        }
        
    }

} 

const subService = new subscriptionServices()

export default subService