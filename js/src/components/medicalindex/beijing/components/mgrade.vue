<template>
  <div>
    <el-select
      v-if="!prop"
      :value="value[SHOU_SHU_JI_BIE]"
      @change="change"
      placeholder="—"
      clearable
    >
      <el-option v-for="n in 4" :label="n" :value="n" :key="n"></el-option>
    </el-select>
  </div>
</template>

<script>
import { keyMap } from '../keymap'

export default {
  props: {
    value: Object,
    index: Number,
    prop: String
  },
  data () {
    return {
      ...keyMap
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  methods: {
    change (val) {
      this.$emit('change', this.SHOU_SHU_JI_BIE, val, this.index)
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
.sex {
  width: 50px;
  margin-right: 2px;
}
.inline {
  display: inline-block;
}
</style>
