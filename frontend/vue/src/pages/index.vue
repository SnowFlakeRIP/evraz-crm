

<template >

<!--  <div class="all">-->

<!--    <div class="firstColumn">-->
<!--      <h3 class="namedoc">Документы</h3>-->
<!--      <div-->
<!--        v-for="(document, documentIndex) in documents"-->
<!--        :key="documentIndex"-->
<!--      >-->

<!--        <div class="document">-->

<!--          <div class="name">{{document.name}}</div>-->

<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="secondColumn">-->

<!--      <h3>Параметры</h3>-->

<!--      <div-->
<!--        v-for="(document, documentIndex) in documents"-->
<!--        :key="documentIndex"-->
<!--      >-->
<!--        <div v-if="hasDocumentFilters(document)"-->
<!--              class="document">-->

<!--          <div class="date">-->

<!--            <div v-if="document.filters.date">-->
<!--              <input type="date">-->
<!--            </div>-->
<!--            <div v-else></div>-->

<!--          </div>-->

<!--          <div class="dateStart" >-->

<!--            <div v-if="document.filters.dateStart">-->
<!--              <input type="date">-->
<!--            </div>-->
<!--            <div v-else></div>-->

<!--          </div>-->

<!--          <div class="dateFinish">-->

<!--            <div v-if="document.filters.dateFinish">-->
<!--              <input type="date">-->
<!--            </div>-->
<!--            <div v-else></div>-->

<!--          </div>-->


<!--          &lt;!&ndash;?????????????????????????????????????????????????????????????????????????&ndash;&gt;-->
<!--          <div class="number">-->

<!--            <div v-if="document.filters.number">-->

<!--              <v-input>-->
<!--                <v-text-field>-->
<!--                  <v-icon color="red">-->
<!--                    mdi-plus-->
<!--                  </v-icon>-->
<!--&lt;!&ndash;                  <template v-slot:append>&ndash;&gt;-->
<!--&lt;!&ndash;                    <v-icon color="red">&ndash;&gt;-->
<!--&lt;!&ndash;                      mdi-plus&ndash;&gt;-->
<!--&lt;!&ndash;                    </v-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                  </template>&ndash;&gt;-->
<!--&lt;!&ndash;                  <template v-slot:prepend>&ndash;&gt;-->
<!--&lt;!&ndash;                    <v-icon color="green">&ndash;&gt;-->
<!--&lt;!&ndash;                      mdi-minus&ndash;&gt;-->
<!--&lt;!&ndash;                    </v-icon>&ndash;&gt;-->
<!--&lt;!&ndash;                  </template>&ndash;&gt;-->
<!--                </v-text-field>-->
<!--              </v-input>-->

<!--            </div>-->

<!--            <div v-else></div>-->


<!--          </div>-->
<!--        </div>-->

<!--        <div v-else>-</div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="thirdColumn">-->
<!--      <h3>Скачивание</h3>-->
<!--      <div-->
<!--        v-for="(documentIndex) in documents"-->
<!--        :key="documentIndex">-->
<!--        <div class="document">-->
<!--          <div class="download">-->
<!--            <button>скачать</button>-->
<!--          </div>-->
<!--        </div>-->

<!--      </div>-->

<!--    </div>-->

<!--  </div>-->

</template>

<script setup>

let documents = ref([
  {
    name: 'Документ1',
    filters: {
      date: true,
      dateStart: true ,
      dateFinish: false,
      number: true
    }
  },
  {
    name: 'Документ2',
    filters: {

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

h3 {

}

.all {
  display: flex;
  justify-content: space-around;
}

.document{
  padding: 5%;
  display: flex;

}

.name {
  padding-bottom: 30%;
}

.namedoc {
  padding-bottom: 16%;
}
</style>
