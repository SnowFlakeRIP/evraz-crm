<template>
  <v-toolbar>
    <!--      <v-btn class="ma-2">Сегодня</v-btn>-->
    <!--      <v-btn class="ma-1" icon="mdi-menu-left"/>-->
    <!--      <v-btn class="ma-1" icon="mdi-menu-right"/>-->
    <!--      <v-label class="ma-1">Месяц, Год</v-label>-->
    <v-btn icon="mdi-menu" @click="showMenu = !showMenu"/>
    <v-spacer></v-spacer>
    <v-text-field label="Поиск" hide-details class="ma-2" :disabled="loaded !== 'true' || isProcessing" v-model="search" @update:model-value="updateFilter">
      <v-menu activator="parent">
        <v-list>
          <v-label class="pa-3" v-if="!search">Начните печатать</v-label>
          <v-list-item
            v-for="item in filterSearch"
            :key="item.id"
            :value="item.id"
            @click="openEvent(item.id)"
            v-else-if="filterSearch.length > 0"
          >
            <v-list-item-title>{{ courses.find(c => c.id === item.course).name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ groups.find(g => g.id === item.group).name }} ({{ formatRange(item.start, item.end) }})
            </v-list-item-subtitle>
          </v-list-item>
          <v-label class="pa-3" v-else>Ничего не найдено</v-label>
        </v-list>
      </v-menu>
    </v-text-field>
    <v-overlay location-strategy="connected">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" :icon="filter.course ? 'mdi-filter' : 'mdi-filter-outline'" :disabled="loaded !== 'true' || isProcessing"></v-btn>
      </template>
      <template v-slot:default="isActive">
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
      </template>
    </v-overlay>
    <v-dialog max-width="600" v-if="admin">
      <template v-slot:activator="{ props: activatorProps }">
        <!--        <v-btn-->
        <!--          v-bind="activatorProps"-->
        <!--          color="surface-variant"-->
        <!--          text="Добавить занятие"-->
        <!--          variant="outlined"-->
        <!--        ></v-btn>-->
        <v-btn
          v-bind="activatorProps"
          color="surface-variant"
          icon="mdi-plus"
          variant="flat"
          :disabled="loaded !== 'true' || isProcessing"
        >
        </v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card title="Добавить занятие">
          <div class="pa-4">
            <div style="display: flex; gap: 16px;">
              <div style="flex-basis: 100%">
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
                <v-select
                  label="День недели"
                  :items = "days.map((d, i) => { return {title: d, value: (i+1)%7} })"
                  variant="outlined"
                  v-model="selDay"
                >
                </v-select>
              </div>
              <div style="display: flex; flex-direction: column; gap: 16px; align-items: center">
                <DatePicker v-model.range="range" range />
                <DatePicker mode="time" hide-time-header is24hr v-model.range="rangeTime" range></DatePicker>
              </div>
              <!--                <div style="display: flex; justify-content: space-around;">-->
              <!--                  -->
              <!--                </div>-->
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
              @click="postEvent().then(r => {isActive.value = false})"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-toolbar>
  <v-main class="main" v-if="loaded === 'true'">
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
        <span>{{ groups.find(g => g.id === curEvent.group).name }}</span>
        <span class="text-h4 font-weight-bold text-black">{{ courses.find(c => c.id === curEvent.course).name }}</span>
        <v-divider></v-divider>
        <div style="vertical-align: middle; display: flex; gap: 8px">
          <v-icon icon="mdi-clock-outline"/>
          <span style="vertical-align: middle">
          {{ formatRange(curEvent.start, curEvent.end) }}
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
                  <div style="display: flex; justify-content: space-around;" v-if="editAll">
                    <div style="display: grid">
                      <span>Начало</span>
                      <DatePicker mode="time" hide-time-header is24hr v-model="editedEvent.start"></DatePicker>
                    </div>
                    <div style="display: grid">
                      <span>Конец</span>
                      <DatePicker mode="time" hide-time-header is24hr v-model="editedEvent.end"></DatePicker>
                    </div>
                  </div>
                  <div style="display: flex; justify-content: space-between;" v-else>
                    <div style="display: grid">
                      <span>Начало</span>
                      <DatePicker mode="dateTime" is24hr v-model="editedEvent.start"></DatePicker>
                    </div>
                    <div style="display: grid">
                      <span>Конец</span>
                      <DatePicker mode="dateTime" is24hr v-model="editedEvent.end"></DatePicker>
                    </div>
                  </div>
                  <v-checkbox label="Применить ко всем" hide-details v-model="editAll"></v-checkbox>
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
                    @click="() => {deleteEvent(editAll).then(r => {if (r) isActive.value = false})}"
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
                    @click="putEvent(true, editAll).then(r => {isActive.value = false})"
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
            @click="editedEvent.done = !curEvent.done; putEvent(false, false)"
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

