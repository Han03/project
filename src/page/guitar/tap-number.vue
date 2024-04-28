<template>
  <div class="item">
    <div class="item-animation">
      <div v-if="state.start && state.result===undefined"
           class="item-circle"
           :class="state.isPause?'animation-pause':'animation-running'"
           :style="{ 'animation': `circle-close ${props.duration/1000}s linear` }">
      </div>
      <div v-if="state.result!==undefined"
           :style="`width:${state.scoreBoxSize}px;height:${state.scoreBoxSize}px;margin-top:${1-state.scoreBoxSize/2}px`"
           class="item-result"
           :class="`item-result-${state.result}`">
        <span class="score-name">{{ state.result }}</span>
      </div>
    </div>
    <span :class="state.result!==undefined?`number-${state.result}`:''">{{
        value
      }}</span>
  </div>
</template>
<script setup>
import {defineProps, onMounted, reactive} from "vue";

/**
 * good : 节奏 +-0.5
 * great : 节奏 +-0.5 准音调
 * perfect : 节奏 +-0.1 准音调
 */
const scoreName = ['miss', 'good', 'great', 'perfect']
const beginTime = new Date().getTime();

const state = reactive({
  result: undefined,
  continueTime: 0,
  scoreBoxSize: 0,
  isPause: true,
  start: false
});

let endMethod = () => {
}

const props = defineProps({
  value: {
    required: true,
    type: Number
  },
  duration: {
    required: true,
    type: Number
  },
  itemKey: {
    required: true,
    type: String
  }
})

const setScore = (score) => {
  if (state.isPause || state.result !== undefined) return;
  state.continueTime = new Date().getTime() - beginTime;
  const rate = state.continueTime / props.duration;
  const left = rate >= 1 ? 0 : 1 - rate;
  const boxSize = 20 + Math.floor(20 * left);
  state.scoreBoxSize = boxSize + boxSize % 2;
  state.result = scoreName[score];
  endMethod();
}

let setScoreTimeOut;
let setScoreTime = 0;
let setScoreTimeStamp = 0;
const run = () => {
  state.start = true;
  if (state.isPause) {
    state.isPause = false;
    //开始
    setScoreTimeStamp = new Date().getTime();
    setScoreTimeOut = setTimeout(() => {
      setScore(0);
    }, props.duration - setScoreTime);
  }
}

const pause = () => {
  if (!state.isPause) {
    state.isPause = true;
    if (setScoreTimeOut !== undefined) {
      clearTimeout(setScoreTimeOut);
    }
    setScoreTime = new Date().getTime() - setScoreTimeStamp;
  }
}

const togglePause = () => {
  if (state.isPause) {
    run();
  } else {
    pause();
  }
}

const isRunning = () => {
  return !state.isPause;
}

const setEndMethod = (m) => {
  endMethod = m;
}

const getItemKey = () => {
  return props.itemKey;
}

defineExpose({
  setScore,
  isRunning,
  run,
  pause,
  togglePause,
  setEndMethod,
  getItemKey
})

</script>
<style lang="less">
@keyframes circle-close {
  0% {
    border: 1px solid #3f3f3f;
    width: 40px;
    height: 40px;
    margin-top: -19px;
  }
  100% {
    border: 1px solid #3f3f3f;
    width: 20px;
    height: 20px;
    margin-top: -9px;
  }
}

@keyframes score-show {
  0% {
    opacity: 100%;
  }
  100% {
    opacity: 0;
  }
}
</style>
<style lang="less" scoped>
.animation-running {
  animation-play-state: running !important;
}

.animation-pause {
  animation-play-state: paused !important;
}

.item {
  height: 2px;
  margin: 10px 0;
  text-align: center;
  line-height: 2px;
}

.item-animation {
  width: 100%;
  height: 0;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;

  .item-circle {
    border-radius: 100%;
    align-items: center;
    flex-shrink: 0;
  }
}

.item-result {
  opacity: 0;
  border-radius: 100%;
  animation: score-show 0.8s linear;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;

  .score-name {
    line-height: 12px;
    color: white;
    transform: scale(0.6);
    margin-left: -3px;
  }
}

.item-result-miss {
  font-size: 12px;
  background-color: #afb6b6;
}

.item-result-good {
  font-size: 13px;
  background-color: #c6ffff;
}

.item-result-great {
  font-size: 14px;
  background-color: #76ffff;
}

.item-result-perfect {
  font-size: 12px;
  background-color: #00ffff;
}

.number-miss {
  color: #afb6b6;
}

.number-good {
  color: #008bda;
}

.number-great {
  color: #008bda;
}

.number-perfect {
  color: #008bda;
}
</style>
