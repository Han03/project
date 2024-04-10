<template>
  <div style="display: flex;flex-direction: column;height: 100%">
    <div style="width: 100%;">
      <div style="background-color: #a6a6a6;height: 10vh;width: 100%;">
        <!--   HEAD     -->
      </div>
    </div>
    <div class="note-page">
      <div class="note-table" ref="noteTable">
        <div v-for="bar in state.barStack" class="bar-line">
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
            <div class="note-item" v-for="noteItem in bar">
              <div class="note-string">{{ noteItem.string === 1 ? noteItem.fret : '' }}</div>
              <div class="note-string">{{ noteItem.string === 2 ? noteItem.fret : '' }}</div>
              <div class="note-string">{{ noteItem.string === 3 ? noteItem.fret : '' }}</div>
              <div class="note-string">{{ noteItem.string === 4 ? noteItem.fret : '' }}</div>
              <div class="note-string">{{ noteItem.string === 5 ? noteItem.fret : '' }}</div>
              <div class="note-string">{{ noteItem.string === 6 ? noteItem.fret : '' }}</div>
            </div>
          </div>
          <div class="number-line">
            <div class="note-item"></div>
            <div class="note-item" v-for="noteItem in bar">
              <div class="number-box">
                <div class="number-dot" :class="noteItem.topDot?'number-dot-show':''"></div>
                <div :class="noteItem.half?'number-half':''"><span>{{ noteItem.number }}</span></div>
                <div class="number-dot" :class="noteItem.bottomDot?'number-dot-show':''"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100%">
      <div style="background-color: #a6a6a6;height: 10vh;width: 100%" @click="startInterval">
        <!--   FOOT     -->
      </div>
    </div>
  </div>
</template>

<script setup>
import chordConfig from "@/page/guitar/chord.config";
import {onMounted, reactive, ref} from "vue";

const noteTable = ref();

const state = reactive({
  activeString: [],
  interval: undefined,
  interValTime: 10,
  intervalRunTime: 0,
  speed: 60,
  barBeat: 4,
  beatNote: 1 / 4,
  minBeatNote: 1 / 8,
  noteRate: [2, 2, 6, 3],
  maxFret: 3,
  barStack: [],
  barLength: 5
})
const pushBar = (pushSize) => {
  for (let i = 0; i < pushSize; i++) {
    let beatNoteStack = [];
    let leftNote = state.barBeat * state.beatNote;
    let barBeatIndex = 0;
    let maxBarBeatIndex = state.barBeat * state.beatNote / state.minBeatNote;
    let barNoteSize = 0;
    let fretStringSize = 0;
    while (barBeatIndex < maxBarBeatIndex) {
      if (barNoteSize > barBeatIndex * state.minBeatNote) {
        beatNoteStack.push(0);
      } else {
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
    let randomFretStringArr = getRandomFretString(fretStringSize);
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
    if (state.barStack.length >= state.barLength) {
      state.barStack.splice(0, 1);
    }
    state.barStack.push(barItem);
  }
}
const getRandomFretString = (size) => {
  let result = [];
  let chordLength = chordConfig.enabledChord.length;
  let chordContinueSize = 0;
  let randomChordName;
  for (let i = 0; i < size; i++) {
    if (chordContinueSize < 1) {
      let useChord = (i === 0 || Math.random() > 0.5) && (size - i > 1);
      if (useChord) {
        let randomChordIndex = Math.floor(Math.random() * chordLength);
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
  console.log(noteTable.value.clientHeight)
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

.bar-line {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.string-line {
  width: 100%;
  display: flex;
}

.number-line {
  width: 100%;
  display: flex;
}

.note-item {
  width: 40px;
  text-align: center;

  .note-string {
    display: block;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    height: 2px;
    background-color: black;
    line-height: 0px;
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
  height: 40px;
}

.number-dot {
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: transparent;
  margin: 0 auto;
}

.number-dot-show {
  background-color: black;
}

.note-tab {
  height: 100%;
  border-left: 2px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  float: left;
}

.note-tab-text {
  font-size: 20px;
  line-height: 20px;
  display: inline-block;
}

.number-half:before {
  content: '#';
  width: 0px;
  display: inline-block;
  float: left;
}
</style>
