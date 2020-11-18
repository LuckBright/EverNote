<template>
  <el-dialog
    title="兑换积分"
    :visible.sync="dialogVisible"
    width="30%"
    class="log-change"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <ever-form2
      :schema="schema"
      v-model="obj"
      :api="api"
      labelWidth="80px"
      :rules="rules"
      ref="form"
      @objsaved="afterSave"
      label-position="right">
      <template slot="points">
        <span>{{obj.points}}</span>
      </template>
      <template slot="remark">
        <el-input type="textarea" v-model="obj.remark"></el-input>
      </template>
      <template slot="pointsChange">
        <el-input type="number" v-model="obj.pointsChange" :disabled="isDisabled"></el-input>
      </template>
      <template slot="exchangeId">
        <el-select v-model="obj.exchangeId" placeholder="请选择" clearable>
          <el-option
            v-for="item in optionss"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="default">
        <div style="text-align:right;margin-top:20px;">
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
    name: 'points',
    label: '可用积分',
    span: 24,
    comp: 'custom',
    props: {
      placeholder: ''
    }
  },
  {
    name: 'type',
    label: '积分兑换方式',
    comp: 'sys-type',
    props: {
      code: 'THC_MARKET_JFDHFS'
    },
    span: 24
  },
  {
    name: 'exchangeId',
    label: '兑换产品',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'pointsChange',
    label: '兑换积分',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'remark',
    label: '备注',
    span: 24,
    comp: 'custom',
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
      options: [],
      optionss: [],
      isDisabled: false,
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
      if (!reg.test(value)) {
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
          if (Number(this.obj.pointsChange) < 0) {
            this.$messageTips(this, 'warning', '兑换积分不能小于0')
            return false
          }
          if (Number(this.obj.pointsChange) > Number(this.obj.points)) {
            this.$messageTips(this, 'warning', '兑换积分不能大于可用积分')
            return false
          }
          let params = {
            patientId: this.obj.patientId,
            remark: this.obj.remark
          }
          if (this.obj.type) {
            if (!this.obj.exchangeId) return this.$messageTips(this, 'warning', '兑换产品不能为空')
            params['exchangeId'] = this.obj.exchangeId
          } else {
            params['pointsChange'] = this.obj.pointsChange
          }
          api.exchangePoint(params).then(result => {
            if (result.head.errCode === 0) {
              this.$messageTips(this, 'success', '兑换积分成功')
              this.afterSave()
            } else {
              this.$messageTips(this, 'error', '兑换积分失败')
            }
          })
        }
      })
    }
  },
  created () {},
  beforeCreate () {
    this.api = api
  },
  watch: {
    'rowData': {
      handler (val) {
        this.obj.patientId = this.rowData.patientId
        this.obj.points = this.rowData.points
      },
      immediate: true
    },
    'obj.type': {
      async handler (val) {
        if (val) {
          let resData = await api.getTypeListAll({typeCode: val}).then()
          if (resData.data && resData.data.length) {
            if (val === 'benefit') {
              resData.data.forEach(item => {
                item.name = item.benefitName
              })
            }
            this.optionss = resData.data
            this.obj.exchangeId = this.optionss[0].id
          } else {
            this.optionss = []
            this.obj.exchangeId = ''
            this.obj.pointsChange = ''
          }
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
        this.obj.exchangeId = ''
        this.obj.pointsChange = ''
      },
      immediate: true
    },
    'obj.exchangeId': {
      handler (val) {
        if (val) {
          let key = this.optionss.find(item => item.id === val)
          this.obj.pointsChange = key.exchangePoints
        } else {
          this.obj.pointsChange = ''
        }
      },
      immediate: true
    },
    'dialogVisible': {
      handler (val) {
        if (!val) {
          this.obj.type = ''
          this.obj.pointsChange = ''
          this.obj.exchangeId = ''
          this.obj.remark = ''
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
  .log-change /deep/ .el-select{
    width: 100%;
  }
</style>

