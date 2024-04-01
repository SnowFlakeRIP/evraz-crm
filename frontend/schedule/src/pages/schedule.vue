<template>
  <div id="left-menu">
    <v-btn prepend-icon="$vuetify">
      Добавить
    </v-btn>
    <v-date-picker></v-date-picker>
    <div id="sorts"></div>
    Здесь будут сортировки
  </div>
</template>

<script setup>
import { ref } from 'vue';

function hideLeftMenu() {

}
</script>

<style>
#head {
  background-color: lightgray;
  height: 10%;
  width: 100%;
}
</style>
