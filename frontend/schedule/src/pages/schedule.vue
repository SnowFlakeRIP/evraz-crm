<template>
  <div id="toolbar">
    <v-toolbar
      id="toolbar"
      border title
      color="white"
    >
      <v-app-bar-nav-icon @click="changeLeftMenuVisible"></v-app-bar-nav-icon>

      <v-toolbar-title>Schedule</v-toolbar-title>

      <v-spacer></v-spacer>

      <!--      <v-select-->
      <!--        v-model="type"-->
      <!--        :items="types"-->
      <!--        class="ma-2"-->
      <!--        variant="outlined"-->
      <!--        dense-->
      <!--        hide-details-->
      <!--        density="compact"-->
      <!--      ></v-select>-->

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>
  </div>

  <div id="dialog">
    <v-dialog
      v-model="dialog"
      max-width="740"
    >
      <v-card
        prepend-icon="mdi-plus"
        title="Create event"
      >
        <v-card-text>
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                label="Name of the event*"
                required
                variant="underlined"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-select
                :items="[]"
                label="Type of event*"
                required
                variant="underlined"
              ></v-select>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-select
                :items="[]"
                label="Courses*"
                required
                variant="underlined"
              ></v-select>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-autocomplete
                :items="[]"
                label="Teacher*"
                auto-select-first
                multiple
                variant="underlined"
              ></v-autocomplete>
            </v-col>

            <!--            <v-col style="width: 350px; flex: 0 1 auto;">-->
            <!--              <v-time-picker-->
            <!--                title="Select start time"-->
            <!--                format="24hr"-->
            <!--                v-model="start"-->
            <!--                :max="end"-->
            <!--                size="small"-->
            <!--              ></v-time-picker>-->
            <!--            </v-col>-->
            <!--            -->
            <!--            <v-col style="width: 350px; flex: 0 1 auto;">-->
            <!--              <v-time-picker-->
            <!--                title="Select end time"-->
            <!--                format="24hr"-->
            <!--                v-model="end"-->
            <!--                :min="start"-->
            <!--              ></v-time-picker>-->
            <!--            </v-col>-->

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                label="Select start time"
                model-value="12:30:00"
                type="time"
                variant="underlined"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                label="Select end time"
                model-value="12:30:00"
                type="time"
                variant="underlined"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
            >
              <v-text-field
                label="Homework"
                required
                variant="underlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis">*indicates required field</small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Close"
            variant="plain"
            @click="dialog = false"
          ></v-btn>

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="dialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <div id="main">
    <div
      id="left-menu"
      v-show="leftMenuVisible"
    >
      <v-btn
        rounded
        prepend-icon="mdi-plus"
        size="large"
        @click="dialog = true"
      >
        Create
      </v-btn>

      <v-date-picker
        v-model="date"
        v-on:update:modelValue="changeDateInSchedule"
        show-adjacent-months
        title='Enter date'
      ></v-date-picker>

      <div id="sorts">
        <v-form>
          <v-sheet width="300">
          </v-sheet>
        </v-form>
      </div>
    </div>

    <div id="schedule">
      <v-sheet>
        <v-calendar
          text="Today"
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
    types: [
      { title: 'Day', value: 'day' },
      { title: 'Week', value: 'week' },
      { title: 'Month', value: 'month' },
    ],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    weekdays: [
      { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { title: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ],
    value: [new Date()],
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    titles: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    leftMenuVisible: true,
    date: ref(),
    dialog: false,
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

    getEventColor(event) {
      return event.color
    },

    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },

    changeLeftMenuVisible() {
      this.leftMenuVisible = !this.leftMenuVisible;
    },

    changeDateInSchedule() {
      this.value = [this.date];
    },
  },
}
</script>

<style>
#main {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#left-menu {
  margin-top: 14px;
  margin-left: 7px;
}

#schedule {
  width: 100%;
  margin-left: 7px;
  margin-right: 7px;
}
</style>
