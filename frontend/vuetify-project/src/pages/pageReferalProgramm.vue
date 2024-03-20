<script>
export default {
  data: () => ({
    referalLink: 'реферальная ссылка',
    overlay: false,
    snackbar: false,
    timeout: 1000,
  }),
  methods: {
    copyText(){
      const text = this.$refs.textCopy.innerText
      navigator.clipboard.writeText(text).then(function (){
        console.log('скопировали ссылку')
      })
    },
    onClick () {
      this.snackbar = false
    },
    iconCLick(){
      console.log('тык')
    },
  },
}
</script>

<template>
  <h3>Реферальная программа</h3>
  <v-btn variant="outlined" to="/pageReferalProgramm">
    Реферальная программа
  </v-btn>
  <v-btn variant="outlined" to="/pageMyBonusSestema" >
    Моя накопительная система
  </v-btn>
  <div>
    Отправь друзьям ссылку - получи...
  </div>
  <div class = "number" >
    <div>1</div>
    <div>2</div>
    <div>3</div>
  </div>
  <div class = "textfornumber">
    <div>Текст1</div>
    <div>Текст2</div>
    <div>Текст3</div>
  </div>
  <v-sheet
    class="position-relative"
    min-height="100"
  >
    <div class="position-absolute d-flex align-center justify-center w-100 h-100">
      <v-btn
        size="x-large"
        @click="snackbar = !snackbar; copyText()"

      >
        <div ref = "textCopy">{{ referalLink }}</div>
      </v-btn>
    </div>

    <v-snackbar
      v-model="snackbar"
      location="center"
      :timeout="timeout"
    >
      ссылка скопирована

    </v-snackbar>
  </v-sheet>
  <v-row
    align="center"
    class="ma-4"
    justify="center"
  >
    <v-card
      height="200"
      width="350"
    >
      <v-row justify="center">
        <v-btn
          class="mt-12"
          color="success"
          @click="overlay = !overlay"
        >
          Поделиться
        </v-btn>
        <v-overlay
          v-model="overlay"
          class="align-center justify-center"
          contained
        >
          <v-row align = "center" class = "fill-height" margin >
            <v-btn icon @click="iconCLick">
              <img
                width="80"
                aspect-ratio="1/1"
                cover
                src="@/assets/iconVK.png">
            </v-btn>
            <v-btn icon @click="iconCLick">
              <img
                width="80"
                aspect-ratio="1/1"
                cover
                src="@/assets/iconTG.svg.png">
            </v-btn>
            <v-btn icon @click="iconCLick">
              <img
                width="80"
                aspect-ratio="1/1"
                cover
                src="@/assets/iconMR.png">
            </v-btn>
          </v-row>
          <v-row align = "center" class = "fill-height">
            <v-col cols = "12" class = "d-flex-justify-center aling-end mb-4">
              <v-btn
                color="success"
                @click="overlay = false"
              >
                Вернуться
              </v-btn>
            </v-col>
          </v-row>
        </v-overlay>
      </v-row>
    </v-card>
  </v-row>
</template>
<style scoped lang="sass">
</style>
