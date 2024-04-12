<template>
  <div style="padding: 10px">
    <div class="line">
      <audio controls>
        <source :src="state.audioSrc" type="audio/wav"/>
      </audio>
    </div>
    <div class="line">
      <button @click="play">play</button>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";

const audioRef = ref();

const state = reactive({
  audioSrc: undefined
})

const getIntArr = (bits, num, size) => {
  let max = 2 << bits - 1;
  let result = [];
  while (result.length < size) {
    if (num > 0) {
      let item = num % max;
      result.push(item);
      num = Math.floor((num - item) / max);
    } else {
      result.push(0);
    }
  }
  return result;
}

const getRiffChunk = ({otherSize}) => {
  //RIFF 标志 4B
  const riff = ['RIFF'];
  //剩余内容字节数 4B
  let afterLengthBlock = getIntArr(8, otherSize + 4, 4);
  console.log(afterLengthBlock)
  //WAVE 标志 4B
  const wave = ['WAVE'];
  let result = [riff, afterLengthBlock, wave]
  return transferToCharArr(result);
}

const getFmtChunk = ({channels, sampleRate, bitsPerSample}) => {
  //FMT 波形标志 4B
  const fmt = ['fmt '];
  //Format chunk 大小 4B
  const formatChunkSizeData = getIntArr(8, 16, 4);
  //编码格式 PCM 2B
  const codeTypeData = getIntArr(8, 1, 2);
  //声道数目 2B
  const channelsData = getIntArr(8, channels, 2);
  //采样频率 4B
  const sampleRateData = getIntArr(8, sampleRate, 4);
  //每秒字节数 4B
  const bps = channels * sampleRate * bitsPerSample / 8;
  const bpsDta = getIntArr(8, bps, 4);
  //每个采样点所需的字节数 2B
  const blockAlign = channels * bitsPerSample / 8;
  const blockAlignData = getIntArr(8, blockAlign, 2);
  //量化位数 2B
  const bitsPerSampleData = getIntArr(8, bitsPerSample, 2);
  let result = [fmt, formatChunkSizeData, codeTypeData, channelsData, sampleRateData, bpsDta, blockAlignData, bitsPerSampleData];
  return transferToCharArr(result);
}

const getDataChunk = (pcmDataArr) => {
  //'data'标识符 4B
  const dataSignArr = ['data'];
  //音频数据的长度 4B
  const dataLengthArr = getIntArr(8, pcmDataArr.length, 4);
  let result = [dataSignArr, dataLengthArr, pcmDataArr]
  return transferToCharArr(result);
}

//转换为char数组
const transferToCharArr = (dataArr) => {
  let result = [];
  for (let i = 0; i < dataArr.length; i++) {
    const headItemArr = dataArr[i];
    for (let j = 0; j < headItemArr.length; j++) {
      const headItem = headItemArr[j];
      if (typeof headItem === "number") {
        result.push(headItem);
      } else if (typeof headItem === "string") {
        for (let m = 0; m < headItem.length; m++) {
          result.push(headItem.charCodeAt(m));
        }
      }
    }
  }
  return result;
}

//[261.6, 293.6, 329.6, 349.2, 392, 440, 493.8]
const getPMCData = ({channels, sampleRate, bitsPerSample}) => {
  const demoRate = 261.6;
  let maxEnergy = 2 << bitsPerSample - 1;
  let second = 2;
  let maxCursor = second * sampleRate;

  const attackTime = 0.01;
  const releaseTime = 0.2;

  const f = (maxY, maxX, rate, x) => {
    const note = Math.sin(2 * Math.PI * rate * x / maxX);
    let t = 0;
    if (x < maxX * attackTime) {
      t = 1 / (maxX * attackTime);
    } else if (x < maxX * (releaseTime + attackTime)) {
      t = 1 - 0.2 * (maxX * releaseTime);
    } else if (x < maxX * (releaseTime + attackTime + attackTime)) {
      t = 0.8 - 0.8 * (maxX * releaseTime);
    }
    const y = note * t;
    return y;
  }

  let cursor = 0;
  let result = [];
  while (cursor < maxCursor) {
    const y = f(maxEnergy, maxCursor, demoRate, cursor);
    const data = getIntArr(8, y, bitsPerSample / 8)
    result.push(...data.reverse());
    cursor++;
  }

  //测试
  /*let blob = new Blob([new Uint8Array(result)], {type: "application/octet-binary"});//把二进制的码转化为blob类型
  let url = URL.createObjectURL(blob);
  window.open(url)*/

  return result;
}

const getWavDataUrl = (config) => {
  const fmtChunk = getFmtChunk(config);
  const pcmData = getPMCData(config);
  const dataChunk = getDataChunk(pcmData);
  const otherSize = fmtChunk.length + dataChunk.length;
  const riffChunk = getRiffChunk({otherSize});
  const waveData = new Uint8Array([...riffChunk, ...fmtChunk, ...dataChunk]);
  console.log(`waveData:${waveData}`);
  let result = '';
  let cursor = 0;
  const chunkSize = 8 * 1024;
  while (cursor < waveData.length) {
    const nextIndex = cursor + chunkSize;
    result += String.fromCharCode.apply(null,
        waveData.slice(cursor, nextIndex < waveData.length ? nextIndex : waveData.length - 1));
    cursor += chunkSize
  }
  let base64DataUrl = `data:audio/wav;base64,${window.btoa(result)}`;
  return base64DataUrl
}

const play = () => {
  const config = {
    channels: 1,
    sampleRate: 44100,
    bitsPerSample: 16
  }
  state.audioSrc = getWavDataUrl(config);
}

onMounted(() => {
  play();
})

</script>

<style scoped>
.line {
  height: 50px;
  width: 100%;
}

</style>
