<template>

<v-data-table
    :items="userFilter"

 >
 </v-data-table>
</template>
<script>
import axios from "axios"
    export default{
        async mounted(){
            let users;
            let totalPages;

            await axios.get(`http://192.168.1.104:3000/users/admin/allUsers/`,{
              headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.accessToken
              }
            }).then((response)=>{
              users = response.data.sendResult

              console.log(response)
              console.log(users)
              
              totalPages = response.data.totalPages
            })
            let userFilter = users
            return{
                users,
                userFilter
            }
        }
    }
</script>