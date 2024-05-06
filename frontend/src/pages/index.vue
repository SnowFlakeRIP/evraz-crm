<template>
  <v-toolbar>
    <!--      <v-btn class="ma-2">Сегодня</v-btn>-->
    <!--      <v-btn class="ma-1" icon="mdi-menu-left"/>-->
    <!--      <v-btn class="ma-1" icon="mdi-menu-right"/>-->
    <!--      <v-label class="ma-1">Месяц, Год</v-label>-->
    <v-btn icon="mdi-menu" @click="showMenu = !showMenu"/>
    <v-spacer></v-spacer>
    <v-text-field label="Поиск" hide-details class="ma-2" :disabled="loaded !== 'true'" v-model="search" @update:model-value="updateFilter">
      <v-menu activator="parent">
        <v-list>
          <v-list-item
            v-for="item in filterSearch"
            :key="item.id"
            :value="item.id"
            @click="openEvent(item.id)"
            v-if="filterSearch.length > 0"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ courses.find(c => c.id === item.course).name }} - {{ groups.find(g => g.id === item.group).name }} ({{ formatDate(item.start, true, true) }} - {{ formatDate(item.end, true, true) }})
            </v-list-item-subtitle>
          </v-list-item>
          <v-label class="pa-3" v-else>Ничего не найдено</v-label>
        </v-list>

      </v-menu>
    </v-text-field>
  </v-toolbar>
  <v-main class="main" v-if="loaded === 'true'">
    <div id="options" style="padding: 8px; display: flex; flex-direction: column; gap: 8px; width: 15vw" v-if="showMenu">
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
                :disabled="isProcessing"
                @click="isActive.value = false"
              ></v-btn>
              <v-btn
                text="Добавить"
                :disabled="!!checkError() || isProcessing"
                @click="postEvent().then(r => {isActive = false})"
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
          <v-btn prepend-icon="mdi-sync" @click="getEvents">Повторить</v-btn>
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
              <v-btn v-bind="activatorProps" prepend-icon="mdi-pencil" :disabled="isProcessing">Редактировать</v-btn>
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
                    :disabled="isProcessing"
                    @click="() => {deleteEvent().then(r => {if (r) isActive.value = false})}"
                    color="error"
                  ></v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    text="Отмена"
                    :disabled="isProcessing"
                    @click="isActive.value = false"
                  ></v-btn>
                  <v-btn
                    text="Сохранить"
                    :disabled="!!checkError(true) || isProcessing"
                    @click="putEvent().then(r => {isActive.value = false})"
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
            :disabled="isProcessing"
            @click="editedEvent.done = !curEvent.done; putEvent(false)"
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
import {ref, computed} from "vue"
import {fi} from "vuetify/locale";


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

let loaded = ref("false") //false, error, true
const api = `http://${location.hostname}:5000` //todo: перенести апи на один порт

let admin = ref(true)
let showMenu = ref(true)
let selCourse = ref(null)
let selGroup = ref(null)

let search = ref("")
let filterSearch = ref([])
function updateFilter() {filterSearch.value = events.value.filter(e =>
  e.name.toLowerCase().startsWith(search.value)
  || courses.value.find(c => c.id === e.course).name.toLowerCase().startsWith(search.value)
  || groups.value.find(g => g.id === e.group).name.toLowerCase().startsWith(search.value)
)}

let name = ref("")
let value = ref(new Date())
let start = ref(new Date())
let end = ref(new Date(start.value.valueOf() + 3600000))
let isProcessing = ref(false)

let info = ref(false)
let curEvent = ref({})
let editedEvent = ref({})
let events = []
let filter = ref({
  course: null,
  group: null,
})

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

let calendarApp = window.calendarApp = createCalendar({
  selectedDate: formatDate(value.value, false),
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
      openEvent(calendarEvent.id)
    }
  },
})

function dayOfYear(date) {
  return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
}

