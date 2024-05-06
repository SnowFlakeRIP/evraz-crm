<template>
  <div class="container">
    <div class="centered">
      <v-text-field
      v-model="login" placeholder="Электронная почта/номер телефона"
      :rules="rules"
      hide-details="auto"
      label="Электронная почта/номер телефона"
    ></v-text-field>

      <v-text-field
      placeholder="Пароль"
      v-model="password" 
      :type="isPwd ? 'text' : 'password'"
      :rules="rules"
      hide-details="auto"
      label="Пароль"
      :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="isPwd = !isPwd"
    ></v-text-field>

      <v-btn @click="join">Войти</v-btn>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
export default{
  data(){
      return{
          login:"",
          password:"",
          isPwd : ref(false),
          rules: [
            value => !!value || 'Обязательно',
            value => (value && value.length >= 3) || 'Min 3 characters',
        ],
      }
  },
  methods:{
      async join(){
          let request = {
              phone:"89025493434",
              //email:"saksgs",
              password:"newPassword",
          }
          if(this.$data.login.includes("'")||this.$data.password.includes("'")){
            window.location.href = "https://www.youtube.com/watch?v=uSUT2STC4LE"
            alert("Не надо делать махинации")
            return
          }
          if(!(this.ValidMail(this.$data.login)||this.ValidPhone(this.$data.login))){
              return
          }
          console.log(request)
          await axios.post("http://192.168.1.104:3000/users/auth/login",request,{
              headers:{
                "Content-type":"application/json"
              }
          }).then((res)=>{
            console.log(res.data)
            localStorage.accessToken = res.data.accessToken
            localStorage.refreshToken = res.data.refreshToken


          })
          let data = {
            middleName:"newName",
            name:"name",
            phone:"+9999989",
            password :"password",
            age:2,
            lastName:'newLastName',
            role:3,
            email:"test"
          }
          await axios.put(`http://192.168.1.104:3000/users/admin/updateUser`,data,{
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
          return re.test(myPhone);;
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
  height: 10vh;
  transition-delay: 15ms;
}
button{
  text-align: center;
}
.q-btn {
z-index: 1; /* Установите значение z-index для кнопки */
}

</style>