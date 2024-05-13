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
    class = "cartochka"
    max-width="344"
  >
    <v-card-item>
      <v-card-title>
        Полные условия акции
      </v-card-title>
    </v-card-item>

    <v-card-text class="position-absolute d-flex align-right"
    >
      Участие в Акции является бесплатным и добровольным, и не предусматривает
      возможности получения любого выигрыша (приза) в денежной форме. Акция не
      является лотереей, обещанием публичной награды, азартной игрой или иным
      мероприятием, основанным на риске.
      • Организатор оставляет за собой исключительное право в любое время и по
      своему усмотрению, в том числе без объяснения причин, вносить изменения в
      Условия/изменить Условия Акции в целом или в части в порядке, указанном в пункте
      2.3. Условий.
      • Настоящие Условия вступают в силу с момента их опубликования на Сайте
      Организатора. Участники уведомляются об изменении Условий путем публикации
      информации об изменениях на Сайте Организатора. Измененные Условия вступают в
      действие с момента их размещения на Сайте Организатора.
      • Территория действия Акции: Российская Федерация.
    </v-card-text>
  </v-card>
</template>

<style scoped>
.inf{
  margin-top: 50px;
  font-size: 23px;
  display:flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.inf > * {
  text-align: center;
  width: 17%;
  height: 100%;
  margin-bottom: 70px;
}
.cartochka{

}
</style>
