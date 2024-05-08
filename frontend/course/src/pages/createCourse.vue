<script setup>
import { ref } from 'vue';
import axios from "axios";
import { useRouter } from 'vue-router'

const router = useRouter();

let name = ref('')
let description = ref('');
let numberOfHours = ref(null)
let schedule = ref('')
let rules = ref({
    required: value => !!value || 'Заполните поле',
})

async function addCourse() {
  let course = {
    name:name.value,
    description:description.value,
    numberOfHours:numberOfHours.value,
    schedule:schedule.value
  }

  try {
    const response = await axios.post('/api/course/create',course);
    await router.push('/')
    // router.back();
    // courses.value = response.data;
    // console.log(courses.value)
  }
  catch(err) {
    console.error(err)
  }
}



</script>

<template>
  <div class="row">
    <h1>Создайте курс</h1>
    <div class="fields">
      <div class="field">
        <v-responsive
          class="mx-auto"
          max-width="344"

        >
          <v-text-field
            class="block"
            :rules="[rules.required]"
            v-model="name"
            label="Название"
            variant="outlined"

          ></v-text-field>
        </v-responsive>
      </div>
      <div >
        <v-responsive
          class="mx-auto"
          max-width="344"
        >
          <v-textarea
            class="block"
            :rules="[rules.required]"
            bg-color="amber-lighten-4"
            color="orange orange-darken-4"
            label="Описание"
            variant="outlined"
            v-model="description"
          ></v-textarea>
        </v-responsive>
      </div>
      <div>
        <v-responsive
          class="mx-auto"
          max-width="344"
        >
          <v-text-field
            class="block"
            :rules="[rules.required]"
            hide-details="auto"
            label="Кол-во часов в занятии"
            v-model="numberOfHours"
            variant="outlined"
            type="number"

          ></v-text-field>

        </v-responsive>
      </div>
      <div>
        <v-select
          label="Select"
          :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
          variant="outlined"
        ></v-select>
      </div>
      <div>
        <v-responsive
          class="mx-auto"
          max-width="344"
        >
          <v-btn @click="addCourse" variant="outlined">
            Добавить курс
          </v-btn>
        </v-responsive>
      </div>
    </div>
  </div>
</template>

<style>
.block {
  padding-top: 35px;
  }


</style>
