<template>
  <el-dialog
    :title="title"
    :visible.sync="visibleFlag"
    class="ui_dialog_02"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
  >
    <div style="min-height:550px;" v-loading="loading">
      <div class="time">
        <slot name="time"></slot>
      </div>
      <!-- key的切换不要去掉tplCode，门诊医生部分需要根据tplCode来切换， -->
      <phrform
        :auto-save="autoSave"
        :loading.sync="loading"
        :key="dataId + key + recordTime"
        :code="tplCode"
        :visit-id="(baseInfo && baseInfo.visitNumber) || ($route.query.visitSn || $route.query.visitNumber || $route.query.hospitalizedNumber)"
        :patient-id="(baseInfo && baseInfo.patientId) || $route.query.patientId"
        :dpt-id="(baseInfo && baseInfo.providerId) || ($route.query.dptId || $route.query.providerId)"
        v-model="input"
        ref="form"
        :schemaId.sync="schemaId"
        :data-id="dataId"
        :recordTime="recordTime"
        :dataEcho="dataEcho"
        @success="phrFormSuccess"
        @fail="phrFormFail"
        @focus="(name, obj) => {this.$emit('focus', name, obj)}"
        @click="(name, obj) => {this.$emit('click', name, obj)}"
        :allDisabled="readonly"
        :nosubmit="nosubmit"
      >
      </phrform>
    <slot></slot>
    </div>
    <div slot="footer">
      <slot name="dialogFooter"></slot>
    </div>

  </el-dialog>
</template>

<script>
export default {
  /**
   * tplCode: 表单引擎模版CODE
   * dataId: 回显是表单数据id
   * baseInfo: 表单引擎需要的就诊基础信息
   */
  props: ['autoSave', 'value', 'tplCode', 'dataId', 'baseInfo', 'title', 'readonly', 'nosubmit', 'recordTime', 'dataEcho'],
  data () {
    return {
      schemaId: '',
      visibleFlag: false,
      form: {},
      input: this.value,
      key: '',
      loading: false
    }
  },
  methods: {
    open () {
      this.visibleFlag = true
      this.key = this.tplCode + new Date()
    },
    close () {
      this.visibleFlag = false
    },
    phrFormSuccess (val) {
      this.$emit('success', val)
      if (val && val.id && val.id !== '-1') {
        this.close()
      }
    },
    phrFormFail () {
      setTimeout(_ => { this.close() }, 600)
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
