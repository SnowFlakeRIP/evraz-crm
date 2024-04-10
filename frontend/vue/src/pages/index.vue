<template>
  <h3 class="left">Доукменты</h3>
  <h3 class="middle">Параметры</h3>
  <h3 class="right">Скачивание</h3>
  <div
    v-for="(document, docIndex) in documents">
    <div>{{document.name}}</div>
    <div><!-- date-->
      <!--  <v-date-picker></v-date-picker>-->
    </div>
    <div> <!-- dateStart-->
      <!--  <v-date-picker></v-date-picker>-->
    </div>
    <div> <!-- dateFinish-->
      <!--  <v-date-picker></v-date-picker>-->
    </div>
    <div> <!-- number-->
      <v-number-input
        :reverse="false"
        controlVariant="default"
        label=""
        :hideInput="false"
        :inset="false"

      ></v-number-input>
    </div>
    <button>скачать</button>
  </div>

</template>

<script setup>

let name = ref('');
let date = ref(null);
let dateStart = ref(null);
let dateFinish = ref(null);
let number = ref(null);

let documents = ref([
  {
    name: '',
    date: null,
    dateStart: null,
    dateFinish: null,
    number: null
  }
]);



</script>
