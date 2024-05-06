<template>
  <h3 class="name">Статистика</h3>

  <v-tabs
    v-model="tab"
    bg-color="primary"
  >
    <v-tab value="users">Пользователи</v-tab>
    <v-tab value="lessons">Занятия</v-tab>
    <v-tab value="payments">Платежи</v-tab>
  </v-tabs>

  <v-card-text>
    <v-window v-model="tab">
      <v-window-item value="users">
        <v-row>
          <v-col cols="3">
            <v-row no-gutters>
              <v-col cols="12">Укажите период</v-col>
              <v-col cols="5" class="ma-2">
                <v-text-field
                  label="С"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="5" class="ma-2">
                <v-text-field
                  label="По"
                  type="date"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row
          justify="center"
          no-gutters
        >
          <span>Укажите курс, которому нужно составить диаграмму</span>
        </v-row>

        <v-col cols="12">
          <v-combobox
            :items="['Собака без ножек','Майнкрафт','Роблокс']"
            density="comfortable"
            label="Название курса"
          ></v-combobox>
          <v-combobox
            :items="[1,2]"
            density="comfortable"
            label="Часть курса"
          ></v-combobox>
        </v-col>
        <div class="parentButton">
          <button @click="diagramUsers" class="button">Создать диаграмму</button>
        </div>
        <div v-if="usersActiveChart" class="diagram">
          <vue-apex-charts type="pie" width="800" :options="usersChart" :series="usersSeries"></vue-apex-charts>
        </div>
      </v-window-item>

      <v-window-item value="lessons">
        <v-row>
          <v-col cols="3">
            <v-row no-gutters>
              <v-col cols="12">Укажите период</v-col>
              <v-col cols="5" class="ma-2">
                <v-text-field
                  label="С"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="5" class="ma-2">
                <v-text-field
                  label="По"
                  type="date"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row
          justify="center"
          no-gutters
        >
          <span>Укажите курс, которому нужно составить диаграмму</span>
        </v-row>

        <v-col cols="12">
          <v-combobox
            :items="['Собака без ножек','Майнкрафт','Роблокс']"
            density="comfortable"
            label="Название курса"
          ></v-combobox>
          <v-combobox
            :items="[1,2]"
            density="comfortable"
            label="Часть курса"
          ></v-combobox>
        </v-col>
        <div class="parentButton">
          <button @click="diagramLessons" class="button">Создать диаграмму</button>
        </div>
      </v-window-item>

      <v-window-item value="payments">
        <v-row>
          <v-col cols="3">
            <v-row no-gutters>
              <v-col cols="12">Укажите период</v-col>
              <v-col cols="5" class="ma-2">
                <v-text-field
                  label="С"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="5" class="ma-2">
                <v-text-field
                  label="По"
                  type="date"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row
          justify="center"
          no-gutters
        >
          <span>Укажите курс, которому нужно составить диаграмму</span>
        </v-row>

        <v-col cols="12">
          <v-combobox
            :items="['Собака без ножек','Майнкрафт','Роблокс']"
            density="comfortable"
            label="Название курса"
          ></v-combobox>
          <v-combobox
            :items="[1,2]"
            density="comfortable"
            label="Часть курса"
          ></v-combobox>
        </v-col>
        <div class="parentButton">
          <button @click="diagramPayments" class="button">Создать диаграмму</button>
        </div>
      </v-window-item>
    </v-window>
  </v-card-text>
</template>

<script setup>
import {ref} from "vue";
import VueApexCharts from "vue3-apexcharts";

const tab = ref('users');

const usersActiveChart = ref(false);
const usersSeries = ref([]);
const usersChart = ref({
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Активные', 'Не активные'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
});
const lessonsSeries = ref([]);
const lessonsChart = ref({});
const paymentsSeries = ref([]);
const paymentsChart = ref({});

function diagramUsers() {
  usersSeries.value = [44, 55];
  usersActiveChart.value = true;
}

function diagramLessons() {

}

function diagramPayments() {

}
</script>

<style>

.name {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ababab;
  border-radius: 20px;
  font-style: italic;
}

.parentButton {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #131313;
  border-radius: 7px;
  padding: 8px;
  background-color: #e2efe2;
}

</style>
