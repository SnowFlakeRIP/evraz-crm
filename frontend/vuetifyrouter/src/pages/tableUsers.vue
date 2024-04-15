<template>

  <v-data-table
      :items="this.allUsers"
      :footer-props="{ 'items-per-page-options': [3] }"
   >

    <template v-slot:top>
    </template>
  
      <template v-slot:item="{ item }">
        <user></user>
      </template>

   </v-data-table>
  </template>
  <script>
  import axios from "axios"
  import user from "../components/user.vue"
import { ref } from "vue";
      export default{
        components:{
          user
        },
          async mounted(){
              let users;
              let totalPages;
  
              await axios.get(`http://192.168.1.104:3000/users/admin/allUsers/`,{
                headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.accessToken
                }
              }).then((response)=>{
                users = response.data.result
  
                console.log(response)
                console.log(users)
                
                totalPages = response.data.totalPages
              })
              let userFilter = users
              this.allUsers =[];
  
  
              for( let keys in users){
                console.log(keys)
                users[keys].forEach(user => {
                  let tuPush = {
                    ...user.currentBio,
                    ...user.currentUser
                  }
                  this.allUsers.push(tuPush)
                });
              }
              console.log(this.allUsers)
  
              return{
                  users,
                  userFilter
              }
          },
          data(){
            return{
              allUsers: ref([
                  123,213,1231,2312,321,3
              ]
            ),

            headers: [
             
            ],
            }
          }
      }
  </script>
  <style>
td {
 border-right: 1px solid #ff0000; /* Выберите цвет границы по вашему усмотрению */
}
</style>