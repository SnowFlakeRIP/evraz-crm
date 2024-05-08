<template>
  <div class="container">
    <div class="centered">
      <v-text-field
      v-model="login"
      placeholder="Электронная почта/номер телефона"
      :rules="rules"
      :error-messages = "error"
      label="Электронная почта/номер телефона"
    ></v-text-field>

      <v-text-field
      placeholder="Пароль"
      v-model="password" 
      :type="isPwd ? 'text' : 'password'"
      label="Пароль"
      :rules = "passwordRules"
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
  mounted(){
    localStorage.role = false
    console.log(localStorage.role)
  },
  data(){
      return{
          login:"",
          password:"",
          error:"",
          isPwd : ref(false),
          rules:[
            value=> !!value || 'Обязательно',
            value =>((/^[\d\+][\d\(\)\ -]{4,14}\d$/).test(value)||(/^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i).test(value))||'Неверно указан телефон или почта'
        ],
          passwordRules:[
              value=> !!value || 'Обязательно',
              value => (value && value.length >= 2) ||'Неверно указан телефон или почта'
          ]
      }
  },
  methods:{
      async join(){
          let request = {
              password:this.password,
          }
          if(this.$data.login.includes("'")||this.$data.password.includes("'")) {
            //window.location.href = "https://www.youtube.com/watch?v=uSUT2STC4LE"
            return alert("Не надо делать махинации")
          }
          if(!(this.ValidMail(this.$data.login)||this.ValidPhone(this.$data.login))) {
              return
          }
          if(this.ValidMail(this.$data.login)) {
            request.email = this.login
          }
          else {
            request.phone = this.login
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

            axios.get("http://192.168.1.104:3000/users/auth/me",{  
            headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.accessToken
              }
            }).then((req)=>{
              console.log(req)
              localStorage.role = req.data.UserInfo.userRole

              window.location.href = "/"
            })
           
          }).catch((err)=>{
            console.log(err)
            if(!err.response?.data?.message){
              alert("Произошла ошибка, попробуйте позже")
              return
            }
            this.error = err.response.data.message
            console.log(err.response.data.message)
            console.log(err)
            return 

          })

      },
      ValidMail(myMail) {
          const re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
          return  re.test(myMail);
      },
      ValidPhone(myPhone) {
          const re = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
          return re.test(myPhone);;
      },
      

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