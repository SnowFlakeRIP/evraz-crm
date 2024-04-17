<template>
    <v-toolbar>
  <!--      <v-btn class="ma-2">Сегодня</v-btn>-->
  <!--      <v-btn class="ma-1" icon="mdi-menu-left"/>-->
  <!--      <v-btn class="ma-1" icon="mdi-menu-right"/>-->
  <!--      <v-label class="ma-1">Месяц, Год</v-label>-->
      <v-text-field label="Поиск" hide-details class="ma-2"/>
    </v-toolbar>
    <v-main style="display: flex; flex-direction: row; height: calc(100vh - 64px); padding-bottom: 0">
      <div id="options" style="padding: 4px 0">
        <v-btn variant="outlined">Добавить занятие</v-btn>
        <v-date-picker show-adjacent-months hide-header min="2023-01-01" max="2024-12-31" v-model="value"></v-date-picker>
        <v-card>Сортировки</v-card>
      </div>
<!--      <div id="calendar" style="flex: 1; overflow-y: scroll">-->
<!--        <v-container fluid style="padding: 0; height: max-content">-->
<!--          <v-row no-gutters v-for="i in 25" style="flex-wrap: nowrap">-->
<!--            <v-col-->
<!--              v-for="n in 8"-->
<!--              :key="n"-->
<!--              cols="7"-->
<!--              sm="2"-->
<!--            >-->
<!--              <v-sheet class="pa-2" style="position: relative; border: 1px solid gray">-->
<!--                <div v-if="i === 1 && n === 1">-->
<!--                  <span style="position: absolute; top: 2px; right: 4px">Дата</span>-->
<!--                  <span style="position: absolute; bottom: 2px; left: 4px">Время</span>-->
<!--                  <span style="visibility: hidden">Суперклей</span>-->
<!--                </div>-->
<!--                <div v-else-if="n === 1">-->
<!--                  {{i-1}}:00-->
<!--                </div>-->
<!--                <div v-else-if="i === 1">-->
<!--                  День {{n-1}}-->
<!--                </div>-->
<!--                <div v-else>-->
<!--                  Чтото-->
<!--                </div>-->
<!--              </v-sheet>-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--        </v-container>-->
<!--      </div>-->
      <div id="calendar" style="flex: 1; overflow-y: scroll">
        <v-sheet>
          <v-calendar
            ref="calendar"
            v-model="value"
            :events="events"
            view-mode="week"
            :weekdays="weekday"
            min="2023-01-01"
            max="2024-12-31"
          ></v-calendar>
        </v-sheet>
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

</script>

<script>

import {computed, ref} from 'vue';
import {useDate} from "vuetify";

export default {
  data: () => ({
    type: 'day',
    types: ['month', 'week', 'day'],
    weekday: [1, 2, 3, 4, 5, 6],
    weekdays: [
      { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { title: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ],
    value: ref([new Date()]),
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    titles: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
  }),
  mounted () {
    const adapter = useDate()
    this.getEvents({ start: adapter.startOfDay(adapter.startOfMonth(new Date())), end: adapter.endOfDay(adapter.endOfMonth(new Date())) })
  },
  computed: {

  },
  methods: {
    getEvents ({ start, end }) {
      const events = []

      const min = start
      const max = end
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          title: this.titles[this.rnd(0, this.titles.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          allDay: !allDay,
        })
      }

      this.events = events
    },
    getEventColor (event) {
      return event.color
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
  },
}

</script>
