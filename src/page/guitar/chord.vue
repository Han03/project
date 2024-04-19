<template>
  <div class="chord-box">
    <div class="chord-name">
      {{ name }}
    </div>
    <div class="chord-content">
      <div class="chord-sign"></div>
      <div class="chord-table">
        <div class="chord-fret" v-for="fret in state.maxFret">
          <div class="chord-string" v-for="string in 6" :class="string === 6 ? 'chord-string-last' : '' ">
            <div class="string-dot" v-if="state.fretInfo[fret] && state.fretInfo[fret][7-string]!==undefined"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {defineProps, onMounted, reactive} from "vue";
import {chordMap} from "@/page/guitar/chord.config";

const state = reactive({
  maxFret: 3,
  fretInfo: {}
})

const props = defineProps({
  name: {
    required: true,
    type: String
  }
})

const init = () => {
  const chordInfo = chordMap[props.name];
  if (chordInfo === undefined) return;
  let fretInfo = {};
  let maxFret = 0;
  for (let i = 0; i < chordInfo.length; i++) {
    const fret = chordInfo[i].fret;
    maxFret = fret > maxFret ? fret : maxFret;
    const string = chordInfo[i].string;
    const finger = chordInfo[i].finger;
    if (fretInfo[fret] === undefined) {
      fretInfo[fret] = {};
    }
    fretInfo[fret][string] = finger;
  }
  state.maxFret = maxFret < 3 ? 3 : maxFret;
  state.fretInfo = fretInfo;
}

init();
</script>
<style lang="less" scoped>
.chord-box {
  display: flex;
  flex-direction: column;
  float: left;

  .chord-name {
    text-align: center;
  }
}

.chord-content {
  display: flex;
  flex-direction: column;

  .chord-sign {
    display: flex;
  }

  .chord-table {
    border-bottom: 1px solid black;
  }
}

.chord-fret {
  display: flex;
  border-top: 1px solid black;

  .chord-string {
    width: 6px;
    height: 7px;
    border-left: 1px solid black;
  }

  .chord-string-last {
    width: 0;
  }

  .string-dot {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &:before {
      content: '';
      width: 4px;
      height: 4px;
      background-color: black;
      border-radius: 100%;
      float: left;
      margin-left: -2px;
    }
  }
}
</style>
