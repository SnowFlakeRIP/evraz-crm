export default async function getRole(){
    try{
        const res = await axios.get("http://192.168.1.104:3000/users/auth/me",{
          headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.refreshToken
            }
        })
        return res.UserInfo.userRole
    }catch(e){
        
    }
}