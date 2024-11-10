

class authServices{
    
    async createAccount (formData){
        try{
        const email = formData.get("email")
        const password = formData.get("password")

        const response = await fetch("/api/v1/users/register", {
            method : "POST",
            body : formData
            
        })
        if(response.ok){
           await this.login({email,  password})
           return response.json()     
        }else{
            throw new Error("something went wrong!!")
        }

    }catch(error){
        throw new Error(error?.message);
    }
}

    async login({email, password}){
        try{
            const response = await fetch("/api/v1/users/login", {
                method : "POST",
                headers : {
                    "content-type" : "application/json"
                },
                body : JSON.stringify({
                    email,
                    username : email,
                    password
                })
            })

            if(response.ok) return response.json()
            else{
                throw new Error("something went wrong!!")
            }
    
        }catch(error){
            throw new Error(error?.message);
        }
    }

    async logout(){
        try{
            const response = await fetch("/api/v1/users/logout",{
                method: "POST"
            })
            if(response.ok) return response.json()
            else{
                throw new Error("something went wrong!!")
            }
    
        }catch(error){
            throw new Error(error?.message);
        }
    }

    async changePassword(formData) {
        try {
            const response =  fetch(`/api/v1/users/change-password`,{
                method : "POST",
                body : JSON.stringify(formData),
                headers : {
                    "content-type" : "application/json"
                }
            })
           if(response.ok) return response.json()
           else{
            throw new Error("something went wrong!!")
        }

    }catch(error){
        throw new Error(error?.message);
    }
    }

    async getCurrentUser(){
        try{
            
        const response = await fetch("/api/v1/users/current-user")

        if(response.ok) return response.json()
        else{
            throw new Error("something went wrong!!")
        }

    }catch(error){
        throw new Error(error?.message);
    }
        
    }

    async channelDashboard (channelId) {
        try {
            const response = await fetch(`/api/v1/dashboard/getchannel-stats/${channelId}`)

            if (response.ok) return response.json()

            else throw new Error("Something went wrong!")

        } catch (error) {
            throw new Error(error?.message)
        }
    }

    async refreshAccessToken () {
        try {
            const response = await fetch("/api/v1/users/refreshed-accesstoken",{
                method : "POST",
                
            })
            console.log(response)
           if(response.ok) return response.json();
            else{
            throw new Error("something went wrong!!")
        }

        }catch(error){
        throw new Error(error?.message);
    }
    }

    async deactivateAccount (){
        try {
            const response = await fetch('/api/v1/users/deactivate-account',
                {
                    method : "DELETE"
                }
            )
            if(response.ok) return response.json()
                else throw new Error("something went wrong")
        } catch (error) {
            throw error
            
        }
    }
}

const authService = new authServices()

export default authService