.sx__view-selection {
  display: none;
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
import '@mdi/font/css/materialdesignicons.css'
import {Calendar, DatePicker} from 'v-calendar';
import 'v-calendar/style.css';
import {ref, computed} from "vue"
import {createCalendarControlsPlugin} from "@schedule-x/calendar-controls";

const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

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
const api = `http://${location.hostname}:5000` //todo: перенести апи на один порт

let admin = ref(true)
let showMenu = ref(true)
let selCourse = ref(null)
let selGroup = ref(null)
let selDay = ref(null)

let search = ref("")
let filterSearch = ref([])
function updateFilter() {filterSearch.value = events.value.filter(e =>
  e.name.toLowerCase().startsWith(search.value)
  || courses.value.find(c => c.id === e.course).name.toLowerCase().startsWith(search.value)
  || groups.value.find(g => g.id === e.group).name.toLowerCase().startsWith(search.value)
)}

let value = ref(new Date())
// let startTime = ref(new Date(43200000))
// let endTime = ref(new Date(46800000))
let startTime = ref(0)
let endTime = ref(0)
let range = ref({
  start: new Date(),
  end: new Date(Date.now()+86400000),
})
let rangeTime = ref({
  start: new Date(0),
  end: new Date(3600000)
})
let isProcessing = ref(false)

let info = ref(false)
let curEvent = ref({})
let editedEvent = ref({})
let editAll = ref(true)
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
    case selDay.value === null && !edit:
      return "Укажите день недели"
    case !edit && range.value.start === null || range.value.end === null || range.value.start.valueOf() > range.value.end.valueOf():
      return "Неверный промежуок дат";
    case !edit && rangeTime.value.start === null || rangeTime.value.end === null || rangeTime.value.start.valueOf() > rangeTime.value.end.valueOf() || rangeTime.value.start.valueOf() === rangeTime.value.end.valueOf():
      return "Неверный промежуток времени";
    case edit && editedEvent.value.start.valueOf() > editedEvent.value.end.valueOf():
      return "Начало должно быть раньше конца";
    default:
      return null
  }
}

function calendar() {
  return createCalendar({
    selectedDate: formatDate(value.value, false),
    locale: "ru-RU",
    //views: [viewWeek, viewMonthGrid, viewMonthAgenda],
    views: [viewWeek],
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
    plugins: []
  })
}

let calendarApp = window.calendarApp = calendar()

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

