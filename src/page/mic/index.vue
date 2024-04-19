<template>
  <div>
    <div>
      <canvas style="width: 400px;height: 200px" ref="canvasRef"></canvas>
    </div>
    <div class="note-line">
      <span>历史高强度音:</span>
      <span v-for="noteKey in state.strongNoteHistory">{{ noteKey }}、</span>
    </div>
    <div class="note-line">
      <span>已识别音:</span>
      <span v-for="(data,noteKey) in state.highFrequencyNoteMap">{{ noteKey }}、</span>
    </div>
    <div class="note-line">
      <span>持续音（>=0.1s）:</span>
      <span v-for="(data,noteKey) in state.highFrequencyNoteMap">
        <template v-if="data.continueTime >= 100">{{ noteKey }}、</template>
      </span>
    </div>
    <div>
      <button @click="testMic">测试麦克风</button>
    </div>
  </div>
</template>
<script setup>

import {reactive, ref} from "vue";
import Recorder from 'js-audio-recorder'
import {noteMap} from "@/page/sound/sound.config";

const state = reactive({
  animationEnable: true,
  highFrequencyNoteMap: {},
  strongNoteHistory: []
})


const canvasRef = ref();

let recorder = undefined;

const testMic = () => {
  if (recorder && state.animationEnable) {
    // 暂停录音
    recorder.pause();
    state.animationEnable = false;
  } else if (recorder && !state.animationEnable) {
    // 继续录音
    recorder.resume()
    state.animationEnable = true;
  }
  if (recorder === undefined) {
    recorder = new Recorder({
      sampleBits: 8,         // 采样位数，支持 8 或 16，默认是16
      sampleRate: 16000,      // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1,         // 声道，支持 1 或 2， 默认是1
    });
    const canvasCtx = canvasRef.value.getContext("2d");
    recorder.start().then(function () {
      let printOnce = 1;

      function draw() {
        let dataArray = new Uint8Array(recorder.analyser.frequencyBinCount);
        recorder.analyser.getByteFrequencyData(dataArray)
        const WIDTH = canvasRef.value.width
        const HEIGHT = canvasRef.value.height;
        requestAnimationFrame(draw);
        if (!state.animationEnable) {
          return;
        }
        printOnce += 1;
        if (printOnce === 100) {
          console.log(dataArray);
        }
        canvasCtx.fillStyle = 'rgb(232,232,232)'
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(149,209,255)';
        canvasCtx.beginPath();
        let sliceWidth = WIDTH * 1.0 / dataArray.length;
        let x = 0;
        let maxData = 0;
        let bigIndex = [];
        const nowTime = new Date().getTime();
        for (let i = 0; i < dataArray.length; i++) {
          const visualData = dataArray[i];
          const frequency = (i + 1) * 20000 / 1024;
          const noteKey = getNoteKeyByFrequency(frequency);
          const recordNote = state.highFrequencyNoteMap[noteKey];
          if (visualData > 128
              || (visualData > 64 && recordNote !== undefined)
              || (visualData > 10 && recordNote !== undefined && nowTime - recordNote.beginTime < 1000)) {
            bigIndex.push(i);
          }
          if (visualData > maxData) {
            maxData = visualData;
          }
          let strong = visualData / 256;
          let y = HEIGHT - strong * HEIGHT;
          canvasCtx.moveTo(x, HEIGHT);
          canvasCtx.lineTo(x, y);
          x += sliceWidth;
        }
        canvasCtx.stroke();
        canvasCtx.beginPath();
        //强频率
        canvasCtx.strokeStyle = 'rgb(22,141,255)';
        let highFrequencyNoteMap = {};
        let strongNoteHistory = [];
        for (let j = 0; j < bigIndex.length; j++) {
          const index = bigIndex[j];
          const strong = dataArray[index] / 256;
          const y = HEIGHT - HEIGHT * strong;
          canvasCtx.moveTo(sliceWidth * index, HEIGHT);
          canvasCtx.lineTo(sliceWidth * index, y);
          //处理强频率
          const frequency = (index + 1) * 20000 / 1024;
          const noteKey = getNoteKeyByFrequency(frequency);
          if (noteKey !== undefined && highFrequencyNoteMap[noteKey] === undefined) {
            highFrequencyNoteMap[noteKey] = {
              beginTime: nowTime,
              maxStrong: strong,
              continueTime: 0
            }
            if (strong > 0.9) {
              strongNoteHistory.push(noteKey);
            }
          }
        }
        if (strongNoteHistory.length > 0) {
          state.strongNoteHistory = strongNoteHistory;
        }
        canvasCtx.stroke();
        //合并上一帧识别结果
        for (const noteKey in highFrequencyNoteMap) {
          const oldData = state.highFrequencyNoteMap[noteKey];
          let newData = highFrequencyNoteMap[noteKey];
          if (oldData !== undefined) {
            newData.beginTime = oldData.beginTime;
            newData.maxStrong = oldData.maxStrong;
            newData.continueTime = nowTime - oldData.beginTime;
          }
        }
        state.highFrequencyNoteMap = highFrequencyNoteMap;
      }

      draw();
    });
  }
}

const getNoteKeyByFrequency = (f) => {
  let key = undefined;
  for (let i = 0; i < noteMap.length - 1; i++) {
    const f1 = f - noteMap[i].f;
    const f2 = f - noteMap[i + 1].f;
    if (f1 >= 0 && f2 <= 0) {
      key = f1 + f2 < 0 ? noteMap[i].k : noteMap[i + 1].k;
      break;
    }
  }
  return key;
}


</script>
<style lang="less" scoped>
.note-line {
  word-break: keep-all;
}
</style>
