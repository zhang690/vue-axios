<template>
  <div>
    <div @click="getInfo">axios请求</div>
    <div><button @click="goAxios">axios封装笔记</button></div>
    <div>{{ audioName }}</div>
    <button @click="playAudio">播放</button>
    <button @click="pauseAudio">暂停</button>
    <button @click="getInfo">获取信息</button>
    <button @click="reLoad">重新加载</button>
    <button @click="setCurrent">设置到40秒播放</button>
    <button @click="setMuted">静音</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      audioSrc: '',
      audioName: '',
      audio: '',
    };
  },
  methods: {
    goAxios(){
      this.$router.push('/Axios')
    },
    playAudio() {
      console.log('播放');
      this.audio.play();
    },
    pauseAudio() {
      console.log('暂停');
      this.audio.pause();
    },
    getInfo() {
      console.log('paused', this.audio.paused);
      console.log('currentTime', this.audio.currentTime);
      console.log('duration', this.audio.duration);
      console.log('playbackRate', this.audio.playbackRate);
      console.log('muted', this.audio.muted);
      console.log('mediaGroup', this.audio.mediaGroup);
    },
    setCurrent() {
      this.audio.currentTime = 40;
    },
    reLoad() {
      this.audio.load();
    },
    setMuted() {
      if (this.audio.muted) {
        this.audio.muted = false;
      } else {
        this.audio.muted = true;
      }
    },
  },
  mounted() {
    this.$axios
      .post(
        'http://192.168.1.198:9501/api/getAudioDetail',
        this.$qs.stringify({ audio_id: 1 })
      )
      .then((res) => {
        console.log(res);
        this.audio = new Audio();
        this.audio.autoplay = true;
        this.audioSrc = this.$baseURL + res.data.data.audio_file;
        this.audio.src = this.audioSrc;
        this.audioName = res.data.data.audio_name;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped lang="less">
button {
  display: block;
  margin-top: 18px;
}
</style>
