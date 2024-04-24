<template>
  <div style="width: 40px;display: flex;flex-wrap: wrap;padding: 20px" @click="doAction">
    <TapNumber v-for="i in 4" :value="i" :duration="1000" :ref="el => setTapNumberRef(el)" :delay="delay"></TapNumber>
  </div>
</template>
<script setup>
import TapNumber from "@/page/guitar/tap-number";
import {onMounted} from "vue";

const delay = 0;

const tapNumberRef = [];

let timeOut = [];

let runningTime = 0;

let beginTime = 0;

let isPause = true;

const setTapNumberRef = (ref) => {
  tapNumberRef.push(ref)
}

const doAction = () => {
  if (isPause) {
    beginTime = new Date().getTime();
  } else {
    runningTime = new Date().getTime() - beginTime;
  }
  isPause = !isPause;
  timeOut.forEach(to => {
    clearTimeout(to);
  });
  timeOut = [];
  for (let i = 0; i < tapNumberRef.length; i++) {
    tapNumberRef[i].togglePause();
    if (!isPause) {
      const to = setTimeout(() => {
        tapNumberRef[i].setScore(3 - i);
      }, delay + 1000 / (4 - i) - runningTime);
      timeOut.push(to);
    }
  }
}

onMounted(() => {

})
</script>
