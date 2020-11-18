<template>
  <img class="mr10" @error="errorIcon($event)" :src="src || ''" :alt="alt || src">
</template>

<script>
export default {
  props: ['src', 'alt', 'type'],
  data () {
    return {
    }
  },
  methods: {
    errorIcon (event) {
      let img = event.srcElement
      let _defaultImg = ''
      switch (this.type) {
        case 1:
          _defaultImg = '/assets/img/facebg.png'
          break
        case 2:
          _defaultImg = '/assets/img/uploadbg.png'
          break
        case 3:
          _defaultImg = '/assets/img/smile.png'
          break
        case 4:
          _defaultImg = '/assets/img/kong.png'
          break
        default:
          _defaultImg = '/assets/img/avtarbg.png'
      }
      img.src = _defaultImg
      img.onerror = null
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
