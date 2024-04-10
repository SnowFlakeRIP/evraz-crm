<template>
  <div>
    <v-toolbar
      id="toolbar"
      border title
      color="white"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Расписание</v-toolbar-title>

      <v-btn>
        Сегодня
      </v-btn>

      <v-btn icon>
        <
      </v-btn>
      <v-btn icon>
        >
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
  <div>
    <v-btn
      rounded
      prepend-icon="mdi-plus"
      size="large"
    >
      Добавить
    </v-btn>

    <v-date-picker show-adjacent-months></v-date-picker>
    <div>Здесь будут сортировки</div>
  </div>
  <div>
    <div>
      <v-sheet
        class="d-flex"
        height="54"
        tile
      >
        <v-select
          v-model="type"
          :items="types"
          class="ma-2"
          label="View Mode"
          variant="outlined"
          dense
          hide-details
        ></v-select>
        <v-select
          v-model="weekday"
          :items="weekdays"
          class="ma-2"
          label="weekdays"
          variant="outlined"
          dense
          hide-details
        ></v-select>
      </v-sheet>
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="value"
          :events="events"
          :view-mode="type"
          :weekdays="weekday"
        ></v-calendar>
      </v-sheet>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const date = ref('')

function hideLeftMenu() {
}
</script>

<style>
</style>
