<template>
  <el-dialog
    title="纠纷退费"
    :visible.sync="visible"
    class="refund"
    :close-on-click-modal="false"
    :modal-append-to-body="true"
    :append-to-body="true"
  >
    <div class="showText">
      <span class="textItem">
        姓名：
        <span>{{refundObj.patientName}}</span>
      </span>
      <span class="textItem">
        门诊档案号：
        <span>{{refundObj.outpatientNumber}}</span>
      </span>
      <span class="textItem">
        退款方式：
        <span>现金</span>
      </span>
    </div>
    <div class="showInput">
      <ever-form2
        :schema="schema"
        :rules="rules"
        v-model="obj"
        :nosubmit="true"
        ref="form"
        :span="24"
        :info="true"
        labelWidth="160px"
        label-position="right"
      >
        <template slot="forbid">
          <el-checkbox v-model="obj.forbid"></el-checkbox>
        </template>
      </ever-form2>
    </div>
    <div class="footer">
      <el-button type="primary" @click="sureRefund">确认</el-button>
      <el-button @click="visible=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
let schema = [
  {
    label: '退款金额',
    name: 'refundFee',
    props: {
      type: 'number'
    }
  },
  {
    label: '退款原因',
    name: 'refundReason'
  }
]
let rules = {
  refundFee: [{
    required: true,
    message: '请填写退款金额',
    trigger: 'change'
  }],
  refundReason: [{
    required: true,
    message: '请填写退费原因',
    trigger: 'change'
  }],

}
export default {
  props: {
    refundObj: {
      type: Object,
      required: true,
      default: _ => {
        return {}
      }
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      obj,
      schema,
      rules,
      visible: false
    }
  },
  methods: {
    sureRefund () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (this.obj.refundFee === '') {
            this.$messageTips(this, 'error', '请填写正确的退款金额')
            return false
          } else if (Number(this.obj.refundFee) <= 0) {
            this.$messageTips(this, 'error', '退费金额必须大于0')
            return false
          }
          this.$emit('refundCall', this.obj)
        }
      })
    }
  },
  watch: {
    'visible': {
      handler (val) {
        if (!val) {
          this.$refs.form.$refs.form.resetFields()
        }
      }
    }
  }
}
</script>
<style scoped>
.showText {
  margin-bottom: 15px;
}
.showText .textItem {
  margin-right: 24px;
}
.showInput {
  margin-left: 0px;
}
.footer {
  text-align: left;
  padding-left: 160px;
}
.el-form-item {
  margin-right: 15px;
}
.el-form-item__label {
  text-align: left;
  width: 83px;
}
.el-form-item__content {
  margin-left: 83px;
}
.el-form-item__content /deep/ .el-input__inner {
  height: 33px;
  line-height: 33px;
}
</style>
