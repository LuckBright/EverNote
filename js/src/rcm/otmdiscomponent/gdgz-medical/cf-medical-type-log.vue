<template>
  <el-dialog
    :visible.sync="v"
    title="请选择医保类型"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="30%"
    append-to-body
  >
    <el-row>
      <ever-form2 ref="form" :schema="schema" v-model="queryObj" :rules="rules" labelWidth="130px">
        <div></div>
      </ever-form2>
    </el-row>
    <el-row class="el-dialog__footer">
      <div class="buttons" style="text-align: center;">
        <el-button type="primary" size="small" @click="sure">确定</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </el-row>
  </el-dialog>
</template>

<script>
import { register } from '@/rcm/store/otmdiscomponent/gd.localhost.api.js'
import { medicalRegister } from '@/rcm/store/hospital/hospital.js'
let schema = [
  {
    label: '',
    name: 'insuranceType',
    comp: 'radio',
    props: {
      options: [
        {name: 1, id: '本地'},
        {name: 2, id: '异地'}
      ]
    },
    span: 24
  }]
let rules = {
  insuranceType: [{
    required: true,
    message: '医保类别不能为空',
    trigger: 'change'
  }]
}
export default {
  props: {
    medicalTypeVis: {
      type: [Boolean]
    },
    row: {
      type: [Object],
      default () {
        return {}
      }
    }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      rules,
      register,
      medicalRegister
    }
  },
  computed: {
    v: {
      get () {
        return this.medicalTypeVis
      },
      set (val) {
        this.$emit('update:medicalTypeVis', val)
      }
    }
  },
  watch: {
    'medicalTypeVis': {
      handler (val) {
        if (val) {
          this.queryObj.insuranceType = this.row.insuranceType || 1
        }
      }
    }
  },
  methods: {
    // 取消
    cancel () {
      this.v = false
    },
    async sure () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.sureData()
        }
      })
    },
    async sureData () {
      let params = { jydjh: this.row.extendInfo.jYDJH, insuranceType: this.queryObj.insuranceType }
      let params2 = Object.assign({}, this.row, this.queryObj)
      let registerJson = await register(params)
      let medicalRegisterJson = await medicalRegister(params2)
      if (!registerJson.head.errCode && !medicalRegisterJson.head.errCode) {
        this.$messageTips(this, 'success', '登记成功')
        this.$emit('success')
        this.$emit('update:medicalTypeVis', false)
      } else {
        this.$messageTips(this, 'error', '登记失败')
      }
    }
  }
}
</script>
