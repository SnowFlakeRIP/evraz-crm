<template>
  <h3 class="name">Статистика</h3>
  <div class="variants">
    <input id="info__body_1" class="info__switch" type="checkbox">
    <label for="info__body_1" class="info__headline">активности пользователей</label>
    <div class="info__body">
      Вебинары образовательного проекта Level One — современный формат интеллектуального досуга, который будет интересен всем, кто хочет узнать что-то новое. Всего за пару часов вы совершите путешествие в увлекательный мир науки и искусства. Талантливые лекторы
      поделятся своими знаниями, доступно расскажут о важных научных открытиях и расширят ваш кругозор.
    </div>
  </div>
</template>

<script setup>

</script>

<style>

.name{
  padding: 20px;
  border: 1px solid #ababab;
  box-shadow: 0 0 5px rgba(0, 89, 68 , 60%);
  border-radius: 20px;
  font-style: italic;
}

.info__switch {
  display: none;
}

.info__body {
  max-height: 0;
  overflow: hidden;
  transition: 0.4s;
}

.info__switch:checked~.info__body {
  max-height: 100px;
  padding: 10px;
  border: 1px solid darkgreen;
  border-top: none;
  border-radius: 10px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  position: absolute;
}

.info__headline {
  display: flex;
  position: relative;
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  transition: 0.4s;
  user-select: none;
  color: #000000;
  background-color: #e3e3e3;
  font-weight: normal;
  cursor: pointer;
}

.info__switch:checked~.info__headline{
  transition: 0.2s;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.info__headline:hover {
  text-decoration: underline;
  color: #3fa9ff;
  background-color: #dadada;
}
</style>
