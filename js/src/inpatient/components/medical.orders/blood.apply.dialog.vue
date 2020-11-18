<template>
  <el-dialog :title="title" :visible.sync="visibleFlag" class="dialogToday ui_dialog_02">
    <phrform :code="tplCode" :visit-id="(baseInfo && baseInfo.visitSn) || $route.query.visitSn" :patient-id="(baseInfo && baseInfo.patientId) || $route.query.patientId" :dpt-id="(baseInfo && baseInfo.providerId) || ($route.query.dptId || $route.query.providerId)" v-model="input" ref="form" :schemaId.sync="schemaId" :data-id="dataId" @success="phrFormSuccess"></phrform>
  </el-dialog>
</template>

<script>
export default {
  /**
   * tplCode: 表单引擎模版CODE
   * dataId: 回显是表单数据id
   * baseInfo: 表单引擎需要的就诊基础信息
   */
  props: ['value', 'tplCode', 'dataId', 'baseInfo', 'title'],
  data () {
    return {
      schemaId: '',
      visibleFlag: false,
      form: {},
      input: this.value
    }
  },
  methods: {
    open () {
      this.visibleFlag = true
    },
    close () {
      this.visibleFlag = false
    },
    phrFormSuccess (val) {
      if (val && val.id && val.id !== '-1') {
        this.close()
      }
    }
  },
  watch: {
    value: {
      handler (val) {
        this.input = val
      },
      deep: true
    },
    input: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>
