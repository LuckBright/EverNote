<template>
  <div class="pos_ab" style="bottom: 5px; right: 10px;">
    <el-button @click="getLogList" size="small" type="text">
      <svg class="icon" style aria-hidden="true">
        <use xlink:href="#icon-caozuo1"></use>
      </svg>
      操作记录
    </el-button>
    <!-- 操作记录 -->
    <control-record-dialog
      :key="visitSn"
      :loading.sync="loading"
      :recordData="controlData"
      :visible.sync="visibleDialog"
      :implementType="implementType"
      :visitSn="visitSn"
    ></control-record-dialog>
  </div>
</template>
<script>
import api from '@/warehouse/page/storages/store/clinicapi'
import controlRecordDialog from '@/warehouse/page/storages/components/controlrecorddialog'
export default {
  props: ['visitSn', 'implementType'],
  data () {
    return {
      controlData: [],
      api,
      visibleDialog: false,
      loading: false
    }
  },
  created () {
    this.loading = false
  },
  methods: {
    getLogList () {
      if (this.visitSn) {
        if (!this.implementType) this.implementType = 2
        this.controlData = []
        this.visibleDialog = true
        this.loading = true
        this.api.getLogList({ visitSn: this.visitSn, implementType: this.implementType }).then(res => {
          if (res) {
            this.loading = false
            this.controlData = res.dispenseLogListJson
            this.handleLogList(this.controlData)
          }
        })
      }
      this.$emit('getLogList')
    },
    // 处理操作记录数据
    handleLogList (data) {
      data.forEach(val => {
        if (val.dispenseLog.action !== '标记异常') {
          let _excute = []
          let _recipe = []
          val.dispenseLogListItemJson.forEach(v => {
            if (v.outpatientDispense.adviceExecuteId) {
              _excute.push(v.outpatientDispense.adviceExecuteId)
            } else if (v.outpatientDispense.recipeCode) {
              _recipe.push(v.outpatientDispense.recipeCode)
            }
          })
          val['_excute'] = _excute
          val['_recipe'] = _recipe
        }
      })
    }
  },
  components: {
    controlRecordDialog
  }
}
</script>
