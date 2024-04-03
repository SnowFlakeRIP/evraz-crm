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
      ></v-text-field>

      <v-text-field
        v-model="password"
        color="primary"
        label="Пароль"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="phone"
        color="primary"
        label="Телефон"
        variant="underlined"
      ></v-text-field>

      <v-combobox
        label="Роль"
        :items="['Ученик', 'Учитель', 'Администратор']"
      ></v-combobox>


      <v-text-field
        v-model="middle"
        color="primary"
        label="Фамилия"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="first"
        color="primary"
        label="Имя"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="last"
        color="primary"
        label="Отчество"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="age"
        color="primary"
        label="Возраст"
        variant="underlined"
      ></v-text-field>


    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="success">
        Создать пользователя

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import axios from 'axios';
import { ref } from 'vue';

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

      isPwd: ref(false),
      rules: [
        value => !!value || 'Обязательно',
        value => (value && value.length >= 3) || 'Min 3 characters',
      ],
    }
  }};






</script>


<style scoped>

</style>
