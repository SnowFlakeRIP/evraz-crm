<template>

  <v-data-table
      :items="this.allUsers"
      :footer-props="{ 'items-per-page-options': [3] }"
      :headers="headers"
   >

    <template v-slot:top>
    </template>
  
      <template v-slot:item="{ item }">
        <user v-bind:user="item" v-bind:roles="this.$data.roles" v-bind:items="this.items"></user>
      </template>

   </v-data-table>
  </template>
  <script>
  import axios from "axios"
  import user from "../components/user.vue"
import { ref } from "vue";
      export default{

        methods:{
          async requestParser(request){
            const response = request.data

            return response
          },

      async requester(url,method, body){
        switch(method){
          case "GET":
          try{
            console.log(true)
            const request = await axios.get(url,{headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`          
              }
            })
            console.log('req :' ,request)
            const response =  await this.requestParser(request)
            return response
          }catch(e){        
            if (e.response?.data?.message === 'Access Token Invalid'){
              await this.refresh()
              this.requester(url,method,body)

              break
            }
          }
          case "POST":
          try{
            const request = await axios.post(url,{
              data:data,
              headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`          
              }
            })       
            return await this.requestParser(request)
          }catch(e){        
            if (e.response?.data?.message === 'Access Token Invalid'){
              await this.refresh()
              this.requester(url,method,body)
              break
            }
          }
      }},
          async getData(){
            try{
            let users;
              let totalPages;
  
              await axios.get(`http://192.168.1.104:3000/users/admin/allUsers/`,{
                headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.accessToken
                }
              }).then((response)=>{
                users = response.data.result
                
                totalPages = response.data.totalPages
              })
              let userFilter = users
              this.allUsers =[];
  
  
              for( let keys in users){
                users[keys].forEach(user => {
                  let tuPush = {
                    ...user.currentBio,
                    ...user.currentUser
                  }
                  this.allUsers.push(tuPush)
                });
              }

              let response = await this.requester(`http://192.168.1.104:3000/users/admin/getRoles`,"GET",null)
              
              this.$data.roles = response.sendRoles
              console.log( JSON.parse(JSON.stringify(this.roles)))
              this.items = this.roles.map(role=>role.roleValue)
              return{
                  users,
                  userFilter
              }
              
            }catch(e){
              if(e.response.data.message == "Access Token Invalid"){
                this.refresh()
              }else{
               alert("Произошла ошибка",e.message)
              }
            }

          },

          async refresh(){
          const res = await axios.get("http://192.168.1.104:3000/users/auth/refresh",{  
            headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.refreshToken
              }
            })

            localStorage.accessToken = res.data.accessToken
            localStorage.refreshToken = res.data.refreshToken
            this.getData()
          }
        },
        components:{
          user
        },
          async mounted(){

              this.getData()
             
          },
          data(){
            return{
              roles:[],
              items:[],
              allUsers: ref([
              ]),
              headers:[
            {
              title:"Почта"
            },
            {
              title:"Телефон"
            },
            {
              title:"Роль"
            },
            {
              title:"Фамилия"
            },
            {
              title:"Имя"
            },
            {
              title:"Отчество"
            },
            {
              title:"Возраст"
            },
            {
              title:"Действия"
            }
          ]
            }
          },
      }
  </script>
  <style>
td {
 border-right: 1px solid #ff0000; /* Выберите цвет границы по вашему усмотрению */
}
</style>