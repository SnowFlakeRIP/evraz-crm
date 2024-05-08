<template>
  <div>helo</div>
  <v-btn variant="outlined" to="/createCourse">
    создать курсик
  </v-btn>
  <!--<div>{{courses}}</div>-->
  <v-table class="table courses" theme="light">
    <thead>
    <tr>
      <th class="text-left">
        Название
      </th>
      <th class="text-left">
        Описание
      </th>
<!--      <th class="text-left">-->
<!--        Расписание-->
<!--      </th>-->
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
      style="cursor: pointer;"
    >
      <td>{{ course.courseName }}</td>
      <td>{{ course.courseDescription }}</td>
<!--      <td>{{ course.schedule }}</td>-->
      <td>{{ course.numberOfHours }}</td>
      <td>{{ formatDate(course.createDate, true) }}</td>
      <td>{{ formatDate(course.updateDate, true) }}</td>
    </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import {ref, onMounted} from "vue";
import axios from "axios";
import {formatDate} from "@/scripts/date";

const courses = ref([]);

async function getAllCourses() {
  try {
    const response = await axios.get('/api/course/get');
    // Array.prototype.reverse(response.data)
    courses.value = response.data.reverse();
    console.log(courses)
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  getAllCourses();
})
</script>

<style lang="scss">
.table {
  margin: 200px 300px;
}

.courses {
  tbody {
    tr {
      &:hover {
        background-color: rgba(0, 0, 0, .05);
      }
    }
  }
}
</style>
