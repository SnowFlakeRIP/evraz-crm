<template>
  <v-btn variant="outlined" to="/pageReferalProgramm">
    Реферальная программа
  </v-btn>
  <v-btn variant="outlined" to="/pageMyBonusSestema" >
    Моя накопительная система
  </v-btn>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>
