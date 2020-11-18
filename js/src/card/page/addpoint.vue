<template>
  <el-dialog
    title="增加积分"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <ever-form2
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      ref="form"
      @objsaved="afterSave"
      label-position="right">
      <template slot="remark">
        <el-input type="textarea" v-model="obj.remark"></el-input>
      </template>
      <template slot="default">
        <div style="text-align:right;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
      </template>
    </ever-form2>
  </el-dialog>
</template>
<script>
import api from '../store/creditapi'

let schema = [
  {
    name: 'pointsChange',
    label: '增加积分',
    span: 24,
    props: {
      placeholder: ''
    }
  },
  {
    name: 'remark',
    label: '备注',
    comp: 'custom',
    span: 24,
    props: {
      placeholder: ''
    }
  }
]
export default {
  props: ['rowData'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      dialogVisible: false,
      rules: {
        pointsChange: [
          { validator: this.checkValidPoint, trigger: 'blur', required: true }
        ],
        remark: [
          { max: 50, message: '长度在50个字符内', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    checkValidPoint (rule, value, callback) {
      var reg = /^([1-9]\d*|0)(\.\d{1,2})?$/
      if (!value.match(reg)) {
        callback(new Error('请输入整数或小数点后不超过两位的小数'))
      } else {
        callback()
      }
    },
    onDialogOpen (rs) {
      this.dialogVisible = true
      // this.obj.patientId = this.rowData.patientId
    },
    handleClose () {
      this.dialogVisible = false
    },
    afterSave () {
      this.$emit('query')
      this.dialogVisible = false
    },
    submitForm () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (Number(this.obj.pointsChange) < 0 || Number(this.obj.pointsChange) > 10000000) {
            this.$messageTips(this, 'warning', '兑换积分请输入0～10000000的数值')
            return false
          }
          api.addPoint(this.obj).then(result => {
            if (result.head.errCode === 0) {
              this.$messageTips(this, 'success', '增加积分成功')
              this.afterSave()
            } else {
              this.$messageTips(this, 'error', '增加积分失败')
            }
          })
        }
      })
    }
  },
  beforeCreate () {
    this.api = api
  },
  watch: {
    'rowData': function () {
      this.obj.patientId = this.rowData.patientId
    },
    'dialogVisible': function (val) {
      if (!val) {
        this.obj.remark = ''
        this.obj.pointsChange = ''
      }
    }
  }
}
</script>
