<template>
    <v-data-table
      :items="this.allUsers"
      :headers="headers"
      :footer-props="{
      'items-per-page-options': [3],
      'items-per-page-text': 'Элементов на странице:'
    }"
    >
    <template v-slot:top>
       <v-btn  @click="createUser"color="success" fab dark >Создать пользователя</v-btn>
     </template>

      <template v-slot:item="{ item }">
        <user @delete = "deleteUser" v-bind:roles="roles" v-bind:user="item" v-bind:items="items"></user>
      </template>

   </v-data-table>
  </template>
  <script>
  import axios from "axios"
  import user from "../components/user.vue"
  import { ref } from "vue";
  import checkToken from "@/checkToken";
  import getRole from "@/getRole";
    export default{
      async mounted(){
          await checkToken()
          console.log(await getRole())
          if(await getRole()!=3){
            //window.location.href = "/login"
            return
          }
          await this.getData()
          document.querySelector(".v-data-table-footer__items-per-page span").innerHTML = "Пользователей на странице"
      },
      methods:{
        
        createUser(){
          window.location.href = "/createUser"
        },
        async deleteUser(email){
          console.log("request")
          this.getData()
        },
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
              body:body,
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
              
              this.items = this.roles.map(role=>role.roleValeu)
              console.log(this.items);
              console.log(this.roles)

              return{
                  users,
                  userFilter,

              }
             
            }catch(e){
              if(e.response?.data?.message == "Access Token Invalid"){
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
          data(){
            return{
              roles:[],
              items:[],
              allUsers: ref([
              ]),
              headers:[
            {
              title:"Почта",
              value:"userMail"
            },
            {
              title:"Телефон",
              value:"userPhone"
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
              title:"Пароль"
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