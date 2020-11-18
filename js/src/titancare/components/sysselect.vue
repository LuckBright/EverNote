<template>
  <div>
    <el-radio-group v-if="type === 'radio'" v-model="input" :disabled="disabled" @change="change">
      <el-radio v-for="option in options" :key="option.id" :label="option.id">
        {{option.value}}
      </el-radio>
    </el-radio-group>
    <el-checkbox-group v-else-if="type === 'checkbox'" v-model="input" @change="change">
      <el-checkbox :disabled="disabled" v-for="option in options" :key="option.id" :label="option.id">
        {{option.value}}
      </el-checkbox>
    </el-checkbox-group>
    <el-checkbox v-else-if="type === 'singleCheckbox'" v-model="input" :disabled="disabled" :true-label="labelNumber ? 1 : true" :false-label="labelNumber ? 0 : false" @change="change">
    </el-checkbox>
    <el-select :size="size || 'medium'" v-else v-model="input" v-bind="{'multiple': (field && field.multiple) ? true : false}" filterable :multiple-limit="(field && field.multipleLimit) || 0" :clearable="(clearable || clearable === undefined) ? true : false" :placeholder="placeholder || '请选择'" :value-key="'id'" :default-first-option="true" :disabled="disabled" @change="change">
      <el-option v-for="option in optionsArr" :key="option.id || ''" :label="option.value" :value="option.id">
        <template>
          {{ option.value }}
        </template>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      optionsArr: [],
      postdata: {},
      input: this.value || ''
    }
  },
  props: ['value', 'type', 'disabled', 'options', 'placeholder', 'field', 'obj', 'clearable', 'labelNumber', 'size'],
  created () {
    if (this.options && this.options.length) {
      this.optionsArr = this.options
      // this.optionsArr.map(item => {
      //   if (item) {
      //     console.log(item.id)
      //     item.id = String(item.id)
      //   }
      //   return item
      // })
      // 默认选中第一项
      if (this.field && this.field.firstSelect) {
        this.input = this.optionsArr[0].id
      }
    } else {
      this.optionsArr = []
    }
  },
  computed: {
    select: {
      set (newVal) {
        this.$emit('input', newVal)
      },
      get () {
        return this.value
      }
    }
  },
  methods: {
    change (val) {
      this.$emit('change', val)
    }
  },
  watch: {
    'options' (val) {
      if (val && val.length) {
        this.optionsArr = val
      } else {
        this.optionsArr = []
      }
    },
    'value': {
      handler (val) {
        this.input = val || ''
      },
      deep: true
    },
    'input': {
      handler (val) {
        val = val || ''
        this.$emit('input', val)
        this.change(val)
      },
      deep: true
    }
  }
}
</script>
