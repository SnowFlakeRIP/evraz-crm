<template>
  <v-app>
     <v-app-bar app color="primary" dark>
       <v-toolbar-title>Название сайта</v-toolbar-title>
     </v-app-bar>
     <v-navigation-drawer app v-model="drawer" color="primary" dark>
       <v-list>
         <v-list-item link href="#">
           <v-list-item-title>Пункт 1</v-list-item-title>
         </v-list-item>
         <v-list-item link href="#">
           <v-list-item-title>Пункт 2</v-list-item-title>
         </v-list-item>
         <v-list-item link href="#">
           <v-list-item-title>Пункт 3</v-list-item-title>
         </v-list-item>
       </v-list>
     </v-navigation-drawer>
     <v-main>
       <router-view />
     </v-main>
  </v-app>
 </template>
 
 <script>
 export default {
  data: () => ({
     drawer: null,
  }),
  mounted(){
    console.log()
  }
 };
 </script>
 <style>

</style>