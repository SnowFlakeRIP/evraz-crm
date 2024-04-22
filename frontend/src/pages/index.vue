<template>
    <v-toolbar>
  <!--      <v-btn class="ma-2">Сегодня</v-btn>-->
  <!--      <v-btn class="ma-1" icon="mdi-menu-left"/>-->
  <!--      <v-btn class="ma-1" icon="mdi-menu-right"/>-->
  <!--      <v-label class="ma-1">Месяц, Год</v-label>-->
      <v-text-field label="Поиск" hide-details class="ma-2"/>
    </v-toolbar>
    <v-main style="display: flex; flex-direction: row; height: calc(100vh - 64px); padding-bottom: 0">
      <div id="options" style="padding: 8px; display: flex; flex-direction: column; gap: 8px;">
        <v-dialog max-width="600">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              color="surface-variant"
              text="Добавить занятие"
              variant="outlined"
            ></v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card title="Добавить занятие">
              <v-text-field label="Название" required :model-value="name"></v-text-field>
              <div style="display: flex; justify-content: space-evenly;">
                <div style="display: grid">
                  <span>Начало</span>
                  <DatePicker mode="dateTime" is24hr v-model="start"></DatePicker>
                </div>
                <div style="display: grid">
                  <span>Конец</span>
                  <DatePicker mode="dateTime" is24hr v-model="end"></DatePicker>
                </div>
              </div>

              <v-text-field label="ХЗ" required></v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text="Отмена"
                  @click="isActive.value = false"
                ></v-btn>
                <v-btn
                  text="Добавить"
                  @click="makeEvent(); isActive.value = false"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <v-card>Сортировки</v-card>
      </div>
      <div id="calendar" style="flex: 1; overflow-y: scroll; padding: 8px">
        <ScheduleXCalendar :calendar-app="calendarApp" />
      </div>
    </v-main>
</template>

<style>
  .v-calendar-header {
    min-height: 0;
    padding: 4px 0
  }
</style>

<script setup>
import { ScheduleXCalendar } from '@schedule-x/vue'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from "@schedule-x/resize";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import {
  createCalendar,
  viewDay,
  viewWeek,
  viewMonthGrid,
  viewMonthAgenda,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';


let name = ref("jkfjks")
let value = ref(new Date())
let start = ref(new Date())
let end = ref(new Date(start.value.valueOf()+3600000))
const calendarApp = createCalendar({
  selectedDate: '2024-04-17',
  locale: "ru-RU",
  views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
  defaultView: viewWeek.name,
  events: (function () {
    let ev = []
    for (let i = 0; i < 5; i++) {
      ev.push({
        id: i,
        start: `2024-04-17 ${(i%24).toString().padStart(2,"0")}:00`,
        end: `2024-04-17 ${((i+1)%24).toString().padStart(2,"0")}:00`,
        title: `aaa ${i}`
      })
    }
    return ev
  }) (),
  callbacks: {
    onRangeUpdate(range) {
      value.value = new Date(range.start)
    },
    onEventClick(calendarEvent) {
      console.log('onEventClick', calendarEvent)
    },
  },
  plugins: [
    createDragAndDropPlugin(), createResizePlugin(), createEventModalPlugin()
  ]
})

function makeEvent() {
  let time = Math.floor(Math.random()*24)
  let id = Math.floor(Math.random()*10000)
  calendarApp.events.add({
    id,
    start: `2024-04-17 ${(time%24).toString().padStart(2,"0")}:00`,
    end: `2024-04-17 ${((time+1)%24).toString().padStart(2,"0")}:00`,
    title: `aaa ${id}`
  })
}
</script>