function formatDate(d, time = true, short = false) {
  if (!d) return "Invalid Date"
  if (!(d instanceof Date)) d = new Date(d)
  const today = new Date()
  const [todayD, todayY] = [dayOfYear(today), today.getFullYear()]
  const [otherD, otherY] = [dayOfYear(d), d.getFullYear()]
  let datestr = (short && todayD === otherD && todayY === otherY) ? "" : `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
  let timestr = time ? `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}` : ""
  return `${datestr}${datestr && timestr ? " " : ""}${timestr}`
}

function updateEvents() {
  //todo: обновление списка событий ломает выбор даты в календаре. почему???????????????????????????????????????????????
  events.value.filter(
    event =>
      (filter.value.course ? event.course === filter.value.course : true) &&
      (filter.value.group ? event.group === filter.value.group : true)
  ).forEach(event => {
    event.start = new Date(event.start)
    event.end = new Date(event.end)
    const exist = calendarApp.events.get(event.id)
    calendarApp.events[exist ? "update" : "add"]({
      id: event.id,
      start: formatDate(event.start),
      end: formatDate(event.end),
      title: event.name,
      calendarId: event.course,
      description: event.group,
    })
  })
  search.value = ""
  updateFilter()
}

async function getEvents() {
  loaded.value = "false"
  isProcessing.value = true
  const data = await fetch(`${api}/schedule/all`, {method: "GET"})
  if (data.status !== 200) {
    loaded.value = "error"
    isProcessing.value = false
    return
  }
  const json = await data.json();
  events.value = [];
  (json.lessons ?? []).forEach(event => {
    console.log(event)
    events.value.push({
      id: +event.id,
      course: groups.value.find(g => g.id == event.groupId).courseId,
      group: +event.groupId,
      name: event.name,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      done: event.isDone
    })
  })
  // calendarApp = window.calendarApp = calendar()
  loaded.value = "true"
  isProcessing.value = false
  updateEvents()
}

async function postEvent() {
  isProcessing.value = true
  let [s, e] = [start.value, end.value]
  const event = {
    groupId: selGroup.value,
    lessonName: name.value,
    teacherId: 1,
    startDate: s.valueOf(),
    endDate: e.valueOf(),
  }
  const resp = await fetch(`${api}/schedule/`, {
    method: "POST",
    body: JSON.stringify(event),
    headers: {"Content-Type": "application/json"}
  })
  if (resp.status !== 200) {isProcessing.value = false; return alert("Ошибка")}
  const data = await resp.json()
  getEvents()
}

async function putEvent(reload = true) {
  // curEvent.value = Object.assign({}, editedEvent.value)
  isProcessing.value = true
  const ev = editedEvent.value
  let event = {
    lessonId: ev.id,
    lessonName: ev.name,
    teacherId: 1,
    groupId: ev.group,
    startDate: ev.start.valueOf(),
    endDate: ev.end.valueOf(),
    isDone: ev.done
  }
  const resp = await fetch(`${api}/schedule`, {
    method: "PUT",
    body: JSON.stringify(event),
    headers: {"Content-Type": "application/json"}
  })
  if (resp.status !== 200) {isProcessing.value = false; return alert("Ошибка")}
  const data = await resp.json()
  curEvent.value = Object.assign(curEvent.value, ev);
  isProcessing.value = false;
  if (reload) getEvents()
}

async function deleteEvent() {
  if (!confirm("Вы уверены?")) return //лень делать нормальный диалог пока что
  isProcessing.value = true
  const resp = await fetch(`${api}/schedule`, {
    method: "DELETE",
    body: JSON.stringify({lessonId: curEvent.value.id}),
    headers: {"Content-Type": "application/json"}
  })
  if (resp.status !== 200) {isProcessing.value = false; return alert("Ошибка")}
  info.value = false
  isProcessing.value = false;
  getEvents()
  return true
}

function openEvent(id) {
  const event = events.value.find(e => e.id === id)
  if (!event) return
  curEvent.value = event
  editedEvent.value = Object.assign({}, curEvent.value)
  info.value = true
}

getEvents()
</script>
