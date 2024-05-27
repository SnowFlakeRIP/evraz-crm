<template>
  <v-table
  >
    <thead>
    <tr>
      <th class="text-left">
        Документы
      </th>
      <th class="text-left">
        Параметры
      </th>
      <th class="text-left">
        Скачать
      </th>
    </tr>
    </thead>

    <tbody>

    <tr
      v-for="(document, documentIndex) in documents"
      :key="documentIndex"
    >
      <td>{{ document.name }}</td>
      <td v-if="hasDocumentFilters(document)"
           class="document">
        <div class="filters">
          <div class="date">

            <div v-if="document.filters.date">
              <v-text-field
                class="tvari"
                label="дата"
                type="date"
              >
              </v-text-field>
            </div>
            <div v-else></div>

          </div>

          <div class="date" >

            <div v-if="document.filters.dateStart">
              <v-text-field
                class="tvari"
                label="дата"
                type="date"
              >
              </v-text-field>
            </div>
            <div v-else></div>

          </div>

          <div class="date">

            <p v-if="document.filters.dateFinish">
              <v-text-field
                class="tvari"
                label="дата"
                type="date"
              >
              </v-text-field>
            </p>
            <p v-else></p>

          </div>
          <div class="number">

            <div v-if="document.filters.number">

              <v-input>
                <v-text-field
                  class="tvari"
                  label=""
                  type="number">
                </v-text-field>
              </v-input>

            </div>

            <div v-else></div>

          </div>
        </div>

      </td>
      <td v-else>-</td>
      <td>
        <div v-if="document.filters.type === 'exsel'">
          <v-btn append-icon="$vuetify">
            Скачать
          </v-btn>
        </div>
        <div v-else>
          <v-btn
            append-icon="png">
            Скачать

<!--              <v-icon>-->
<!--                <v-img-->
<!--                  class="mb-4"-->
<!--                  height="40"-->
<!--                  src="@/assets/exsel.png"-->
<!--                />-->
<!--              </v-icon>-->


          </v-btn>
        </div>
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { createVuetify } from "vuetify";
import { mdi } from "vuetify/iconsets/mdi";
import { png } from "@/assets/pdf.png";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
      custom: customSVGs,
    },
  },
})

nuxtApp.vueApp.use(vuetify)
const documents = ref([
  {
    name: 'Документ1',
    filters: {
      date: true,
      dateStart: true ,
      dateFinish: false,
      number: true,
      type:'exsel',
    }
  },
  {
    name: 'Документ2',
    filters: {
      type:'pdf'
    }
  },
  {
    name: 'Документ3',
    filters: {

    }
  }
]);

function hasDocumentFilters(document) {
  return !isObjectEmpty(document.filters);
}

function isObjectEmpty(object) {
  if (!isObject(object)) return false;

  return Object.keys(object).length === 0;
}

function isObject(object) {
  return Object.prototype.toString.call(object).slice(8, -1) === 'Object';
}

</script>

<style>
.filters{
  padding: 0;
  display: flex;
  flex-flow: column wrap;
}

.number{
  padding: 0;
  width: 160px;

}
.date{
  padding: 5px;
  width: 160px;

}
</style>
<template>
  <v-table
  >
    <thead>
    <tr>
      <th class="text-left">
        Документы
      </th>
      <th class="text-left">
        Параметры
      </th>
      <th class="text-left">
        Скачать
      </th>
    </tr>
    </thead>

    <tbody>

    <tr
      v-for="(document, documentIndex) in documents"
      :key="documentIndex"
    >
      <td>{{ document.name }}</td>
      <td v-if="hasDocumentFilters(document)"
           class="document">
        <div class="filters">
          <div class="date">

            <div v-if="document.filters.date">
              <v-text-field
                class="tvari"
                label="дата"
                type="date"
              >
              </v-text-field>
            </div>
            <div v-else></div>

          </div>

          <div class="date" >

            <div v-if="document.filters.dateStart">
              <v-text-field
                class="tvari"
                label="дата"
                type="date"
              >
              </v-text-field>
            </div>
            <div v-else></div>

          </div>

          <div class="date">

            <p v-if="document.filters.dateFinish">
              <v-text-field
                class="tvari"
                label="дата"
                type="date"
              >
              </v-text-field>
            </p>
            <p v-else></p>

          </div>
          <div class="number">

            <div v-if="document.filters.number">

              <v-input>
                <v-text-field
                  class="tvari"
                  label=""
                  type="number">
                </v-text-field>
              </v-input>

            </div>

            <div v-else></div>

          </div>
        </div>

      </td>
      <td v-else>-</td>
      <td>
        <div v-if="document.filters.type === 'exsel'">
          <v-btn append-icon="$vuetify">
            Скачать
          </v-btn>
        </div>
        <div v-else>
          <v-btn
            append-icon="png">
            Скачать

<!--              <v-icon>-->
<!--                <v-img-->
<!--                  class="mb-4"-->
<!--                  height="40"-->
<!--                  src="@/assets/exsel.png"-->
<!--                />-->
<!--              </v-icon>-->


          </v-btn>
        </div>
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { createVuetify } from "vuetify";
import { mdi } from "vuetify/iconsets/mdi";
import { png } from "@/assets/pdf.png";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
      custom: customSVGs,
    },
  },
})

nuxtApp.vueApp.use(vuetify)
const documents = ref([
  {
    name: 'Документ1',
    filters: {
      date: true,
      dateStart: true ,
      dateFinish: false,
      number: true,
      type:'exsel',
    }
  },
  {
    name: 'Документ2',
    filters: {
      type:'pdf'
    }
  },
  {
    name: 'Документ3',
    filters: {

    }
  }
]);

function hasDocumentFilters(document) {
  return !isObjectEmpty(document.filters);
}

function isObjectEmpty(object) {
  if (!isObject(object)) return false;

  return Object.keys(object).length === 0;
}

function isObject(object) {
  return Object.prototype.toString.call(object).slice(8, -1) === 'Object';
}

</script>

<style>
.filters{
  padding: 0;
  display: flex;
  flex-flow: column wrap;
}

.number{
  padding: 0;
  width: 160px;

}
.date{
  padding: 5px;
  width: 160px;

}
</style>
