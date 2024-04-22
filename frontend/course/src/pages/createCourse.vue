<script setup>
import { ref } from 'vue';

let name = ref('')
let description = ref('');
let numberOfHours = ref(null)
let schedule = ref('')
let rules = ref({
    required: value => !!value || 'Заполните поле',
})

let courses = ref([{
  name:'rrrrrrrrrrr',
  description:'ffhf',
  numberOfHours: 3
}])

function addCourse() {
  let course = {
    name: name.value,
    description: description.value,
    numberOfHours:numberOfHours.value,
    schedule:schedule.value
  }
  courses.value.push(course)
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
            label="Расписание"
            variant="outlined"
            placeholder="Например: пн 16:00-18:00 ср 16:00-18:00"
            type="email"
          ></v-text-field>
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
            variant="outlined"
            type="number"

          ></v-text-field>

        </v-responsive>
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
