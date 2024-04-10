<template>
  <input type="number" v-model="idish">
  <button @click="reload">обновить</button>
  <div
    class="chat"
    v-for="message in message"
  >
    <div>{{message.messageValue}}</div>
  </div>
</template>
<style>

</style>
<script setup>
import axios from "axios";
let idish = 1;
let message = []
let body={
  userId:idish
}
async function reload(){
  const response = await axios.post("/api/chat/update", body);
  console.log(response.data)

}
</script>
