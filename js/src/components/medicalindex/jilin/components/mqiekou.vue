<template>
  <div>
    <el-select @focus="mixOptions" :value="value[prop]" @change="change" clearable placeholder="—" size="mini">
      <el-option
        v-for="item in levelOprions"
        :key="item.value"
        :label="item.label"
        :value="item.label"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { keyMap } from '../keymap'
import sysvalue from '@/warehouse/store/sysvalueapi'

export default {
  props: {
    value: Object,
    index: Number,
    prop: String
  },
  data () {
    return {
      ...keyMap,
      levelOprions: []
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  methods: {
    change (val) {
      this.$emit('change', this.YU_HE_DENG_JI, val, this.index)
    },
    async mixOptions () {
      let level = await sysvalue.listOnce('CV05.10.022') // 手术级别
      level = Array.isArray(level) ? level : []
      let code = await sysvalue.listOnce('CV05.10.023')
      code = Array.isArray(code) ? code : []
      this.levelOprions = []
      let index = 0
      level.map((item, _index) => {
        const subIndex = _index === 0 ? 1 : _index
        const _label = item.name.substr(0, subIndex)
        code.map(code => {
          const label = _label + '/' + code.name
          this.levelOprions.push({ label: label, value: `${index++}` })
        })
      })
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
