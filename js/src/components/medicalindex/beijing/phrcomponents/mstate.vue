<template>
  <div class="state">
    <el-select
      v-if="!prop"
      :value="value[index][QI_TA_BING_QING_CODE]"
      @change="change"
      placeholder="—"
      clearable
    >
      <el-option v-for="(str,key) in state" :label="key" :value="key" :key="key">{{key}} {{str}}</el-option>
    </el-select>
    <el-select class="state" v-else-if="prop === 'GUAN_XI'"  :value="value[keyMap[prop]]" @change="change" placeholder="—" clearable>
      <el-option  v-for="(str,key) in keyObj[prop]" :label="str" :value="key" :key="key">{{key}} {{str}}</el-option>
    </el-select>
    <el-select v-else :value="value[keyMap[prop]]" @change="change" placeholder="—" clearable>
      <el-option  v-for="(str,key) in keyObj[prop]" :label="key" :value="key" :key="key">{{key}} {{str}}</el-option>
    </el-select>
  </div>
</template>

<script>
import { keyMap, keyObj } from '../phrmap'

export default {
  props: {
    value: [Array, Object],
    index: Number,
    prop: String
  },
  data () {
    return {
      keyMap,
      keyObj,
      ...keyMap,
      state: {
        1: '有',
        2: '临床未确定',
        3: '情况不明',
        4: '无'
      },
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  methods: {
    change (val) {
      if (this.prop) {
        console.log(this.prop, val)
        this.$emit('change', keyMap[this.prop], val)
      } else {
        this.$emit('change', this.QI_TA_BING_QING_CODE, val, this.index)
      }
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
.state{
  width: 100%
}
</style>
