<template>
  <div>
    <el-select size="mini" :value="termValue" placeholder="请选择条件属性"
               @change="selectChange"
               :class="{'term-select': true,'term-select-choose':tditem.term}">
      <el-option
        v-for="item in termOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        <span style="float: left">{{ item.label }}</span>
      </el-option>
    </el-select>
    <el-cascader
      v-show="termValue && termValue !== 3"
      separator="的"
      class="term-select"
      size="mini"
      :value="cascaderValue"
      :options="cascaderOptions"
      :props="{ expandTrigger: 'hover' }"
      @change="cascaderChange"
      :placeholder="'请选择' + getLabel(termValue)"
    />
    <el-input inline="" v-show="termValue && termValue === 3" type="text" v-model="tditem.value" class="term-select"
              size="mini"></el-input>
  </div>
</template>

<script>
export default {
  name: 'rule-select',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    termOptions: {
      type: Array,
      default: () => []
    },
    cascaderOptions: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      termValue: {},
      cascaderValue: {}
    }
  },
  watch: {
    modelValue: {
      handler (val) {
        if (val.termValue) {
          this.termValue = val.termValue
          this.cascaderValue = val.cascaderValue
        }
      },
      immediate: true
    }
  },
  methods: {
    cascaderChange (val) {
      this.$emit('changeValue', {
        termValue: this.termValue,
        cascaderValue: val
      })
    },
    selectChange (val) {
      this.$emit('changeValue', {
        termValue: val,
        cascaderValue: this.cascaderValue
      })
    }
  }
}
</script>

