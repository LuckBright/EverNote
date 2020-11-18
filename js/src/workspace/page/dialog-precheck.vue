<template>
  <!-- :title="task.name" -->
  <el-dialog
    :visible.sync="visible"
    class="dialogCommonWar ui_dialog_02"
    :before-close="close"
    :close-on-click-modal="false"
    append-to-body
  >
    <common-head
      :patientId="precheckData.patientId"
      :visitNumber="precheckData.visitNumber"
      :code="'017'"
      v-if='showHead'
      :key="key+''"
    ></common-head>
    <phrform
      :code="tplCode"
      :visit-id="precheckData.visitNumber"
      :patient-id="precheckData.patientId"
      :dpt-id="precheckData.providerid"
      v-model="form"
      ref="form"
      :nosubmit="true"
      :schemaId.sync="schemaId"
      :key="precheckData.patientId + precheckData.visitNumber + key"
      @success="saveSuccessHandler"
    ></phrform>
    <div slot="footer" class="dialog-footer" v-if="!nosubmit">
      <el-button type="primary" @click="save" v-ever-click-once="disabled" :disabled="disabled">
        <i class="icon iconfont icon-tijiao"></i>提交
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import commonHead from '@/inpatient/components/common.head.js'
import phrform from '@/form/components/phrform'
import { YU_JIAN_BING_LI } from '@/workspace/common/config'
export default {
  props: {
    task: {
      type: Object,
      default: () => { }
    },
    precheckData: {
      type: Object,
      default: () => { }
    },
    nosubmit: {
      type: Boolean,
      default: true
    },
    showHead: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tplCode: YU_JIAN_BING_LI,
      form: null,
      schemaId: '',
      disabled: false,
      visible: false,
      key: ''
    }
  },
  methods: {
    open () {
      this.visible = true
      this.key = new Date()
    },
    close () {
      this.visible = false
      this.$emit('close')
    },
    save () {
      this.$refs.form.save()
    },
    saveSuccessHandler () {
      this.close()
      this.$emit('update')
    }
  },
  created () {
  },
  components: {
    commonHead,
    phrform
  }
}
</script>
<style type="text/css" scoped>
.fixMargin .el-input {
  margin-left: 0 !important;
  width: 100%;
}
h5 {
  height: 20px;
  line-height: 20px;
  border-left: 2px solid #1c7bef;
  padding-left: 10px;
  font-size: 16px;
  margin: 15px 0;
}
.examination .el-input {
  width: 50px;
  margin-left: 0;
}
.examination .el-input input {
  text-align: center;
}
.examination /deep/ .el-input__inner {
  padding: 3px 5px;
}
.examination .el-input.red input {
  color: #ee4433;
}
.examination .el-input.normal input {
  color: #000;
}
.examination .el-form > .el-form-item {
  margin-bottom: 15px !important;
}
.eye_title {
  font-weight: 700;
  margin-right: 20px;
}
.iconfont {
  color: #fff;
}
</style>

