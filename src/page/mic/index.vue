<template>
  <div>
    <canvas style="width: 400px;height: 200px" ref="canvasRef"></canvas>
    <button @click="testMic">测试麦克风</button>
  </div>
</template>
<script setup>

import {reactive, ref} from "vue";
import Recorder from 'js-audio-recorder'

const state = reactive({
  animationEnable: true,
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
      sampleRate: 44100,      // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1,         // 声道，支持 1 或 2， 默认是1
    });
    const canvasCtx = canvasRef.value.getContext("2d");
    recorder.start().then(function () {
      let printOnce = 1;

      function draw() {
        let dataArray = new Uint8Array(recorder.analyser.frequencyBinCount);
        recorder.analyser.getByteFrequencyData(dataArray)
        //let dataArray = recorder.getRecordAnalyseData();
        const WIDTH = canvasRef.value.width
        const HEIGHT = canvasRef.value.height;
        requestAnimationFrame(draw);
        if (!state.animationEnable) {
          return;
        }
        if (printOnce === 100) {
          console.log(dataArray);
        }
        printOnce += 1;
        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx.beginPath();
        let sliceWidth = WIDTH * 1.0 / dataArray.length;
        let x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          let v = dataArray[i] / 128.0;
          let y =  HEIGHT - v * HEIGHT / 2;
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();
      }

      draw();
    });
  }
}


</script>
<style lang="less" scoped>

</style>
