<template>
<div>helo</div>
  <v-btn variant="outlined" to="/createCourse">
    создать курсик
  </v-btn>
<!--<div>{{courses}}</div>-->
  <v-table class="table" theme="light">
    <thead>
    <tr>
      <th class="text-left">
        Название
      </th>
      <th class="text-left">
        Описание
      </th>
      <th class="text-left">
        Расписание
      </th>
      <th class="text-left">
        Кол-во часов
      </th>
      <th class="text-left">
        Дата создания
      </th>
      <th class="text-left">
        Дата редактирования
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="course in courses"
      :key="course.courseName"
    >
      <td>{{ course.courseName }}</td>
      <td>{{ course.courseDescription }}</td>
      <td>{{ course.schedule }}</td>
      <td>{{ course.numberOfHours }}</td>
      <td>{{ course.createDate }}</td>
      <td>{{ course.updateDate }}</td>
    </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import {ref, onMounted} from "vue";
import axios from "axios";

const courses = ref([]);

async function getAllCourses() {
  try {
    const response = await axios.get('/api/course/get');
    courses.value = response.data;
    console.log(courses.value)
  }
  catch(err) {
    console.error(err)
  }
}

onMounted(() => {
  getAllCourses();
})
</script>
<style>
.table {
  margin: 200px 300px;
}


</style>
