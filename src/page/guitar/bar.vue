<template>
  <div class="bar-line">
    <div class="chord-line">
      <div class="note-item"></div>
      <template v-for="noteItem in props.item.noteList">
        <div class="note-item">
          <div class="chord-box"
               v-if="noteItem.beginChord">
            <chord :name="noteItem.chordName"></chord>
          </div>
        </div>
      </template>
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
              <div class="note-string" v-for="i in 6"></div>
            </div>
          </div>
          <template v-for="(noteItem,noteIndex) in props.item.noteList" :key="noteItem._key">
            <div class="note-item" :id="noteItem._key">
              <div :class="noteIndex===props.item.noteList.length-1 ? 'note-tab-end':''">
                <div class="note-string" v-for="i in 6">
                  <TapNumber v-if="noteItem.string === i"
                             :duration="60000/props.speed"
                             :value="noteItem.fret"
                             :itemKey="noteItem._key"
                             :ref="el => setTapNumber(noteIndex,el)"
                  ></TapNumber>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="number-line">
          <div class="note-item"></div>
          <template v-for="noteItem in props.item.noteList">
            <div class="note-item">
              <div class="number-box">
                <div class="number-dot" :class="noteItem.topDot?'number-dot-show':''"></div>
                <div class="number-half" :class="noteItem.half?'number-half-show':''"><span
                    class="note-number">{{ noteItem.number }}</span></div>
                <div class="number-dot" :class="noteItem.bottomDot?'number-dot-show':''"></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {defineProps, defineExpose, onMounted, reactive} from "vue";
import Chord from "@/page/guitar/chord.vue";
import TapNumber from "@/page/guitar/tap-number";

const props = defineProps({
  item: {
    required: true
  },
  speed: {
    required: true,
    type: Number
  }
})

const tapNumberArr = {};
const setTapNumber = (noteIndex, ref) => {
  tapNumberArr[noteIndex] = ref;
}


const getTapNumber = (noteIndex) => {
  return tapNumberArr[noteIndex];
}

defineExpose({
  getTapNumber
});
</script>
<style lang="less" scoped>

.bar-content {
  display: flex;
}

.bar-line {
  display: flex;
  padding-top: 10px;
  padding-bottom: 20px;
  flex-direction: column;
}

.chord-line {
  display: flex;
}

.string-line {
  display: flex;
}

.number-line {
  display: flex;
  border-left: 2px solid black;
  padding-top: 20px;
  margin-bottom: 10px;
}

.note-item {
  width: 35px;
  text-align: center;

  .note-string {
    display: block;
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
  border-right: 2px solid black;
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
      height: 5px;
      width: 9px;
      background-color: white;
      border-radius: 0 0 200% 0;
      float: left;
      margin-left: -1px;
      margin-top: -1px;
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
      height: 5px;
      width: 9px;
      background-color: white;
      border-radius: 0 200% 0 0;
      float: left;
      margin-left: -1px;
    }
  }
}
</style>
