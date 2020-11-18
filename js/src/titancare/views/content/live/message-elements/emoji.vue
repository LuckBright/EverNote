<!--  -->
<template>
  <div>
    <el-popover placement="top" title="" width="500" trigger="click">
      <div>
        <img
          v-for="(url, name) in emojiMap"
          :key="name"
          class="emoji"
          :src="url"
          @click="sendEmoji(name)"
        />
      </div>
      <el-button slot="reference" size="small" type="primary">表情</el-button>
    </el-popover>
  </div>
</template>

<script>
import { EMOJI } from './emoji/index'
export default {
  props: {},
  data () {
    return {
      emojiMap: EMOJI
    }
  },

  components: {},

  computed: {},

  mounted () { },

  methods: {
    sendEmoji (key) {
      this.$emit('send', key)
    }
  }
}

</script>
<style lang='scss' scoped>
.emoji {
  width: 20px;
  height: 20px;
  margin-right: 2px;
  cursor: pointer;
}
</style>
