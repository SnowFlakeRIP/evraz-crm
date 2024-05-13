<script setup>
import { useRouter } from 'vue-router'
import axios from "axios";

const router = useRouter();
try {
  const response = await axios.post('/api/openCourse/create',course);
  await router.push('/')
  // router.back();
  // courses.value = response.data;
  // console.log(courses.value)
}
catch(err) {
  console.error(err)
}

</script>

<template>
<div>higgggggggggggggggggggggggggggggg</div>
</template>

<style scoped>

</style>
