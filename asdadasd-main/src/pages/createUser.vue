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
      login: "",
      password: "",
      email:"",
      phone:"",
      middle:"",
      first:"",
      last:"",
      age:"",
      role:"",

      isPwd: ref(false),
      rules: [
        value => !!value || 'Обязательно',
        value => (value && value.length >= 2) || 'Min 2 characters',
      ],
    }
  },
  async mounted() {
    const response = await axios.get(`http://192.168.1.104:3000/users/admin/getRoles`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3MTI3NTM0NDIsImV4cCI6MTcxMjc1NTI0Mn0.XqSpf900OUHTUq34-xIWoJFtmV8_XAB5JtMI07yBZv4"
      }
    }).then((response) => {
      this.roles = response.data.sendRoles
      this.items = this.roles.map(role => role.roleValue)
    })
  },
  methods:{
    join(
      email,password,phone,middle,first,last,age,role
    ){
      const numberRole=this.getRole(this.$data.role)
      const request = {
        userEmail: this.$data.email,
        userPassword: this.$data.password,
        userPhone: this.$data.phone,
        userMiddleName: this.$data.middle,
        userName: this.$data.first,
        userLastName: this.$data.last,
        userAge: this.$data.age,
        role: numberRole,
      }
      axios.post("http://192.168.1.104:3000/users/admin/createUser",request,{
        headers:{
          "Content-Type":"application/json",
          Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJpYXQiOjE3MTI3NTM0NDIsImV4cCI6MTcxMjc1NTI0Mn0.XqSpf900OUHTUq34-xIWoJFtmV8_XAB5JtMI07yBZv4"
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
