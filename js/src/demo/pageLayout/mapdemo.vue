<template>
  <div class="layout_inner">
    point：{{point}}
    <everMap v-model="point"></everMap>
  </div>
</template>
<script>
import everMap from '@/manages/page/organization/components/map.vue'
export default {
  components: {
    everMap
  },
  data () {
    return {
      // point: {
      //   lng: 118.119641,
      //   lat: 44.597612
      // },
      point: {
        lng: '',
        lat: ''
      },
    }
  },
  created () {
    window.setTimeout(() => {
      this.point = {
        lng: 118.119641,
        lat: 44.597612
      }
    }, 1000)
  }
}
</script>
