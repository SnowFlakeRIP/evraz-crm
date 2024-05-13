<template>
</template>
<script>
  import axios from 'axios';
  import getRole from "@/getRole.js"
  import checkToken from "@/checkToken"
  export default{
    data(){
        return{
            role:"",
        }
    },
    async created(){
      console.log(2)
      await checkToken()
      if(!getRole()){
        window.location.href = "/login"
      }
      this.role = getRole()
    },
    methods:{
      
    }
    }
  
  </script>
  
  
  <style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; 
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
    z-index: 1;
  }
  </style>