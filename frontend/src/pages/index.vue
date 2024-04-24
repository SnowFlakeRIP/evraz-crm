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
              <div class="pa-4">
                <v-select
                  label="Курс"
                  :items="courses.map(c => c.name)"
                  variant="outlined"
                  v-model="selCourse"
                  @update:modelValue="selGroup = ''"
                ></v-select>
                <v-select
                  label="Группа"
                  :items="selCourse ? courses.find(c => c.name === selCourse).groups.map(g => g.name) : []"
                  variant="outlined"
                  v-model="selGroup"
                ></v-select>
                <div style="display: flex; justify-content: space-between;">
                  <div style="display: grid">
                    <span>Начало</span>
                    <DatePicker mode="dateTime" is24hr v-model="start"></DatePicker>
                  </div>
                  <div style="display: grid">
                    <span>Конец</span>
                    <DatePicker mode="dateTime" is24hr v-model="end"></DatePicker>
                  </div>
                </div>
                <v-alert
                  type="error"
                  :text="checkError()"
                  v-if="!!checkError()"
                  variant="text"
                ></v-alert>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text="Отмена"
                  @click="isActive.value = false"
                ></v-btn>
                <v-btn
                  text="Добавить"
                  :disabled="!!checkError()"
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
  <v-navigation-drawer location="right" temporary v-model="info">
    <h3>{{curEvent.calendarId}}</h3>
    <h2>{{curEvent.description}}</h2>
  </v-navigation-drawer>
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


let courses = ref([
  {name: "майнкрафт", groups: [{name: "1 курс"},{name: "2 курс"},{name: "3 курс"}]},
  {name: "Курсы жития", groups: [{name: "4 курс"},{name: "5 курс"},{name: "6 курс"}]}
])
let selCourse = ref("")
let selGroup = ref("")
let value = ref(new Date())
let start = ref(new Date())
let info = ref(false)
let curEvent = ref({})
let end = ref(new Date(start.value.valueOf()+3600000))
function checkError() {
  switch (true) {
    case !selCourse.value:
      return "Укажите курс"
    case !selGroup.value:
      return "Укажите группу"
    case start.value.valueOf() > end.value.valueOf():
      return "Начало должно быть раньше конца";
    default:
      return null
  }
}
// let canAdd = computed(() => {
//   start.value.valueOf() <= end.value.valueOf()
// })
const calendarApp = window.calendarApp = createCalendar({
  selectedDate: formatDate(new Date(), false),
  locale: "ru-RU",
  views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
  defaultView: viewWeek.name,
  calendars: (() => {
    let c = {}
    let i = 0
    const colors = [
      {main: '#f9d71c', container: '#fff5aa', onContainer: '#594800'},
      {main: '#1ca1f9', container: '#abddff', onContainer: '#003659'},
      {main: '#1cf920', container: '#abffac', onContainer: '#005901'},
      {main: '#f91c3d', container: '#ffabb7', onContainer: '#59000d'},
      {main: '#6d1cf9', container: '#c7abff', onContainer: '#1e0059'},
    ]
    for (const course of courses.value) {
      c[course.name] = {colorName: "color"+i ,lightColors: colors[i%colors.length]}
      i++
    }
    console.log(c)
    return c
  })(),
  events: JSON.parse(localStorage.getItem("events") ?? "[]"),
  callbacks: {
    onRangeUpdate(range) {
      value.value = new Date(range.start)
    },
    onEventClick(calendarEvent) {
      curEvent.value = calendarEvent
      info.value = true
    },
    onEventUpdate(event) {
      updateEvents()
    }
  },
  plugins: [
    createDragAndDropPlugin(), createResizePlugin()
  ]
})

function formatDate(d, time = true) {
  let timestr = time ? ` ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}` : ""
  return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getDate().toString().padStart(2,"0")}${timestr}`
}

function makeEvent() {
  let id = Math.floor(Math.random()*10000)
  let [s,e] = [start.value, end.value]
  console.log(formatDate(s), formatDate(e))
  const event = {
    id,
    start: formatDate(s),
    end: formatDate(e),
    title: `${selCourse.value}: ${selGroup.value}`,
    calendarId: selCourse.value,
    description: selGroup.value,
  }
  console.log(event)
  calendarApp.events.add(event)
  updateEvents()
}

function updateEvents() {
  localStorage.setItem("events", JSON.stringify(calendarApp.events.getAll()))
}
</script>
