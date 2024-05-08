<template>
</template>
<script>
  import axios from 'axios';
  
  export default{
    data(){
        return{
            role:"",
        }
    },
    created(){
        this.role = localStorage.role
    },
    methods:{
      async checkToken() {
        if(localStorage.refreshToken){
            await axios.get("http://192.168.1.104:3000/users/auth/refresh",{
              headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.refreshToken
              }
            }).then((res)=>{
                localStorage.accessToken = res.data.accessToken
                localStorage.refreshToken = res.data.refreshToken
            }).catch(()=>{
                window.href.location="/login"
            })
            }
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
    height: 7.5vh;
    transition-delay: 15ms;
  }
  button{
    text-align: center;
  }
  .q-btn {
    z-index: 1; /* Установите значение z-index для кнопки */
  }
  </style>