<template>
  <h3 class="name">Статистика</h3>
  <div class="variants">
    <input id="info__body_1" class="info__switch" type="checkbox">
    <label for="info__body_1" class="info__headline">Вебинары, которые помогут блеснуть эрудицией!</label>
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
.info {
  background-color: #f9f9ff;
  padding: 10px 25px;
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
}

.info__headline::before {
  content: "";
  position: absolute;
  left: -18px;
  top: 4px;
  border: 6px solid #39739d;
  border-bottom-color: red transparent;
  border-right-color: transparent;
  border-left-color: transparent;
}

.info__switch:checked~.info__headline::before {
  transform: rotate(180deg) translateY(6px);
}

.info__headline {
  display: block;
  position: relative;
  margin-bottom: 15px;
  user-select: none;
  color: #39739d;
  font-weight: normal;
  cursor: pointer;
}

.info__headline:hover {
  text-decoration: underline;
}
</style>
