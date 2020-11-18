<!--  -->
<template>
  <div>
    <playback-image v-for="item in data" :key="item.id" :data="item"></playback-image>
  </div>
</template>

<script>
import playbackImage from '@/titancare/views/content/playback/playback.image'
export default {
  props: {
    data: Array
  },
  data () {
    return {
    }
  },

  components: {
    playbackImage
  },

  computed: {},

  mounted () { },

  methods: {}
}

</script>
<style lang='scss' scoped>
</style>
