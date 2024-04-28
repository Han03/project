<template>
  <div style="width: 100%;height: 100%;">
    <div style="display: flex;flex-direction: column;height: 100%;">
      <div style="width: 100%;">
        <div style="background-color: white;height: 10vh;width: 100%;">
          <!--   HEAD     -->
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
                 :ref="el=>setBarRef1(barIndex,el)"></Bar>
          </div>
        </div>
      </div>
      <div style="width: 100%">
        <div style="background-color: white;height: 10vh;width: 100%">
          <!--   FOOT     -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import chordConfig from "@/page/guitar/chord.config";
import {onMounted, reactive, ref, nextTick} from "vue";
import Bar from '@/page/guitar/bar';

const noteTable = ref();

const state = reactive({
  ready: false,
  //速度
  speed: 120,
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
  barLength: 2,
  //每帧时间
  intervalTime: 5,
  //第一小节组
  barRef0: {},
  //第二小节组
  barRef1: {},
  //运行中的tapNum
  runningTapNum:{}
}

const setBarRef0 = (index, ref) => {
  data.barRef0[index] = ref;
}

const setBarRef1 = (index, ref) => {
  data.barRef1[index] = ref;
}

let keyIndex = 0;
const getNoteItemKey = (type) => {
  keyIndex++;
  if (type === undefined) type = 'NoteItem';
  return `${type}_${keyIndex}`
}

const pushStack = () => {
  let newStack = [];
  for (let i = 0; i < data.barLength; i++) {
    let beatNoteStack = [];
    //小节剩余的拍子
    let leftNote = state.barBeat * state.beatNote;
    let barBeatIndex = 0;
    //最快的拍子
    let maxBarBeatIndex = state.barBeat * state.beatNote / state.minBeatNote;
    //小节拍子
    let barNoteSize = 0;
    //需要弹奏的音符数量
    let fretStringSize = 0;
    while (barBeatIndex < maxBarBeatIndex) {
      const noteSize = barBeatIndex * state.minBeatNote;
      if (barNoteSize > noteSize) {
        if (noteSize % state.beatNote === 0) {
          //在拍子上补-1表示休止符
          beatNoteStack.push(-1);
        } else {
          //不在拍子上补
          beatNoteStack.push(0);
        }
      } else {
        //获取随机拍子
        let note = getRandomNote();
        if (note <= leftNote) {
          leftNote -= note;
        } else {
          note = leftNote;
          leftNote = 0;
        }
        beatNoteStack.push(note);
        fretStringSize += 1;
        barNoteSize += note;
      }
      barBeatIndex++;
    }
    //获取随机弹奏位置
    let randomFretStringArr = getRandomFretString(fretStringSize);
    //该小节
    const key = getNoteItemKey('barKey');
    let barItem = {
      _key: key,
      noteList: []
    };
    let randomFretStringIndex = 0;
    for (let i = 0; i < beatNoteStack.length; i++) {
      let note = beatNoteStack[i];
      const key = getNoteItemKey('noteItem');
      if (note > 0) {
        let fretString = randomFretStringArr[randomFretStringIndex];
        let pitchName = chordConfig.pitchNames[fretString.string - 1][fretString.fret];
        barItem.noteList.push({
          _key: key,
          note: note,
          ...fretString,
          ...pitchName
        })
        randomFretStringIndex++;
      } else {
        barItem.noteList.push({
          _key: key,
          note: note,
        });
      }
    }
    newStack.push(barItem);
  }

  if (tickInfo.stackIndex === 1) {
    state.barStack0 = newStack;
  }
  if (tickInfo.stackIndex === 0) {
    state.barStack1 = newStack;
  }
}
const getRandomFretString = (size) => {
  let result = [];
  let chordLength = chordConfig.enabledChord.length;
  let chordContinueSize = 0;
  let randomChordName;
  for (let i = 0; i < size; i++) {
    let beginChord = false;
    if (chordContinueSize < 1) {
      let useChord = (i === 0 || Math.random() > 0.5) && (size - i > 1);
      if (useChord) {
        let randomChordIndex = Math.floor(Math.random() * chordLength);
        beginChord = true;
        randomChordName = chordConfig.enabledChord[randomChordIndex];
        let chordItemLength = chordConfig.chordMap[randomChordName].length;
        chordContinueSize = 2 + Math.floor(Math.random() * (chordItemLength - 1));
      } else {
        result.push({
          fret: Math.floor(Math.random() * (state.maxFret + 1)),
          string: Math.ceil(Math.random() * 6),
        })
      }
    }
    if (chordContinueSize > 0) {
      let chord = chordConfig.chordMap[randomChordName];
      let chordItemLength = chordConfig.chordMap[randomChordName].length;
      let chordItemIndex = Math.floor(Math.random() * chordItemLength);
      let chordItem = chord[chordItemIndex];
      result.push({
        beginChord: beginChord,
        chordName: randomChordName,
        fret: chordItem.fret,
        string: chordItem.string
      })
      chordContinueSize--;
    }
  }
  return result;
}
const getRandomNote = () => {
  let maxIndex = 0;
  let maxRate = 0;
  for (let index = 0; index < state.noteRate.length; index++) {
    let rate = state.noteRate[index] * Math.random()
    if (rate > maxRate) {
      maxRate = rate;
      maxIndex = index;
    }
  }
  let note = 1 / (1 << maxIndex)
  return note;
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
      noteRef.setEndMethod(()=>{
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
    Object.keys(data.runningTapNum).forEach((itemKey)=>{
      data.runningTapNum[itemKey].pause();
    });
    return;
  }

  //恢复
  Object.keys(data.runningTapNum).forEach((itemKey)=>{
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
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.note-table {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.bar-group {
  width: 100%;
  flex-shrink: 0;
}

</style>
