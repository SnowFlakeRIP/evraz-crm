<script >
export default {
  data: () => ({
    rules: {
      required: value => !!value || 'Заполните поле',
    },
  }),
}
</script>

<template>
  <div class="row">
    <h1>Создайте курс</h1>
    <div class="fields">
      <div class="field">
        <v-responsive
          class="mx-auto"
          max-width="344"

        >
          <v-text-field
            class="block"
            :rules="[rules.required]"

            label="Название"
            variant="outlined"

          ></v-text-field>
        </v-responsive>
      </div>
      <div >
        <v-responsive
          class="mx-auto"
          max-width="344"
        >
          <v-textarea
            class="block"
            :rules="[rules.required]"
            bg-color="amber-lighten-4"
            color="orange orange-darken-4"
            label="Описание"
            variant="outlined"
          ></v-textarea>
        </v-responsive>
      </div>
      <div>
        <v-responsive
          class="mx-auto"
          max-width="344"
        >
          <v-text-field
            class="block"
            :rules="[rules.required]"
            hide-details="auto"
            label="Расписание"
            variant="outlined"
            placeholder="Например: пн 16:00-18:00 ср 16:00-18:00"
            type="email"
          ></v-text-field>
        </v-responsive>
      </div>
      <div>
        <v-responsive
          class="mx-auto"
          max-width="344"
        >
          <v-text-field
            class="block"
            :rules="[rules.required]"
            hide-details="auto"
            label="Название"
            variant="outlined"
            type="number"

          ></v-text-field>

        </v-responsive>
      </div>
    </div>
  </div>
</template>

<style>
.block {
  padding-top: 35px;
  }


</style>
