<template>
  <div style="display: flex;flex-direction: column;height: 100%">
    <div style="width: 100%;">
      <div style="background-color: white;height: 10vh;width: 100%;">
        <!--   HEAD     -->
      </div>
    </div>
    <div class="note-page">
      <div class="note-table" ref="noteTable" @click="startInterval">
        <div v-for="(bar,barIndex) in state.barStack" class="bar-line">
          <div class="chord-line">
            <div class="note-item"></div>
            <div class="note-item" v-for="noteItem in bar" :key="getNoteItemKey()">
              <div class="chord-box"
                   v-if="noteItem.beginChord">
                <chord :name="noteItem.chordName"></chord>
              </div>
            </div>
          </div>
          <div class="bar-content">
            <div class="bar-start">
              <div class="bar-start-top"></div>
              <div class="bar-start-center"></div>
              <div class="bar-start-bottom"></div>
            </div>
            <div>
              <div class="string-line">
                <div class="note-item">
                  <div>
                    <div class="note-tab">
                      <span class="note-tab-text">T</span>
                      <span class="note-tab-text">A</span>
                      <span class="note-tab-text">B</span>
                    </div>
                    <div class="note-string"></div>
                    <div class="note-string"></div>
                    <div class="note-string"></div>
                    <div class="note-string"></div>
                    <div class="note-string"></div>
                    <div class="note-string"></div>
                  </div>
                </div>
                <div class="note-item" v-for="(noteItem,noteIndex) in bar">
                  <div>
                    <div v-if="noteIndex===bar.length-1" class="note-tab-end">
                      <span class="note-tab-text">&nbsp;</span>
                      <span class="note-tab-text">&nbsp;</span>
                      <span class="note-tab-text">&nbsp;</span>
                    </div>
                    <div class="note-string">{{ noteItem.string === 1 ? noteItem.fret : '' }}</div>
                    <div class="note-string">{{ noteItem.string === 2 ? noteItem.fret : '' }}</div>
                    <div class="note-string">{{ noteItem.string === 3 ? noteItem.fret : '' }}</div>
                    <div class="note-string">{{ noteItem.string === 4 ? noteItem.fret : '' }}</div>
                    <div class="note-string">{{ noteItem.string === 5 ? noteItem.fret : '' }}</div>
                    <div class="note-string">{{ noteItem.string === 6 ? noteItem.fret : '' }}</div>
                  </div>
                </div>
              </div>
              <div class="number-line">
                <div class="note-item"></div>
                <div class="note-item" v-for="noteItem in bar">
                  <div class="number-box">
                    <div class="number-dot" :class="noteItem.topDot?'number-dot-show':''"></div>
                    <div class="number-half" :class="noteItem.half?'number-half-show':''"><span
                        class="note-number">{{ noteItem.number }}</span></div>
                    <div class="number-dot" :class="noteItem.bottomDot?'number-dot-show':''"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100%">
      <div style="background-color: white;height: 10vh;width: 100%">
        <!--   FOOT     -->
      </div>
    </div>
  </div>
</template>

<script setup>
import chordConfig from "@/page/guitar/chord.config";
import {onMounted, reactive, ref} from "vue";
import Chord from "@/page/guitar/chord.vue";

const noteTable = ref();

const state = reactive({
  activeNote: [0, 0],
  interval: undefined,
  //每帧时间
  interValTime: 10,
  //运行时间
  intervalRunTime: 0,
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
  barStack: [],
  barLength: 10
})

let keyIndex = 0;
const getNoteItemKey = () => {
  keyIndex++;
  return `NoteItem_${keyIndex}`
}

