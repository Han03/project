<template>
  <div style="height: 100%;padding: 0 10px">
    <div style="display: flex;flex-direction: column;height: 100%;">
      <div class="page-head">
        <div class="page-title">{{ state.title }}</div>
        <div class="page-info">
          <div class="page-info-line">1 = C {{ state.barBeat }}/{{ Math.floor(1 / state.beatNote) }}</div>
          <div class="page-info-line">♪ = {{ state.speed }}</div>
          <div class="page-info-line">Capo = 1</div>
        </div>
      </div>
      <div class="note-page">
        <div class="note-table" ref="noteTable" @click="toggleInterval">
          <div class="bar-group">
            <Bar v-for="(barItem,barIndex) in state.barStack0" :item="barItem" :speed="state.speed"
                 :ref="el=>setBarRef0(barIndex,el)"></Bar>
          </div>
          <div class="bar-group">
            <Bar v-for="(barItem,barIndex) in state.barStack1" :item="barItem" :speed="state.speed"
                 :ref="el=>setBarRef1(barIndex,el)">
            </Bar>
          </div>
        </div>
      </div>
      <div class="page-foot">
      </div>
    </div>
  </div>
</template>

<script setup>
import randomNoteUtil from "@/page/guitar/random-note";
import {onMounted, reactive, ref, nextTick} from "vue";
import Bar from '@/page/guitar/bar';

const noteTable = ref();

const state = reactive({
  ready: false,
  //标题
  title: 'EMO',
  //速度
  speed: 60,
  //每小节4拍
  barBeat: 4,
  //4分之1音符为1拍
  beatNote: 1 / 4,
  //最小音符
  minBeatNote: 1 / 8,
  //音符出现权重 全音符、2分之1音符、4分之1音符，8分之一音符
  noteRate: [2, 2, 6, 3],
  //最大品位
  maxFret: 3,
  //第一谱子
  barStack0: [],
  //第二谱子
  barStack1: []
});

const data = {
  //运行时间
  intervalRunTime: 0,
  //interval
  interval: undefined,
  //stack的长度
  barLength: 10,
  //每帧时间
  intervalTime: 5,
  //第一小节组
  barRef0: {},
  //第二小节组
  barRef1: {},
  //运行中的tapNum
  runningTapNum: {}
}

const setBarRef0 = (index, ref) => {
  data.barRef0[index] = ref;
}

const setBarRef1 = (index, ref) => {
  data.barRef1[index] = ref;
}

const pushStack = () => {
  let newStack = randomNoteUtil.getRandomBarArr({
    barLength: data.barLength,
    barBeat: state.barBeat,
    beatNote: state.beatNote,
    minBeatNote: state.minBeatNote,
    maxFret: state.maxFret,
    noteRate: state.noteRate
  });
  if (tickInfo.stackIndex === 1) {
    state.barStack0 = newStack;
  }
  if (tickInfo.stackIndex === 0) {
    state.barStack1 = newStack;
  }
}

const noteTickEvent = () => {
  if (!state.ready || tickInfo.tickOfStack === tickInfo.barTickSize) {
    pushStack();
  }
}

const animationTickEvent = () => {
  //等待一小节
  if (tickInfo.tickIndex < tickInfo.barTickSize) return;
  const fistBarGroup = noteTable.value.children[0];
  const secondBarGroup = noteTable.value.children[1];
  const animationIndex = tickInfo.tickOfStack >= tickInfo.barTickSize
      ? tickInfo.tickOfStack - tickInfo.barTickSize : (data.barLength - 1) * tickInfo.barTickSize + tickInfo.tickOfStack;
  const animationTotalSize = tickInfo.stackTickSize;

  const orderRevert = tickInfo.stackIndex === 0 && tickInfo.barOfStack === 0
      || tickInfo.stackIndex === 1 && tickInfo.barOfStack > 0;

  if (!orderRevert) {
    let marginSize = -fistBarGroup.clientHeight * animationIndex / animationTotalSize;
    fistBarGroup.style = `margin-top:${marginSize}px`;
    noteTable.value.style = 'flex-direction: column;';
  } else {
    let beginSize = fistBarGroup.clientHeight + secondBarGroup.clientHeight - noteTable.value.clientHeight;
    let marginSize = secondBarGroup.clientHeight * animationIndex / animationTotalSize - beginSize;
    fistBarGroup.style = `margin-bottom:${marginSize}px`;
    noteTable.value.style = 'flex-direction: column-reverse;';
  }
}

