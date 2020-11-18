<template>
  <div style="white-space: nowrap;">
    <div class="sex inline">
      <el-select :value="value[keyMap[prop]]" @change="change" placeholder="—" clearable>
        <el-option
          v-for="(value,key) in keyObj[prop]"
          :label="key"
          :value="key"
          :key="key"
        >{{key}} {{value}}</el-option>
      </el-select>
    </div>
    <span v-for="(value,key) in keyObj[prop]" :label="key" :value="key" :key="key">{{key}}.{{value}} </span>
  </div>
</template>

<script>
import { keyObj, keyMap } from './keymap'

export default {
  props: {
    prop: String,
    value: Object
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
</style>
