<script>
import checkToken from "@/checkToken.js"
import getRole from "@/getRole.js"
export default {
  created(){
    checkToken()
    if(getRole()!==1){
      window.location.href = "/login"
    }
  },
  data: () => ({
    referalLink: 'реферальная ссылка',
    overlay: false,
    snackbar: false,
    timeout: 1000,
    title:'реферальная программа',
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
  <h3 class = "titl">Реферальная программа</h3>
  <v-btn variant="outlined" to="/pageReferalProgramm" class = "buttonTO">
    <div class = "textonButton font-weight-medium">Реферальная программа</div>
  </v-btn>
  <v-btn variant="outlined" to="/pageMyBonusSestema" class = "buttonTO">
    <div class = "textonButton font-weight-medium">Моя накопительная система</div>
  </v-btn>
  <div class ='otprav'>
    Отправь друзьям ссылку - получи...
  </div>
  <div class="refer">
    <div class="pod">
      <div class="number font-weight-black">1</div>
      <div class = "inftext">Поделитесь ссылкой с друзьями удобным способом</div>
    </div>
    <div class="reg">
      <div class="number font-weight-black">2</div>
      <div class = "inftext">Друзья регистрируются по вашей ссылке</div>
    </div>
    <div class="bon">
      <div class="number font-weight-black">3</div>
      <div class = "inftext">Вы получаете бонусы</div>
    </div>
  </div>
  <v-sheet
    class="position-relative "
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
      <div>ссылка скопирована</div>

    </v-snackbar>
  </v-sheet>
  <v-row
    align="center"
    class="ma-4"
    justify="center"
  >
    <v-card
      height= "130"
      width="300"
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
          <v-row align="center"  >
            <v-btn icon @click="openLink('https://vk.com')" class = "mx-2">
              <v-img
                src="@/assets/iconVK.png"
                width="200"
                height="80"
                style="margin: -15px"
              ></v-img>
            </v-btn>
            <v-btn icon @click="openLink('https://web.telegram.org/')">
              <v-img
                src="@/assets/iconTG.svg.png"
                width="100"
                height="50"

              ></v-img>
            </v-btn>
            <v-btn icon @click="openLink('https://my.mail.ru/')" class = "mx-2">
              <v-img
                src="@/assets/iconMR.png"
                width="100"
                height="55"
                style="margin: -7px"

              ></v-img>
            </v-btn>
          </v-row>
        </v-overlay>
      </v-row>
    </v-card>
  </v-row>
</template>
<style scoped>
.number{
  font-size: 50px;
  width: 100%;
  height: 60px;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  margin-top: 100px;
}

.otprav{
  margin-left:25px;
  margin-top: 15px;
  font-size: 20px;
  color: gray;
}
.refer{
  display:flex;
  justify-content: space-evenly;
}
.refer > * {
  font-size: 20px;
  text-align: center;
  width: 15%;
  height: 100%;
  margin-bottom: 30px;
}
.number{
  font-size: 2em;
  margin-top:40px;
  margin-bottom:20px;
}
.titl{
  font-size: 25px;
  margin-left: 10px;
  margin-top: 5px;
}
.buttonTO{
  width: 300px;
  height: 45px;
}
.textonButton{
  font-size: 16px;
}
</style>
