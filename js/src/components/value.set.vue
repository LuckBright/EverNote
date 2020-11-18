<template>
  <span>
    <el-radio-group v-if="type && type=='radio'" v-model="select" :disabled="disabled" @change="change">
      <el-radio
        v-for="(key,value) in options"
        :key="value"
        :label="value !== null ? String(value) : ''">
        {{key}}
      </el-radio>
    </el-radio-group>

    <el-checkbox-group v-else-if="type && type=='checkbox'" v-model="select" @change="change">
      <el-checkbox
        v-for="(key,value) in options"
        :key="value"
        :label="key"
        :value="value !== null ? String(value) : ''">
        {{key}}
      </el-checkbox>
    </el-checkbox-group>
    <el-select
       v-else
       v-model="select"
       v-bind="{'multiple': (field && field.multiple) ? true : false}"
       filterable
       :disabled="disabled"
       :placeholder="placeholder ? placeholder : '请选择'"
       style="width: 100%"
       :clearable="(clearable || (field && (field.clearable || field.clearable === undefined))) ? true : false"
       @change="change">
      <el-option
        v-for="(key,value) in options"
        :key="value"
        :label="key"
        :value="value !== null ? String(value) : ''">
      </el-option>
    </el-select>
  </span>
</template>

<script>
  export default {
    props: ['value', 'type', 'disabled', 'placeholder', 'clearable', 'options', 'field'],
    data () {
      return {
        locading: false
      }
    },
    computed: {
      select: {
        set (newVal) {
          this.$emit('input', newVal !== null ? newVal : '')
        },
        get () {
          return this.value !== null ? this.value : ''
        }
      }
    },
    methods: {
      change (val) {
        this.$emit('change', val)
      }
    }
  }
</script>