const pushBar = (pushSize) => {
  for (let i = 0; i < pushSize; i++) {
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
    let barItem = [];
    let randomFretStringIndex = 0;
    for (let i = 0; i < beatNoteStack.length; i++) {
      let note = beatNoteStack[i];
      if (note > 0) {
        let fretString = randomFretStringArr[randomFretStringIndex];
        let pitchName = chordConfig.pitchNames[fretString.string - 1][fretString.fret];
        barItem.push({
          note: note,
          ...fretString,
          ...pitchName
        })
        randomFretStringIndex++;
      } else {
        barItem.push({
          note: note
        });
      }
    }
    //移除头部小节
    if (state.barStack.length >= state.barLength) {
      state.barStack.splice(0, 1);
    }
    //追加新小节
    state.barStack.push(barItem);
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

const noteIntervalEvent = () => {
  if (state.barStack.length < state.barLength) {
    pushBar(state.barLength - state.barStack.length);
  } else {
    const barTime = 60000 / state.speed * state.barBeat;
    if (state.intervalRunTime % barTime < state.interValTime) {
      pushBar(1);
    }
  }
}

const animationIntervalEvent = () => {
  const barTime = 60000 / state.speed * state.barBeat;
  if (noteTable.value.children[0]) {
    let barHeight = noteTable.value.children[0].clientHeight;
    let marginTop = state.intervalRunTime % barTime / barTime * barHeight;
    noteTable.value.style = `margin-top:${-marginTop}px`;
  }
}

const startInterval = () => {
  if (state.interval !== undefined) {
    clearInterval(state.interval);
    state.interval = undefined;
    return;
  }

  state.interval = setInterval(() => {
    noteIntervalEvent();
    animationIntervalEvent();
    state.intervalRunTime += state.interValTime;
  }, state.interValTime)
}

onMounted(() => {
  pushBar(state.barLength - state.barStack.length - 1);
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
  display: flex;
  flex-direction: column;
}

.bar-content {
  display: flex;
}

.bar-line {
  width: 100%;
  display: flex;
  padding-top: 10px;
  padding-bottom: 20px;
  flex-direction: column;
}

.chord-line {
  display: flex;
}

.string-line {
  width: 100%;
  display: flex;
}

.number-line {
  width: 100%;
  display: flex;
  border-left: 2px solid black;
  padding-top: 20px;
  margin-bottom: 10px;
}

.note-item {
  width: 40px;
  text-align: center;

  .note-string {
    display: block;
    width: 100%;
    margin-top: 10px;
    height: 2px;
    background-color: black;
    line-height: 0px;
  }

  .note-number {
    font-weight: lighter;
    margin-left: -5px;
  }
}

.number-top-dot:before {
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: black;
}

.number-bottom-dot:after {
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: black;
}

.number-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 30px;
}

.number-dot {
  width: 3px;
  height: 3px;
  border-radius: 3px;
  background-color: transparent;
  margin: 0 auto;
}

.number-dot-show {
  background-color: #464646;
}

.note-tab {
  height: 100%;
  border-left: 2px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  float: left;
}

.note-tab-end {
  height: 100%;
  border-right: 2px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  float: right;
}

.note-tab-text {
  font-size: 20px;
  line-height: 20px;
  display: inline-block;
}

.number-half:before {
  content: '#';
  width: 0;
  margin-left: 5px;
  float: left;
  font-weight: lighter;
  display: inline-block;
  color: transparent;
}

.number-half-show:before {
  color: black;
}

.bar-start {
  display: flex;
  flex-direction: column;
  height: 100%;
  float: left;
  width: 4px;

  .bar-start-top {
    display: inline-block;
    height: 6px;
    width: 8px;
    background-color: black;
    border-radius: 0 0 200% 0;

    &:before {
      content: '';
      display: inline-block;
      height: 4px;
      width: 8px;
      background-color: white;
      border-radius: 0 0 200% 0;
      float: left;
    }
  }

  .bar-start-center {
    flex: 1;
    border-left: 3px solid black;
  }

  .bar-start-bottom {
    display: inline-block;
    height: 6px;
    width: 8px;
    background-color: black;
    border-radius: 0 200% 0 0;

    &:before {
      margin-top: 2px;
      content: '';
      display: inline-block;
      height: 4px;
      width: 8px;
      background-color: white;
      border-radius: 0 200% 0 0;
      float: left;
    }
  }
}
</style>
