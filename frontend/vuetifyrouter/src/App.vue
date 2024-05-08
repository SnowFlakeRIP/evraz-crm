<template>
  <v-app>
      <v-app-bar  v-if="menu !== 'none'" app color="primary" dark>
        <v-toolbar-title>
          <v-list-item link href="/">
            <v-list-item-title>СРМ</v-list-item-title>
          </v-list-item>
        </v-toolbar-title>
      </v-app-bar>


      <v-navigation-drawer class="menu" app v-model="drawer" color="primary" dark  v-if="role != 'false'">
        <v-list v-if="role == '3'">
          <v-list-item link href="/tableUsers">
            <v-list-item-title>Таблица пользователей</v-list-item-title>
          </v-list-item>
          <v-list-item link href="#">
            <v-list-item-title>Уведомления</v-list-item-title>
          </v-list-item>
          <v-list-item link href="#">
            <v-list-item-title>Документы</v-list-item-title>
          </v-list-item>
          <v-list-item link href="/createCurses">
            <v-list-item-title>Создание курсов</v-list-item-title>
          </v-list-item>
        </v-list>


        <v-list class="menu" app v-model="drawer" color="primary" dark v-if="role === '2'">
          <v-list-item link href="/timetable">
            <v-list-item-title>Расписание</v-list-item-title>
          </v-list-item>
        </v-list>


        <v-list class="menu" app v-model="drawer" color="primary" dark v-if="role === '1'">
          <v-list-item link href="/tableUsers">
            <v-list-item-title>Реферальная система</v-list-item-title>
          </v-list-item>
          <v-list-item link href="#">
            <v-list-item-title>Расписание</v-list-item-title>
          </v-list-item>
        </v-list>

        <!-- <v-spacer></v-spacer> 
        <v-btn icon @click="toggleDrawer">
           <v-icon>mdi-menu</v-icon> 
        </v-btn> -->
      </v-navigation-drawer>

      

      <v-main>
        <router-view />
      </v-main>
      <!-- <v-btn icon @click="expandDrawer">
          <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-btn icon @click="collapseDrawer">
          <v-icon>mdi-chevron-left</v-icon> 
      </v-btn> -->
  </v-app>
 </template>
 
 <script>
import axios from 'axios';
import { ref } from 'vue';

 export default {
  data(){
    return{
        menu:ref(""),
        role:ref("") // Используйте значение по умолчанию
    }
  },
  mounted(){
    // axios.get("http://192.168.1.104:3000/users/admin/teachers",{
    //   headers:{
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    //   }
    // })

    this.role = localStorage.role
    console.log(this.role)
  }, 
  methods: {
    toggleDrawer() {
        this.drawer = !this.drawer; // Переключаем состояние
    },
    expandDrawer() {
        this.isDrawerPermanent = true; // Разворачиваем боковую панель
    },
    collapseDrawer() {
        this.isDrawerPermanent = false; // Сворачиваем боковую панель
    },
    // Остальные методы...
}
   // Остальные методы...
  }

 </script>