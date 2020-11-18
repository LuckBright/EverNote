<template>
  <div class="flex_layout_full layout_box workspace_wrap">
    <router-view class="station_layout_wrap" :key='key' :space='space'></router-view>
  </div>
</template>

<script>
import session from '../../util/session'
import '../assets/workspace.css'
export default {
  mixins: [session],
  data () {
    return {
      key: 1,
      space: '',
    }
  },
  mounted () {

  },
  created () {
    this.space = this.$route.matched[0].meta.space || 'workspace'
  },
  methods: {
  },
  components: {

  },
}
</script>