const runningNoteTickEvent = () => {
  if (tickInfo.tickOfMinNote === 1) {
    const noteRef = tickInfo.stackIndex === 0
        ? data.barRef0[tickInfo.barOfStack]?.getTapNumber(tickInfo.minNoteOfBar)
        : data.barRef1[tickInfo.barOfStack]?.getTapNumber(tickInfo.minNoteOfBar);
    if (noteRef && !noteRef.isRunning()) {
      noteRef.run();
      const itemKey = noteRef.getItemKey();
      data.runningTapNum[itemKey] = noteRef;
      noteRef.setEndMethod(() => {
        delete data.runningTapNum[itemKey];
      })
    }
  }
}

//节拍点信息
const tickInfo = {
  ready: false,
  //tick序号
  tickIndex: -1,
  //minNote的tick序号
  tickOfMinNote: -1,
  //bar的tick序号
  tickOfBar: -1,
  //stack的tick序号
  tickOfStack: -1,
  //最小音符持续一次的tick次数
  minNoteTickSize: -1,
  //小节持续一次的tick次数
  barTickSize: -1,
  //一次stack的tick次数
  stackTickSize: -1,
  //小节的最小音符数
  barMinNoteSize: -1,
  //bar索引
  barOfStack: -1,
  //minNote索引
  minNoteOfBar: -1,
  //弹奏中的谱子
  stackIndex: 1,
}
const recordTickInfo = () => {
  tickInfo.tickIndex += 1;
  if (!tickInfo.ready) {
    const minNoteTime = 60000 / state.speed / state.beatNote * state.minBeatNote;
    tickInfo.minNoteTickSize = minNoteTime / data.intervalTime;
    tickInfo.barTickSize = tickInfo.minNoteTickSize * state.barBeat * state.beatNote / state.minBeatNote;
    tickInfo.barMinNoteSize = tickInfo.barTickSize / tickInfo.minNoteTickSize;
    tickInfo.stackTickSize = tickInfo.barTickSize * data.barLength;
    tickInfo.ready = true;
  }
  tickInfo.tickOfMinNote = tickInfo.tickIndex % tickInfo.minNoteTickSize;
  tickInfo.tickOfBar = tickInfo.tickIndex % tickInfo.barTickSize;
  tickInfo.tickOfStack = tickInfo.tickIndex % tickInfo.stackTickSize;
  if (tickInfo.tickOfStack === 0) {
    tickInfo.barOfStack = 0;
    tickInfo.stackIndex = 1 - tickInfo.stackIndex;
  } else if (tickInfo.tickOfBar === 0) {
    tickInfo.barOfStack += 1;
  }
  if (tickInfo.tickOfBar === 0) {
    tickInfo.minNoteOfBar = 0;
  } else if (tickInfo.tickOfMinNote === 0) {
    tickInfo.minNoteOfBar += 1;
  }
}

const toggleInterval = () => {
  if (data.interval !== undefined) {
    clearInterval(data.interval);
    data.interval = undefined;
    //暂停
    Object.keys(data.runningTapNum).forEach((itemKey) => {
      data.runningTapNum[itemKey].pause();
    });
    return;
  }

  //恢复
  Object.keys(data.runningTapNum).forEach((itemKey) => {
    data.runningTapNum[itemKey].run();
  });
  data.interval = setInterval(() => {
    tickEvent();
    data.intervalRunTime += data.intervalTime;
  }, data.intervalTime);
}

const tickEvent = () => {
  recordTickInfo();
  noteTickEvent();
  animationTickEvent();
  runningNoteTickEvent();
}

onMounted(() => {
  //开始时调用一次tick初始化数据
  pushStack();
  tickEvent();
  state.ready = true;
})

</script>

<style lang="less" scoped>
.note-page {
  flex: auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

.note-table {
  display: flex;
  flex-direction: column;
}

.bar-group {
  flex-shrink: 0;
}

.page-head {
  background-color: white;
  min-height: 10vh;
  padding: 15px 0;

  .page-title {
    text-align: center;
    font-size: 18px;
  }

  .page-info-line {
    text-align: left;
    font-size: 12px;
    line-height: 15px;
  }
}

.page-foot {
  background-color: white;
  min-height: 5vh;
}

</style>
