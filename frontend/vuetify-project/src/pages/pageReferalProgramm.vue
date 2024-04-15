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
    openLink(url) {
      window.open(url, '_blank');
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
  <div class ='otprav'>
    Отправь друзьям ссылку - получи...
  </div>
  <div class="refer">
    <div class="pod">
      <div class="number">1</div>
      <div>Поделитесь ссылкой с друзьями удобным способом</div>
    </div>
    <div class="reg">
      <div class="number">2</div>
      <div>Друзья регистрируются по вашей ссылке</div>
    </div>
    <div class="bon">
      <div class="number">3</div>
      <div>Вы получаете бонусы</div>
    </div>
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
  <v-row align="center" class="ma-4" justify="center">
    <v-card height="200" width="350">
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
          contained>
          <v-row align="center" class="fill-height">
            <v-btn icon @click="openLink('https://vk.com')" class="transparent" style="margin: 10px;">
              <img
                src="@/assets/iconVK.png"
                style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
            </v-btn>
            <v-btn icon @click="openLink('https://web.telegram.org/')" class="transparent" style="margin: 10px;">
              <img
                src="@/assets/iconTG.svg.png"
                style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
            </v-btn>
            <v-btn icon @click="openLink('https://my.mail.ru/')" class="transparent" style="margin: 10px;">
              <img
                src="@/assets/iconMR.png"
                style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
            </v-btn>
          </v-row>
          <v-row align="center" class="fill-height">
            <v-col cols="12" class="d-flex justify-center align-end mb-4">
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
<style scoped>
.number{
  font-size: 30px;
  width: 100%;
  height: 60px;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  margin-top: 100px;
}
.textfornumber{
  width: 100%;
  height: 50px;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-evenly;
}
.otprav{
  color: gray;
}
.refer{
  display:flex;
  justify-content: space-evenly;
}
.refer > * {
  text-align: center;
  width: 12%;
  height: 100%;
  margin-bottom: 70px;
}
.number{
  font-size: 2em;
  margin-top:60px;
  margin-bottom:30px;
}
</style>
