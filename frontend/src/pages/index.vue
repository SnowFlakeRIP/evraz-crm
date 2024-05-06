<template>
  <v-toolbar>
    <!--      <v-btn class="ma-2">Сегодня</v-btn>-->
    <!--      <v-btn class="ma-1" icon="mdi-menu-left"/>-->
    <!--      <v-btn class="ma-1" icon="mdi-menu-right"/>-->
    <!--      <v-label class="ma-1">Месяц, Год</v-label>-->
    <v-text-field label="Поиск" hide-details class="ma-2" :disabled="loaded !== 'true'"/>
  </v-toolbar>
  <v-main class="main" v-if="loaded === 'true'">
    <div id="options" style="padding: 8px; display: flex; flex-direction: column; gap: 8px;">
      <v-dialog max-width="600" v-if="admin">
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
                :items="courses.map(c => {return {title: c.name, value: c.id}})"
                variant="outlined"
                v-model="selCourse"
                @update:modelValue="selGroup = null"
              ></v-select>
              <v-select
                label="Группа"
                :items="selCourse ? groups.filter(g => g.courseId === selCourse).map(g => {return {title: g.name, value: g.id}}) : []"
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
          :items="([{title: 'Любой', value: null}]).concat(courses.map(c => {return {title: c.name, value: c.id}}))"
          variant="outlined"
          v-model="filter.course"
          @update:modelValue="filter.group = null; updateEvents()"
          :hide-details="!filter.course"
        ></v-select>
        <v-select
          label="Группа"
          :items="([{title: 'Любая', value: null}]).concat(groups.filter(g => g.courseId === filter.course).map(g => {return {title: g.name, value: g.id}}))"
          variant="outlined"
          v-model="filter.group"
          v-if="filter.course"
          @update:modelValue="updateEvents"
          hide-details
        ></v-select>
      </v-card>
    </div>
    <div id="calendar" style="flex: 1; overflow-y: scroll; padding: 8px">
      <ScheduleXCalendar :calendar-app="calendarApp"/>
    </div>
  </v-main>
  <v-main class="main centerView" v-else>
    <div v-if="loaded === 'false'">
      <v-progress-circular :size="50" :width="5" indeterminate/>
    </div>
    <div v-else-if="loaded === 'error'">
      <v-alert
        type="error"
        text="Что-то пошло не так"
        variant="text"
      >
        <v-card-actions>
          <v-btn prepend-icon="mdi-sync" @click="loadData">Повторить</v-btn>
        </v-card-actions>
      </v-alert>
    </div>
  </v-main>
  <v-bottom-sheet inset v-model="info">
    <v-card>
      <div class="www pa-4">
        <span>{{ courses.find(c => c.id === curEvent.course).name }} - {{ groups.find(g => g.id === curEvent.group).name }}</span>
        <span class="text-h4 font-weight-bold text-black">{{ curEvent.name }}</span>
        <v-divider></v-divider>
        <div style="vertical-align: middle">
          <v-icon icon="mdi-clock-outline"/>
          <span style="vertical-align: middle">
          {{ formatDate(curEvent.start) }} - {{ formatDate(curEvent.end) }}
        </span>
        </div>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn prepend-icon="mdi-open-in-new">Посещаемость</v-btn>
          <!--        <br>-->
          <v-dialog max-width="600" v-if="admin">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" prepend-icon="mdi-pencil">Редактировать</v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card title="Редактировать занятие">
                <div class="pa-4">
                  <v-text-field label="Название" variant="outlined" v-model="editedEvent.name"></v-text-field>
                  <div style="display: flex; justify-content: space-between;">
                    <div style="display: grid">
                      <span>Начало</span>
                      <DatePicker mode="dateTime" is24hr v-model="editedEvent.start"></DatePicker>
                    </div>
                    <div style="display: grid">
                      <span>Конец</span>
                      <DatePicker mode="dateTime" is24hr v-model="editedEvent.end"></DatePicker>
                    </div>
                  </div>
                  <v-alert
                    type="error"
                    :text="checkError(true)"
                    v-if="!!checkError(true)"
                    variant="text"
                  ></v-alert>
                </div>
                <v-card-actions>
                  <v-btn
                    text="Удалить"
                    @click="() => {if (deleteCurrent()) isActive.value = false}"
                    color="error"
                  ></v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    text="Отмена"
                    @click="isActive.value = false"
                  ></v-btn>
                  <v-btn
                    text="Сохранить"
                    :disabled="!!checkError(true)"
                    @click="editEvent(); isActive.value = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            :color="curEvent.done ? 'info' : ''"
            :prepend-icon="curEvent.done ? 'mdi-check-circle' : 'mdi-check-circle-outline'"
            @click="curEvent.done = !curEvent.done; updateEvents()"
          >{{ curEvent.done ? "Закончено" : "Не проведено" }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-bottom-sheet>
</template>

<style>
.main {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
  padding-bottom: 0
}

.centerView {
  justify-content: center;
  align-items: center;
}

.v-calendar-header {
  min-height: 0;
  padding: 4px 0
}

.www > *:not(:last-child) {
  margin-bottom: 8px;
}

.www > span {
  display: block;
}

.sx__event:hover {
  cursor: pointer;
}
</style>

<script setup>
import {ScheduleXCalendar} from '@schedule-x/vue'
import {
  createCalendar,
  viewDay,
  viewWeek,
  viewMonthGrid,
  viewMonthAgenda,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import {Calendar, DatePicker} from 'v-calendar';
import 'v-calendar/style.css';


let courses = ref([
  {id: 1, name: "майнкрафт"},
  {id: 2, name: "Курсы жития"},
  {id: 3, name: "Занятие где можно нихера не делать"},
  {id: 4, name: "Ищем печеньки"},
  {id: 5, name: "Пытаемся спасти Сашу"},
])

let groups = ref((() => {
  let g = []
  for (let c of courses.value) {
    for (let i = (c.id-1)*3+1; i < (c.id-1)*3+4; i++) g.push({id: i, courseId: c.id, name: `${i} группа`})
  }
  return g
})())

console.log(groups.value)

let loaded = ref("true") //false, error, true
const api = `http://${location.hostname}:5000`

let admin = ref(true)
let selCourse = ref(null)
let selGroup = ref(null)
let name = ref("")
let value = ref(new Date())
let start = ref(new Date())
let end = ref(new Date(start.value.valueOf() + 3600000))

let info = ref(false)
let curEvent = ref({})
let editedEvent = ref({})
let events = ref(JSON.parse(localStorage.getItem("events") ?? "[]") ?? [])
let filter = ref({
  course: null,
  group: null,
})

function loadData() {
  loaded.value = 'true'
  setTimeout(() => {loaded.value = 'true'}, 2000)
}

function checkError(edit = false) {
  // if (edit) console.log(curEvent.value.start.valueOf(), curEvent.value.end.valueOf())
  switch (true) {
    case !selCourse.value && !edit:
      return "Укажите курс"
    case !selGroup.value && !edit:
      return "Укажите группу"
    case !(edit ? editedEvent.value.name : name.value):
      return "Укажите название занятия"
    case edit ? editedEvent.value.start.valueOf() > editedEvent.value.end.valueOf() : start.value.valueOf() > end.value.valueOf():
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
  views: [viewWeek, viewMonthGrid, viewMonthAgenda],
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
      c[course.id] = {colorName: "color" + i, lightColors: colors[i % colors.length]}
      i++
    }
    return c
  })(),
  callbacks: {
    onRangeUpdate(range) {
      value.value = new Date(range.start)
    },
    onEventClick(calendarEvent) {
      curEvent.value = events.value.find(e => e.id === calendarEvent.id)
      editedEvent.value = Object.assign({}, curEvent.value)
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
  return true
}

function formatDate(d, time = true) {
  if (!d) return "Invalid Date"
  if (!(d instanceof Date)) d = new Date(d)
  let timestr = time ? ` ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}` : ""
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}${timestr}`
}

function makeEvent() {
  let id = Math.floor(Math.random() * 10000)
  let [s, e] = [start.value, end.value]
  console.log(s, e)
  console.log(formatDate(s), formatDate(e))
  // const event = {
  //   id,
  //   start: formatDate(s),
  //   end: formatDate(e),
  //   title: name.value,
  //   calendarId: selCourse.value,
  //   description: selGroup.value,
  // }
  const event = {
    id,
    course: selCourse.value,
    group: selGroup.value,
    name: name.value,
    start: s,
    end: e,
    done: false,
  }
  console.log(event)
  events.value.push(event)
  updateEvents()
}

function editEvent() {
  const target = events.value.findIndex(e => e.id === curEvent.value.id)
  curEvent.value = Object.assign({}, editedEvent.value)
  events.value[target] = curEvent.value
  updateEvents()
}

function updateEvents() {
  const ev = events.value.filter(
    event =>
      (filter.value.course ? event.course === filter.value.course : true) &&
      (filter.value.group ? event.group === filter.value.group : true)
  ).map(event => {
    event.start = new Date(event.start)
    event.end = new Date(event.end)
    return {
      id: event.id,
      start: formatDate(event.start),
      end: formatDate(event.end),
      title: event.name,
      calendarId: event.course,
      description: event.group,
    }
  })
  console.log(ev)
  calendarApp.events.set(ev)
  localStorage.setItem("events", JSON.stringify(events.value))
}

updateEvents()

async function loadFromServer() {
  const data = await fetch(`${api}/schedule/all`, {method: "GET"})
  const j = await data.json()
  console.log(j)
}

loadFromServer()
</script>
