<!--  -->
<template>
  <div>
    <el-dialog
      v-if="visible"
      :visible="visible" 
      @update:visible="updateVisible"
      append-to-body
      width="700px"
    >
      <msgvideoplayer :src="src" size="big" :autoplay="true"></msgvideoplayer>
      <div slot="footer">
        <el-button @click="updateVisible(false)">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import msgvideoplayer from '@/phr/component/msgvideoplayer'

export default {
  props: {
    visible: Boolean,
    src: String
  },
  data () {
    return {
    }
  },
  computed: {
  },
  components: {
    msgvideoplayer
  },

  mounted () { },
  created () {
  },
  methods: {
    updateVisible (data) {
      this.$emit('update:visible', data)
    },
  }
}

</script>
<style lang='scss' scoped>
</style>
