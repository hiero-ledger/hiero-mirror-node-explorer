// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<!--
  Kudos to victordg
  https://codepen.io/vdel26/pen/DOXzEo
  -->

<template>
  <div class="spinner" :style="{width: props.size + 'px', height: props.size + 'px'}">
    <div class="bar1"></div>
    <div class="bar2"></div>
    <div class="bar3"></div>
    <div class="bar4"></div>
    <div class="bar5"></div>
    <div class="bar6"></div>
    <div class="bar7"></div>
    <div class="bar8"></div>
    <div class="bar9"></div>
    <div class="bar10"></div>
    <div class="bar11"></div>
    <div class="bar12"></div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

const props = defineProps({
  size: {
    type: Number,
    default: 48
  }
})


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>


div.spinner {
  position: relative;
  display: inline-block;
}

div.spinner div {
  width: 7%;
  height: 25%;
  background: var(--text-secondary);
  position: absolute;
  left: 49%;
  top: 43%;
  opacity: 0;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  animation: fade 1s linear infinite;
}

@keyframes fade {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.25;
  }
}

div.spinner div.bar1 {
  transform: rotate(0deg) translate(0, -130%);
  animation-delay: 0s;
}

div.spinner div.bar2 {
  transform: rotate(30deg) translate(0, -130%);
  animation-delay: -0.9167s;
}

div.spinner div.bar3 {
  transform: rotate(60deg) translate(0, -130%);
  animation-delay: -0.833s;
}

div.spinner div.bar4 {
  transform: rotate(90deg) translate(0, -130%);
  animation-delay: -0.7497s;
}

div.spinner div.bar5 {
  transform: rotate(120deg) translate(0, -130%);
  animation-delay: -0.667s;
}

div.spinner div.bar6 {
  transform: rotate(150deg) translate(0, -130%);
  animation-delay: -0.5837s;
}

div.spinner div.bar7 {
  transform: rotate(180deg) translate(0, -130%);
  animation-delay: -0.5s;
}

div.spinner div.bar8 {
  transform: rotate(210deg) translate(0, -130%);
  animation-delay: -0.4167s;
}

div.spinner div.bar9 {
  transform: rotate(240deg) translate(0, -130%);
  animation-delay: -0.333s;
}

div.spinner div.bar10 {
  transform: rotate(270deg) translate(0, -130%);
  animation-delay: -0.2497s;
}

div.spinner div.bar11 {
  transform: rotate(300deg) translate(0, -130%);
  animation-delay: -0.167s;
}

div.spinner div.bar12 {
  transform: rotate(330deg) translate(0, -130%);
  animation-delay: -0.0833s;
}
</style>
