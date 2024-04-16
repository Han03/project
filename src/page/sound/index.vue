<template>
  <div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
    <div class="active-note"></div>
    <div class="note-bord">
      <div class="note-button" v-for="(note,index) in soundConfig.noteMap" @click="makeMusic(index)">{{note.k}}</div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import soundConfig from "@/page/sound/sound.config";
import {Howl} from 'howler'

const state = reactive({

})

const getIntArr = (bits, num, size) => {
  let max = 1 << bits;
  let result = [];
  while (result.length < size) {
    if (num > 0) {
      let item = Math.floor(num % max);
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

const getPMCData = ({channels, sampleRate, bitsPerSample, noteIndex}) => {
  let maxEnergy = (1 << bitsPerSample - 1);
  let second = 0.41;
  let maxCursor = second * sampleRate;
  const attackTime = 0.01;
  const releaseTime = 0.2;
  let t = 1;
  let x1 = maxCursor * attackTime;
  let x2 = maxCursor * (attackTime + releaseTime);
  let x3 = maxCursor * (attackTime + releaseTime + releaseTime);
  const fp = (x) => {
    if (x < 0) return 0;
    if (x < x1) {
      t = x / x1;
    } else if (x < x2) {
      t = 0.8 + 0.2 * (x2 - x) / (x2 - x1);
    } else if (x < x3) {
      t = 0.8 * (x3 - x) / (x3 - x2);
    }
    return t;
  }
  const fx = (x, f0) => {
    const note = Math.sin(2 * Math.PI * f0 / sampleRate * x);
    const t = fp(x);
    const y = Math.floor(note * t * maxEnergy);
    return y;
  }

  let result = [];
  const f0 = soundConfig.noteMap[noteIndex].f;
  let cursor = 0;
  while (cursor < maxCursor) {
    const y = fx(cursor, f0);
    const data = getIntArr(8, y, bitsPerSample / 8)
    result.push(...data);
    cursor++;
  }
  return result;
}


const getWavDataUrl = (config) => {
  const fmtChunk = getFmtChunk(config);
  const pcmData = getPMCData(config);
  const dataChunk = getDataChunk(pcmData);
  const otherSize = fmtChunk.length + dataChunk.length;
  const riffChunk = getRiffChunk({otherSize});
  const waveData = [...riffChunk, ...fmtChunk, ...dataChunk];
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

const makeMusic = (noteIndex) => {
  const config = {
    channels: 1,
    sampleRate: 44100,
    bitsPerSample: 16,
    noteIndex: noteIndex
  }
  const soundSrc = getWavDataUrl(config);
  let sound = new Howl({
    src: soundSrc,
    volume: 1.0
  });
  sound.play();
}

onMounted(() => {

})

</script>

<style lang="less" scoped>
.note-bord{
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.note-button{
  width: 80px;
  height: 50px;
  line-height: 50px;
  font-size: 30px;
  font-weight: bold;
}
</style>
