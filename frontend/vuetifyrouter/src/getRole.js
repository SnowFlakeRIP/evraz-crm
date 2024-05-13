import axios from "axios"
export default async function getRole(){
    try{
        const res = await axios.get("http://192.168.1.104:3000/users/auth/me",{
          headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.accessToken
            }
        })
        localStorage.role = res.data.UserInfo.userRole
        return res?.data.UserInfo?.userRole
    }catch(e){
        console.log(e)
        //swindow.location.href  = "/login"
    }
}