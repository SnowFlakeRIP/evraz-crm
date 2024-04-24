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
                <v-text-field label="Название" variant="outlined" v-model="name"></v-text-field>
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
        <v-card class="pa-4">
          <v-select
            label="Курс"
            :items="([{title: 'Любой', value: ''}]).concat(courses.map(c => c.name))"
            variant="outlined"
            v-model="filter.course"
            @update:modelValue="filter.group = ''; updateEvents()"
            :hide-details="filter.course === ''"
          ></v-select>
          <v-select
            label="Группа"
            :items="([{title: 'Любая', value: ''}]).concat(courses.find(c => c.name === filter.course).groups.map(g => g.name))"
            variant="outlined"
            v-model="filter.group"
            v-if="filter.course !== ''"
            @update:modelValue="updateEvents"
            hide-details
          ></v-select>
        </v-card>
      </div>
      <div id="calendar" style="flex: 1; overflow-y: scroll; padding: 8px">
        <ScheduleXCalendar :calendar-app="calendarApp" />
      </div>
    </v-main>
  <v-navigation-drawer location="right" temporary v-model="info" class="www pa-4" width="max-content" style="max-width: 40vw">
    <span>{{curEvent.calendarId}} - {{curEvent.description}}</span>
<!--    <br>-->
    <span class="text-h4 font-weight-bold text-black">{{curEvent.title}}</span>
    <v-divider></v-divider>
    <div style="vertical-align: middle">
      <v-icon icon="mdi-clock-outline"/> <span style="vertical-align: middle">
      {{curEvent.start}} - {{curEvent.end}}
    </span>
    </div>
    <v-divider></v-divider>
    <v-btn variant="outlined" prepend-icon="mdi-open-in-new">Посещаемость</v-btn><br>
    <v-btn variant="outlined" prepend-icon="mdi-pencil">Редактировать</v-btn><br>
    <v-btn variant="outlined" prepend-icon="mdi-delete" color="error" @click="deleteCurrent">Удалить</v-btn>
  </v-navigation-drawer>
</template>

<style>
  .v-calendar-header {
    min-height: 0;
    padding: 4px 0
  }
  .www > .v-navigation-drawer__content > *:not(:last-child) {
    margin-bottom: 8px;
  }
  .www > .v-navigation-drawer__content > span {
    display: block;
  }
</style>

<script setup>
import { ScheduleXCalendar } from '@schedule-x/vue'
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
  {name: "майнкрафт", groups: [{name: "1 группа"},{name: "2 группа"},{name: "3 группа"}]},
  {name: "Курсы жития", groups: [{name: "4 группа"},{name: "5 группа"},{name: "6 группа"}]},
  {name: "Занятие где можно нихера не делать", groups: [{name: "7 группа"},{name: "8 группа"},{name: "9 группа"}]},
  {name: "Ищем печеньки", groups: [{name: "10 группа"},{name: "11 группа"},{name: "12 группа"}]},
  {name: "Пытаемся спасти Сашу", groups: [{name: "13 группа"},{name: "14 группа"},{name: "15 группа"}]},
])

let selCourse = ref("")
let selGroup = ref("")
let name = ref("")
let value = ref(new Date())
let start = ref(new Date())
let end = ref(new Date(start.value.valueOf()+3600000))

let info = ref(false)
let curEvent = ref({})
let events = ref(JSON.parse(localStorage.getItem("events") ?? "[]") ?? [])
let filter = ref({
  course: '',
  group: '',
})

function checkError() {
  switch (true) {
    case !selCourse.value:
      return "Укажите курс"
    case !selGroup.value:
      return "Укажите группу"
    case !name.value:
      return "Укажите название занятия"
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
  events: events.value,
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
})

function deleteCurrent() {
  if (!curEvent.value) return
  if (!confirm("Вы уверены?")) return //лень делать нормальный диалог пока что
  const i = events.value.findIndex(e => e.id === curEvent.value.id)
  events.value.splice(i, 1)
  info.value = false
  curEvent.value = {}
  updateEvents()
}

function formatDate(d, time = true) {
  console.log(d)
  let timestr = time ? ` ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}` : ""
  return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getDate().toString().padStart(2,"0")}${timestr}`
}

function makeEvent() {
  let id = Math.floor(Math.random()*10000)
  let [s,e] = [start.value, end.value]
  console.log(s,e)
  console.log(formatDate(s), formatDate(e))
  const event = {
    id,
    start: formatDate(s),
    end: formatDate(e),
    title: name.value,
    calendarId: selCourse.value,
    description: selGroup.value,
  }
  console.log(event)
  events.value.push(event)
  updateEvents()
}

function updateEvents() {
  calendarApp.events.set(events.value.filter(
    event =>
      (filter.value.course ? event.calendarId === filter.value.course : true) &&
      (filter.value.group ? event.description === filter.value.group : true)
  ))
  localStorage.setItem("events", JSON.stringify(events.value))
}
</script>
