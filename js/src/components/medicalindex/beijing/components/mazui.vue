<template>
  <el-popover placement="bottom" width="400" trigger="click">
    <sys-type
      v-if="show"
      clearable
      placeholder="—"
      size="mini"
      code="CV06.00.103"
      :value="value[MA_ZUI_FANG_SHI_VALUE]"
      @change="change"
      :use-object="true"
    ></sys-type>
    <el-input
      @focus="show = true"
      type="textarea"
      slot="reference"
      resize="none"
      :rows="3"
      placeholder="—"
      v-model="value[MA_ZUI_FANG_SHI_VALUE]"
    ></el-input>
  </el-popover>
</template>

<script>
import { keyMap } from '../keymap'
const { MA_ZUI_FANG_SHI_VALUE } = keyMap
export default {
  props: {
    value: Object,
    index: Number
  },
  data () {
    return {
      show: false,
      MA_ZUI_FANG_SHI_VALUE,
      info: ''
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  methods: {
    change (val) {
      const { name, code } = val
      this.$emit('change', { name, code }, this.index)
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
</style>