function formatDisplayDate(d, time = true) {
  if (!d) return "Invalid Date"
  if (!(d instanceof Date)) d = new Date(d)
  const today = new Date()
  const [todayD, todayY] = [dayOfYear(today), today.getFullYear()]
  const [otherD, otherY] = [dayOfYear(d), d.getFullYear()]
  let diff = (todayY !== otherY) ? 1000 : todayD - otherD
  let datestr =
    diff === 0 ? "сегодня" :
      diff === -1 ? "завтра" :
        diff === -2 ? "послезавтра" :
          diff === 2 ? "позавчера" :
            diff === 1 ? "вчера" : `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  let timestr = time ? `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}` : ""
  return `${datestr}${datestr && timestr ? ", " : ""}${timestr}`
}

function formatRange(d1, d2) {
  if (!d1 || !d2) return "Invalid Date"
  [d1, d2] = [new Date(d1), new Date(d2)]
  const today = new Date()
  const [todayD, todayY] = [dayOfYear(today), today.getFullYear()]
  const [otherD1, otherY1] = [dayOfYear(d1), d1.getFullYear()]
  const [otherD2, otherY2] = [dayOfYear(d2), d2.getFullYear()]
  let diff1 = (todayY !== otherY1) ? 1000 : todayD - otherD1
  let diff2 = (todayY !== otherY2) ? 1000 : todayD - otherD2
  let datestr1 =
    diff1 === 0 ? "сегодня" :
      diff1 === -1 ? "завтра" :
        diff1 === -2 ? "послезавтра" :
          diff1 === 2 ? "позавчера" :
            diff1 === 1 ? "вчера" : `${d1.getDate()} ${months[d1.getMonth()]} ${d1.getFullYear()}`
  let timestr1 = `${d1.getHours().toString().padStart(2, "0")}:${d1.getMinutes().toString().padStart(2, "0")}`
  let datestr2 =
    otherD1 === otherD2 && otherY1 === otherY2 ? "" :
      diff1 === 0 ? "сегодня, " :
        diff1 === -1 ? "завтра, " :
          diff1 === -2 ? "послезавтра, " :
            diff1 === 2 ? "позавчера, " :
              diff1 === 1 ? "вчера, " : `${d2.getDate()} ${months[d2.getMonth()]} ${d2.getFullYear()}, `
  let timestr2 = `${d2.getHours().toString().padStart(2, "0")}:${d2.getMinutes().toString().padStart(2, "0")}`
  return `${datestr1}, ${timestr1} - ${datestr2}${timestr2}`
}

function updateEvents() {
  //todo: обновление списка событий ломает выбор даты в календаре. почему???????????????????????????????????????????????
  const evs = []
  events.value.filter(
    event =>
      (filter.value.course ? event.course === filter.value.course : true) &&
      (filter.value.group ? event.group === filter.value.group : true)
  ).forEach(event => {
    event.start = new Date(event.start)
    event.end = new Date(event.end)
    evs.push({
      id: event.id,
      start: formatDate(event.start),
      end: formatDate(event.end),
      title: `${courses.value.find(c => c.id === event.course).name} - ${groups.value.find(g => g.id === event.group).name}`,
      calendarId: event.course,
      description: event.group,
    })
  })
  calendarApp.events.set(evs)
  search.value = ""
  updateFilter()
}

async function getEvents() {
  loaded.value = "false"
  isProcessing.value = true
  let status, data
  try {
    data = await fetch(`${api}/schedule/all`, {method: "GET"})
    status = data.status
  } catch (e) {status = 0}
  if (status !== 200) {
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
      sequence: event.sequenceId,
      course: groups.value.find(g => g.id == event.groupId).courseId,
      group: +event.groupId,
      name: event.name,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      done: event.isDone
    })
  })
  calendarApp = window.calendarApp = calendar()
  loaded.value = "true"
  isProcessing.value = false
  editAll.value = true
  updateEvents()
}

async function postEvent() {
  isProcessing.value = true
  let [s, e] = [startTime.value, endTime.value]
  const event = {
    groupId: selGroup.value,
    lessonName: `${courses.value.find(c => c.id === selCourse.value).name} - ${groups.value.find(g => g.id === selGroup.value).name}`,
    teacherId: 1,
    startTime: rangeTime.value.start.valueOf(),
    endTime: rangeTime.value.end.valueOf(),
    startDate: range.value.start.valueOf(),
    endDate: range.value.end.valueOf(),
    weekDay: selDay.value
  }
  const resp = await fetch(`${api}/schedule/`, {
    method: "POST",
    body: JSON.stringify(event),
    headers: {"Content-Type": "application/json"}
  })
  if (resp.status !== 200) {isProcessing.value = false; return alert("Ошибка")}
  getEvents()
}

async function putEvent(reload = true, all) {
  // curEvent.value = Object.assign({}, editedEvent.value)
  isProcessing.value = true
  const ev = editedEvent.value
  // let event = {
  //   lessonId: ev.id,
  //   lessonName: `${courses.value.find(c => c.id === ev.course).name} - ${groups.value.find(g => g.id === ev.group).name}`,
  //   teacherId: 1,
  //   groupId: ev.group,
  //   startDate: ev.start.valueOf(),
  //   endDate: ev.end.valueOf(),
  //   isDone: ev.done,
  //   updateAll: all,
  // }
  // let [s, e] = [new Date(ev.start), new Date(ev.end)]
  // if (editAll) {
  //   s.setUTCFullYear(1970, 0, 1); e.setUTCFullYear(1970, 0, 1)
  // }
  let event = {
    lessonId: ev.id,
    startDate: ev.start.valueOf(),
    endDate: ev.end.valueOf(),
    isDone: ev.done,
    updateAll: all,
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

async function deleteEvent(all) {
  let s = ""
  if (all) {
    const count = events.value.filter(e => e.sequence === curEvent.value.sequence)
    let a = ""
    switch (true) {
      case count.length%10 === 1 && count.length%100 !== 11:
        a = "занятие будет удалено"
        break
      case count.length%10 >= 2 && count.length%10 <= 4:
        a = "занятия будут удалены"
        break
      default:
        a = "занятий будут удалены"
        break
    }
    s = `${count.length} ${a}. `
  }

  if (!confirm(`${s}Вы уверены?`)) return //лень делать нормальный диалог пока что
  isProcessing.value = true
  const resp = await fetch(`${api}/schedule`, {
    method: "DELETE",
    body: JSON.stringify({lessonId: curEvent.value.id, deleteAll: all}),
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
