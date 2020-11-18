<template>
  <div style="white-space: nowrap;">
    <div class="sex inline">
      <el-select
        class="border"
        :value="value[keyMap[prop]]"
        @change="change"
        placeholder="—"
        clearable
      >
        <el-option
          v-for="(value, key) in keyObj[prop]"
          :label="key"
          :value="key"
          :key="key"
          >{{ key }} {{ value }}</el-option
        >
      </el-select>
    </div>
    <span
      v-show="showText"
      v-for="(value, key) in keyObj[prop]"
      :label="key"
      :value="key"
      :key="key"
      >{{ key }}.{{ value }}
    </span>
    <slot></slot>
  </div>
</template>

<script>
import { keyObj, keyMap } from '../keymap'

export default {
  props: {
    prop: String,
    value: Object,
    showText: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      keyMap,
      keyObj
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  methods: {
    change (val) {
      this.$emit('change', keyMap[this.prop], val)
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
.border {
  border: 1px solid black;border-bottom: 0px;height:24px;margin-top: 1px
}
</style>
