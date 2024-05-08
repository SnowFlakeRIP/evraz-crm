<template>
    <tr>
        <td>
          <v-text-field
            readonly
            disabled
            class="readonly custom-disabled-text"
            v-model="user.userEmail"
            color="primary"
            label="Почта"
          ></v-text-field>
       </td>
       <td>
         <v-text-field
           :readonly="isReadonly"
           :disabled="isDisabled"
           class="readonly custom-disabled-text"
           v-model="user.userPhone"
           color="primary"
           label="Телефон"
           :rules="phoneRules"
         ></v-text-field>
       </td>
       <td>
         <v-combobox
           label="Роль"
           v-model="user.stringRole"
           :items="this.$props.items"
           :readonly="isReadonly"
          :disabled="isDisabled"
         ></v-combobox>
       </td>
       <td>
         <v-text-field
           :readonly="isReadonly"
           :disabled="isDisabled"
           class="readonly"
           v-model="user.bioMiddleName"
           color="primary"
           label="Фамилия"
 
         ></v-text-field>
       </td>
       <td>
         <v-text-field
           :readonly="isReadonly"
           :disabled="isDisabled"
           class="readonly"
           v-model="user.bioName"
           color="primary"
           label="Имя"
 
         ></v-text-field>
       </td>
       <td>
         <v-text-field
           :readonly="isReadonly"
           :disabled="isDisabled"
           class="readonly"
           v-model="user.bioLastName"
           color="primary"
           label="Отчество"
 
         ></v-text-field>
       </td>
       <td>
          <v-text-field
            readonly
            disabled
            class="readonly custom-disabled-text"
            v-model="user.bioAge"
            color="primary"
            label="Возраст"
          ></v-text-field>
       </td>
       <td>
          <v-text-field
            :readonly="isReadonly"
           :disabled="isDisabled"
            class="readonly custom-disabled-text"
            v-model="user.newPassword"
            color="primary"
            label="Пароль"
          ></v-text-field>
       </td>
       <td>
         <v-btn color="success" :style="{ display: isReadonly ? 'none' : 'block'}"  @click="disableField">Сохранить</v-btn>
         <v-btn color="success" :style="{ display: isReadonly ? 'block' : 'none'}" @click="enableField">Редактировать</v-btn>
         <v-btn color="error" @click="deleteUser" >Удалить</v-btn>
       </td>
    </tr>
   </template>
   
   <script>
   import axios from 'axios'
   import { toRaw } from 'vue';

   export default {
    watch:{
      roles:{
        handler(newValue) {
        console.log(newValue);
        this.user.stringRole = newValue[this.user.userRole-1].roleValue
        },
      }
    },
    props: {
       user: Object,
       items:Array,
       roles:Array,
    },
    data() {
       return {
        editUser:{},
        rolesGeted:this.$props.roles,
         isReadonly: true,
         notReadonly:false,
         isDisabled: true,
         emailRules: [
            value => !!value || 'Обязательно',
            value => (/^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i).test(value) || 'Неверно указана почта',
        ],phoneRules:[
            value=> !!value || 'Обязательно',
            value =>(/^[\d\+][\d\(\)\ -]{4,14}\d$/).test(value)||'Неверно указан телефон'
        ]
       };
    },
    methods: {
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
            const request = await axios.post(url,body,{
              headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`          
              }
            })       
            return await this.requestParser(request)
          }catch(e){        
            console.log(e)
            if (e.response?.data?.message === 'Access Token Invalid'){
              await this.refresh()
                this.requester(url,method,body)
              break
            }
          }

          case "PUT":
          try{
            const request = await axios.put(url,body,{
              headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`          
              }
            })       
            return await this.requestParser(request)
          }catch(e){        
            console.log(e)
            if (e.response?.data?.message === 'Access Token Invalid'){
              await this.refresh()
              this.requester(url,method,body)
              break
            }
          }
      }},

      async deleteUser(){
        await this.requester("http://192.168.1.104:3000/users/admin/deleteUser","POST",{
            email:this.user.userEmail
          })
        this.$emit("delete")  
      },

      getRole(role){
        console.log(this.$props.roles.find(Vrole => Vrole.roleValue === role).roleId)
        return  this.$props.roles.find(Vrole => Vrole.roleValue === role).roleId
      },

      async requestParser(request){
        const response = request.data
        return response
      },



       enableField() {
         this.isReadonly = false;
         this.notReadonly = true;
         this.isDisabled = false;
       },


       async disableField() {
        try{
          if(!(/^[\d\+][\d\(\)\ -]{4,14}\d$/).test(this.user.userPhone)){
              alert("Неверно указан телефон!")
              return
          }
            let request = {
                email:this.user.userEmail,
                lastName:this.user.bioLastName,
                middleName:this.user.bioMiddleName,
                name:this.user.bioName,
                role:this.getRole(this.user.stringRole),
                phone:this.user.userPhone,
                age:this.user.bioAge,
                password:this.user.newPassword,
                tdId:undefined
          }
          this.user.newPassword = ""
         console.log(request)
        
        let res = await this.requester(`http://192.168.1.104:3000/users/admin/updateUser`,"PUT",request)
          console.log(res)
          this.isReadonly = true;
          this.notReadonly = false;
          this.isDisabled = true;
        }catch(e){
          console.log(e)
          if(e.response.data.message == "Access Token Invalid"){
            this.refresh()
          }else{
           alert("Произошла ошибка",e.message)
          }
        }
       }
    }
    
   }
   </script>
   
<style>
   .readonly {
    border: none; /* Убирает границу */
    outline: none; /* Убирает контур, который может появляться при фокусе */
    box-shadow: none; /* Убирает тень, которая может появляться при фокусе */
    background-color: transparent; /* Устанавливает прозрачный фон */
    color: inherit; 
   }
   .notActive{
    float: none;
    position: none;
    display: none ;
   }
   
</style>

