
<!--
  表单内的患者选择组件 by lvjiangtao@everjiankang.com
-->
<template>
  <span>
    <el-select
      v-model="select"
      filterable
      clearable
      remote
      :disabled="disabled"
      :style="{width:(width || '100%')}"
      :placeholder="placeholder"
      :remote-method="remoteMethod"
      :size="size"
      @change="change"
    >
      <el-option v-for="item in patients" :key="item.id" :label="item.name" :value="item.id">
        <span class="option-field">{{ item.name }}</span>
        <span class="option-field">
          <sys-value type="GBT.2261.1" :code="item.sex"></sys-value>
        </span>
        <span class="option-field">{{ item.ageShowText }}</span>
        <span class="option-field">{{ item.mobile }}</span>
      </el-option>
    </el-select>
  </span>
</template>
<script>
import { passport } from '@/card/store/passportapi'

export default {
  props: {
    'value': {
      type: String,
      value: ''
    },
    'placeholder': {
      type: String,
      value: '患者姓名/健保卡/病案号'
    },
    'disabled': {
      type: Boolean,
      default: false
    },
    'size': {
      type: String,
      value: 'small'
    },
    'width': {
      type: 'string'
    }
  },
  data () {
    return {
      patients: []
    }
  },
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        query = query && String(query).trim()
        passport.get('patient/searchFuzzy', {
          params: {
            keyword: query,
            offset: 0,
            pagesize: 10
          }
        }).then(results => {
          this.patients = results.data.resultList
        })
      }
    },
    change (val) {
      if (!val) this.remoteMethod()
      this.$emit('input', val)
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
  created () {
    this.remoteMethod(this.value)
  },
  watch: {
    'value' (val) {
      if (val) {
        this.remoteMethod(val)
      }
    }
  }
}
</script>
<style scoped>
p {
  margin: 0;
}
.option-field {
  display: inline-block;
  margin-right: 10px;
}
</style>
