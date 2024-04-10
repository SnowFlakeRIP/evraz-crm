<template>
  <div>
    <v-toolbar
      id="toolbar"
      border title
      color="white"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Расписание</v-toolbar-title>

      <v-spacer></v-spacer>

      <!--      <v-select-->
      <!--        v-model="type"-->
      <!--        :items="types"-->
      <!--        class="ma-2"-->
      <!--        variant="outlined"-->
      <!--        dense-->
      <!--        hide-details-->
      <!--      ></v-select>-->

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>
  </div>

  <div id="main">
    <div id="left-menu">
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
      <v-sheet
        class="d-flex"
        height="54"
        tile
      >
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

<script>
import { ref } from 'vue';

import { useDate } from 'vuetify'

export default {
  data: () => ({
    type: 'week',
    types: ['day', 'week', 'month'],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    weekdays: [
      { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { title: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ],
    value: [new Date()],
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    titles: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    leftMenuVisible: true,
  }),
  mounted () {
    const adapter = useDate()
    this.getEvents({ start: adapter.startOfDay(adapter.startOfMonth(new Date())), end: adapter.endOfDay(adapter.endOfMonth(new Date())) })
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

<style>
#main {
  display: flex;
  flex-direction: row;
}

#left-menu {
  margin-top: 54px;
}
</style>
