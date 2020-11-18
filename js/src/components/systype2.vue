<template>
  <!-- <el-radio-group v-model="selected" class="systype">
    <template v-for="option in options">
      <el-radio
        :key="option.id"
        :label="option"
        >
        {{option.name}}
        <el-input v-if="option.type=='input'" v-model="option.value" style="display:inline"></el-input>
      </el-radio>
      <ever-rate v-if="option.type=='rate'" v-model="option.value" style="display:inline"></ever-rate>
    </template>
  </el-radio-group> -->
  <el-select v-model="selected"
             filterable
             remote
             clearable
             placeholder="请选择"
             class="systype"
             :allow-create="allowCreate"
             :remote-method="seach"
             :loading="loading"
             :disabled="disabled||false"
             @clear="seach('')">
    <el-option v-for="option in options"
               :key="option.code"
               :label="option | formatLang"
               :value="option.name">
      {{option | formatLang}}
    </el-option>
  </el-select>
</template>

<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
import { debounce } from 'lodash'
let source

export default {
  props: ['id', 'value', 'filtercodes', 'allowCreate', 'disabled'],
  data () {
    return {
      options: [],
      oldQuery: '',
      loading: false
    }
  },
  mounted () {
    this.dataLoad()
    this.debounceLoad = debounce(this.dataLoad, 200)
  },
  computed: {
    selected: {
      set (val) {
        this.$emit('input', val)
      },
      get () {
        return this.value
      }
    }
  },
  watch: {
  },
  methods: {
    dataLoad (query = '', clear = false, cb) {
      if (!this.id) {
        cb && cb()
        return
      }
      if (cb && this.loading) {
        source('终止请求')
      }
      cb && (this.loading = true)
      let filtercodes = this.filtercodes || null
      sysvalue.listOnce(this.id, filtercodes, query, clear).then(result => {
        this.options = result
        cb && cb()
      })
    },
    seach (query) {
      // listOnce有缓存机制 通过clear来判断是否读取缓存
      let clear = this.oldQuery !== query
      this.oldQuery = query
      this.debounceLoad(query, clear, () => {
        this.loading = false
      })
    }
  }
}
</script>
<style type="text/css" scoped>
.systype /deep/ .el-checkbox + .el-checkbox {
  margin-left: 0;
}
.systype /deep/ .el-checkbox {
  margin-right: 10px;
}
</style>
