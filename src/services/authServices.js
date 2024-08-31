

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
           return response     
        }

    }catch(error){
        throw error;
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

            if(response.ok) return response

        }catch(error){
            throw error;
        }
    }

    async logout(){
        try{
            const response = await fetch("/api/v1/users/logout",{
                method: "POST"
            })
            return response.ok && response
        }catch(error){
            throw error
        }
    }

    async getCurrentUser(){
        try{
            
        const response = await fetch("/api/v1/users/current-user")

        if(response.ok) return response.json()
        
            
        }catch(error){
            console.log(error.message)
        }
        
    }
}

const authService = new authServices()

export default authService