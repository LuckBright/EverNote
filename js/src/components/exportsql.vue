<template>
  <el-button-group>
    <el-button v-ever-click-once="disabled" :disabled="disabled" @click="exportSql(2)">导出sql</el-button>
    <el-button v-ever-click-once="disabled1" :disabled="disabled1" @click="exportSql(1)">全量导出</el-button>
  </el-button-group>
</template>
<script>
import { dateFormat } from '@/util/common'
import { downloadSql } from '@/components/ever-upload-helper'

export default {
  props: {
    'expUrl': {
      type: String,
      default: ''
    },
    'filePrefix': {
      type: String,
      default: ''
    },
    'selectArr': {
      type: Array,
      default: []
    },
    'expParams': {
      type: Object,
      default () {
        return {}
      },
    }
  },
  data () {
    return {
      disabled: false,
      disabled1: false,
    }
  },
  methods: {
    exportSql (exportType) {
      let params, fileName
      if (exportType === 2) {
        if (this.selectArr.length === 0) {
          this.$messageTips(this, 'error', '请选择需要导出的内容')
          return
        } else {
          params = {
            exportType: 2,
            ids: this.selectArr
          }
          fileName = this.filePrefix + '-' + dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss') + '.sql'
        }
      } else {
        params = {
          exportType: 1
        }
        fileName = this.filePrefix + '-全量-' + dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss') + '.sql'
      }
      if (this.expParams) {
        Object.assign(params, this.expParams)
      }
      let url = this.$ever.api + '/' + this.expUrl
      downloadSql(url, params, fileName)
    }
  },
}
</script>
