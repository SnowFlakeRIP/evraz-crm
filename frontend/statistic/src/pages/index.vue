<template>
  <h3 class="name">Статистика</h3>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        активности пользователей
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row
          justify="center"
          no-gutters
        >
          <span>Укажите период, за который нужно составить диаграмму</span>
        </v-row>
        <v-row
          justify="center"
          no-gutters
        >
          <v-col cols="5">
            <v-text-field
              label="С"
              type="date"
            ></v-text-field>
            <v-text-field
              label="По"
              type="date"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row
          justify="center"
          no-gutters
        >
          <span>Укажите курс, которому нужно составить диаграмму</span>
        </v-row>

        <v-col cols="12">
          <v-combobox
            :items="['Собака без ножек','Майнкрафт','Роблокс']"
            density="comfortable"
            label="Название курса"
          ></v-combobox>
          <v-combobox
            :items="[1,2]"
            density="comfortable"
            label="Часть курса"
          ></v-combobox>
        </v-col>
        <div class="parentButton">
          <button @click="diagramm" class="button">Создать диаграмму</button>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>
        проведения занятий
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row
          justify="center"
          no-gutters
        >
          <span>Укажите период, за который нужно составить диаграмму</span>
        </v-row>
        <v-row
          justify="center"
          no-gutters
        >
          <v-col cols="5">
            <v-text-field
              label="С"
              type="date"
            ></v-text-field>
            <v-text-field
              label="По"
              type="date"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row
          justify="center"
          no-gutters
        >
          <span>Укажите курс, которому нужно составить диаграмму</span>
        </v-row>

        <v-col cols="12">
          <v-combobox
            :items="['Собака без ножек','Майнкрафт','Роблокс']"
            density="comfortable"
            label="Название курса"
          ></v-combobox>
          <v-combobox
            :items="[1,2]"
            density="comfortable"
            label="Часть курса"
          ></v-combobox>
        </v-col>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>
        платежей
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row
          justify="space-around"
          no-gutters
        >
          <span>Укажите период, за который нужно составить диаграмму</span>
        </v-row>
        <v-row
          justify="center"
          no-gutters
        >
          <v-col cols="5">
            <v-text-field
                label="С"
                type="date"
            ></v-text-field>
            <v-text-field
                label="По"
                type="date"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row
        justify="center"
        no-gutters
        >
          <span>Укажите курс, которому нужно составить диаграмму</span>
        </v-row>

        <v-col cols="12">
          <v-combobox
            :items="['Собака без ножек','Майнкрафт','Роблокс']"
            density="comfortable"
            label="Название курса"
          ></v-combobox>
          <v-combobox
            :items="[1,2]"
            density="comfortable"
            label="Часть курса"
          ></v-combobox>
        </v-col>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
</script>

<style>

.name{
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ababab;
  border-radius: 20px;
  font-style: italic;
}

.parentButton{
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.button{
  border: 1px solid #131313;
  border-radius: 7px;
  padding: 8px;
  background-color: #e2efe2;
}

</style>
