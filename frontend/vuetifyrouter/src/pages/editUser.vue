<template>
  <v-card
    class="mx-auto"
    max-width="344"
    title="Изменение пользователя"
  >
    <v-container>

      <!-- <v-text-field
        placeholder="Пароль"
        v-model="this.$data.user.password"
        :type="isPwd ? 'text' : 'password'"
        :rules="rules"
        hide-details="auto"
        label="Пароль"
        :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="isPwd = !isPwd"
      ></v-text-field> -->

      <v-text-field
        v-model="this.$data.user.userPhone"
        color="primary"
        label="Телефон"
        variant="underlined"
        :rules="  rules"
      ></v-text-field>

      <v-combobox
        label="Роль"
        v-model="this.$data.user.stringRole"
        :items="this.items"
      ></v-combobox>


      <v-text-field
        v-model="this.$data.user.bioMiddleName"
        color="primary"
        label="Фамилия"
        variant="underlined"
        :rules="rules"
      ></v-text-field>

      <v-text-field
        v-model="this.$data.user.bioName"
        color="primary"
        label="Имя"
        variant="underlined"
        :rules="rules"
      ></v-text-field>

      <v-text-field
        v-model="this.$data.user.bioLastName"
        color="primary"
        label="Отчество"
        variant="underlined"
        :rules="rules"
      ></v-text-field>

      <!-- <v-text-field -->
        <!-- v-model="this.$data.user.age" -->
        <!-- color="primary" -->
        <!-- label="Возраст" -->
        <!-- variant="underlined" -->
        <!-- :rules="rules" -->
      <!-- ></v-text-field> -->


    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="success" @click="save">
        Создать пользователя
        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ref } from 'vue';
import axios from 'axios';

export default{
  data() {
    return {
      user:{},
      role:"",
      isPwd: ref(false),
      emailRules: [
        value => !!value || 'Обязательно',
        value => (/^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i).test(value) || 'Неверно указана почта',
      ],pgoneRules:[
        value=> !!value || 'Обязательно',
        value =>(/^[\d\+][\d\(\)\ -]{4,14}\d$/).test(value)||'Неверно указана почта'
      ]
    }
  },
  async mounted(){
    this.getData()
  },
  methods:{
    async getData(){
      try{
        await axios.get(`http://192.168.1.104:3000/users/admin/getRoles`,{
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.accessToken
          }
        }).then((response)=>{
          this.roles = response.data.sendRoles
          this.items = this.roles.map(role=>role.roleValue)
        })

        await axios.get(`http://192.168.1.104:3000/users/admin/getUserInfo?email=${ this.$route.query.email }`,{
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.accessToken
          }
        }).then((response) =>{
          console.log(response.data.UserInfo);
          this.user = response.data.UserInfo;
          this.user.stringRole = this.roles.find(role => role.roleId === response.data.UserInfo.userRole).roleValue
          console.log(this.roles, response.data.UserInfo.userRole, this.roles.find(role => role.roleId === response.data.UserInfo.userRole));

        })
        console.log(this.getRole("Новая роль"))
         }catch(e){
          if(e.response.data.message == "Access Token Invalid"){
            this.refresh()
          }else{
            alert("Произошла ошибка",e.message)
          }
         }
    },

    getRole(role){
      return  this.roles.find(Vrole => Vrole.roleValue === role).roleId
    },
    async save(){
      console.log(this.stringRole)
      let request = {
        email:this.user.userEmail,
        lastName:this.user.bioLastName,
        middleName:this.user.bioMiddleName,
        name:this.user.bioName,
        role:this.getRole(this.user.stringRole),
        phone:this.user.userPhone,
        password:"password",
        age:123
      }
      console.log(request)

      await axios.put(`http://192.168.1.104:3000/users/admin/updateUser`,request,{
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.accessToken
      }
    })
      },

    ValidMail(myMail) {
      const re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
      return  re.test(myMail);
    },
    ValidPhone(myPhone) {
      const re = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
      return re.test(myPhone);
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
      console.log(this)
      this.getData()
    }

  }
  }

</script> 


<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Устанавливаем высоту контейнера равную высоте видимой области страницы */
}

.centered {
  width: 30vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 4px 4px 4px 6px rgb(130, 120, 120);
}
.centered *{

  margin: 5px;
}
input, .v-field__field{
  width: 30vw;
  height: 8.45vh;
  transition-delay: 15ms;
}
button{
  text-align: center;
}
.q-btn {
  z-index: 1; /* Установите значение z-index для кнопки */
}
</style>