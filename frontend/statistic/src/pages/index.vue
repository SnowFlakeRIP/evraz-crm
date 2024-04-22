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
          <button @click="diagram" class="button">Создать диаграмму</button>
        </div>
      </v-window-item>

      <v-window-item value="lessons">
        Two
      </v-window-item>

      <v-window-item value="payments">
        Three
      </v-window-item>
    </v-window>
  </v-card-text>
</template>

<script setup>
import {ref} from "vue";

const tab = ref('users');

function diagram(){

}
</script>

<style>

.name{
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ababab;
  border-radius: 20px;
  font-style: italic;
}

.parentButton{
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.button{
  border: 1px solid #131313;
  border-radius: 7px;
  padding: 8px;
  background-color: #e2efe2;
}

</style>
