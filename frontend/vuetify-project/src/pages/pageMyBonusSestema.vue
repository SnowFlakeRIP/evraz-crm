<script setup>
let discount = 0
let number_of_invitees = 0
let until_next_discount = 0
</script>

<template>
  <h3>Накопительная система</h3>
  <v-btn variant="outlined" to="/pageReferalProgramm">
    Реферальная программа
  </v-btn>
  <v-btn variant="outlined" id = "butTObonus" to="/pageMyBonusSestema" >
    Моя накопительная система
  </v-btn>
  <div class = "inf">
    <div>
      Ваша скидка на данный момент: {{discount}}
    </div>
    <div>
      Количество приглашённых: {{number_of_invitees}}
    </div>
    <div>
      До следующей скидки осталось {{until_next_discount}} человек
    </div>
  </div>
  <v-card
    class="mx-auto my-8"
    elevation="16"
    max-width="344"
  >
    <v-card-item>
      <v-card-title>
        Полные условия акции
      </v-card-title>
    </v-card-item>

    <v-card-text>
      Полные условия акции
    </v-card-text>
  </v-card>
</template>

<style scoped lang="sass">

</style>
