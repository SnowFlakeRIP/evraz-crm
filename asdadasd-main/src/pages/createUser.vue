<template>
  <v-card
    class="mx-auto"
    max-width="344"
    title="Добавление пользователя"
  >
    <v-container>
      <v-text-field
        v-model="email"
        color="primary"
        label="Email"
        variant="underlined"
        :rules="rules"
      ></v-text-field>

      <v-text-field
        v-model="tgId"
        color="primary"
        label="Telegram Id"
        variant="underlined"
        :rules="rules"
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

      <v-text-field
        v-model="phone"
        color="primary"
        label="Телефон"
        variant="underlined"
        :rules="rules"
      ></v-text-field>

      <v-combobox
        v-model="role"
        label="Роль"
        :items="this.items"
      ></v-combobox>


      <v-text-field
        v-model="middle"
        color="primary"
        label="Фамилия"
        variant="underlined"
        :rules="rules"
      ></v-text-field>

      <v-text-field
        v-model="first"
        color="primary"
        label="Имя"
        variant="underlined"
        :rules="rules"
      ></v-text-field>

      <v-text-field
        v-model="last"
        color="primary"
        label="Отчество"
        variant="underlined"
        :rules="rules"
      ></v-text-field>

      <v-text-field
        v-model="age"
        color="primary"
        label="Возраст"
        variant="underlined"
        :rules="rules"
      ></v-text-field>


    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="success" @click="join">
        Создать пользователя


        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ref } from 'vue';
import axios from 'axios';

document.title="Создание пользователя"
export default{
  data() {
    return {
      email: "",
      tgId:"",
      password: "",
      phone: "",
      middle: "",
      first: "",
      last: "",
      age: "",
      role: "",
      roles: [],
      items: [],
      isPwd: false, // Исправлено на простое значение
      rules: [
        value => !!value || 'Обязательно',
        value => (value && value.length >= 2) || 'Min 2 characters',
      ],
    }
  },
  async mounted() {
    const response = await this.requester('http://192.168.1.104:3000/users/admin/getRoles','GET',null)
    console.log(response)
    this.roles = response.sendRoles
    this.items = this.roles.map(role=>role.roleValue)
    console.log(this.items)
    return{
      items:this.items,
    }
  },
  methods:{
    async requestParser(request){
      const response = request.data

      return response
    },

    async requester(url,method, body){
      switch(method){
        case "GET":
          try{
            const request = await axios.get(url,{
              headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
              }
            })
            return await this.requestParser(request)
          }catch(e){
            if (e.response.data.message === 'Access Token Invalid'){
              this.refresh()
              break
            }
          }
      }
    },
    join() {
      try {
        const numberRole = this.getRole(this.$data.role)
        const request = {
            userEmail: this.$data.email,
            tgId: this.$data.tgId,
            userPassword: this.$data.password,
            userPhone: this.$data.phone,
            userMiddleName: this.$data.middle,
            userName: this.$data.first,
            userLastName: this.$data.last,
            userAge: this.$data.age,
            role: numberRole,
          }

          axios.post("http://192.168.1.104:3000/users/admin/createUser", request, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer "+localStorage.accessToken
          }
        })
      }catch(e) {
        if (e.response.data.message == "Access Token Invalid") {
          this.refresh()
        } else {
          alert("Произошла ошибка", e.message)
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
      this.join()
    },
    ValidMail(myMail) {
      const re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
      return  re.test(myMail);
    },
    ValidPhone(myPhone) {
      const re = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
      return re.test(myPhone);
    },
    getRole(role){
      return  this.roles.find(Vrole => Vrole.roleValue === role).roleId
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
