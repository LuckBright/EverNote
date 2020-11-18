<template>
  <div>
    <ever-bread-crumb name="预付款信息"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form-model
        :schema="schema"
        v-model="obj"
        ref="form"
        :api="api"
        :rules="rules"
        label-position="right"
      ></ever-form-model>
      <div class="main-foot alg_label">
        <el-button
          type="primary"
          @click.native.prevent="createOrUpdate"
          v-if="!objId || (objId && obj.status === '0')"
        >保存</el-button>
        <el-button
          type="info"
          @click.native.prevent="verify(1)"
          v-if="objId && obj.status === '0'"
        >提交审批</el-button>
        <el-button
          type="success"
          @click.native.prevent="verify(1)"
          v-if="objId && obj.status==='2'"
        >审批通过</el-button>
        <el-button
          type="warning"
          @click.native.prevent="verify(2)"
          v-if="objId && obj.status==='2'"
        >驳回</el-button>
        <el-button
          type="danger"
          @click.native.prevent="deletepre"
          v-if="objId && obj.status==='0'"
        >删除</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/prepaymentapi'
// import clinicApi from '@/warehouse/store/clinicapi'
import supplierApi from '../store/payableinvoiceapi'

var schema = [
  // {
  //   name: 'clinicid',
  //   label: '机构名称',
  //   type: 'select',
  //   options: []
  // },
  {
    name: 'supplierID',
    label: '供应商名称',
    type: 'select',
    options: []
  },
  {
    name: 'supplierType',
    label: '供应商类型',
    type: 'systype',
    code: 'THC_WH_VENDOR_TYPE'
  },
  {
    name: 'docDate',
    label: '申请日期',
    type: 'date',
    outformat: 'yyyy-MM-dd'
  },
  {
    name: 'paySum',
    label: '预付款金额'
  },
  {
    name: 'payMethod',
    label: '付款方法',
    type: 'systype',
    code: 'THC_RCM_PAYMENT_TYPE',
    useValue: true
  },
  {
    name: 'illustration',
    label: '预付款说明'
  },
  {
    name: 'description',
    label: '付款说明',
    placeholder: '请输入合同名称或维修单名称'
  },
  {
    name: 'code',
    label: '预付款编号'
  },
  {
    name: 'period',
    label: '财务期间',
    type: 'select',
    options: []
  },
  {
    name: 'agentID',
    label: '经办人',
    type: 'select',
    options: []
  },
  {
    name: 'verifyStatus',
    label: '核销状态',
    type: 'select',
    options: [{ id: 1, name: '未核销' }, { id: 2, name: '部分核销' }],
    disabled: true
  },
  {
    name: 'status',
    label: '预付款状态',
    type: 'systype',
    code: 'THC_RCM_CLAIM_DOC_STATUS',
    useValue: true,
    disabled: true
  }
]

export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback('必填项')
      } else if (!isNaN(Number(value))) {
        callback()
      } else {
        callback('只允许输入数字')
      }
    }
    var obj = this.$ever.createObjFromSchema(schema)
    obj.verifyStatus = 1
    obj.status = '0'
    if (this.$route.params.id >= 0) {
      schema.filter(function (v, i) {
        return v.name === 'supplierType'
      })[0].disabled = true
    } else {
      schema.filter(function (v, i) {
        return v.name === 'supplierType'
      })[0].disabled = false
    }
    return {
      schema,
      obj: obj,
      api: api,
      objId: this.$route.params.id,
      rules: {
        // clinicID: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        supplierID: [{ required: true, message: '必填项', trigger: 'blur' }],
        supplierType: [{ required: true, message: '必填项', trigger: 'blur' }],
        docDate: [{ required: true, message: '必填项', trigger: 'blur' }],
        paySum: [
          { required: true, trigger: 'blur', message: '必填项' },
          { validator: validatePass, trigger: 'blur' }
        ],
        illustration: [{ required: true, message: '必填项', trigger: 'blur' }],
        period: [{ required: true, message: '必填项', trigger: 'blur' }],
        agentID: [{ required: true, message: '必填项', trigger: 'blur' }],
        payMethod: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  methods: {
    createOrUpdate () {
      let that = this
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          api.createOrUpdate(that.obj).then(result => {
            if (result.head.errCode === 0) {
              if (!that.objId) {
                that.obj.code = result.data.split(',')[0]
                that.objId = result.data.split(',')[1]
              }
              this.$router.go(-1)
            } else if (result.head.errCode === 0 && that.objId) {
              if (that.obj.status !== '0') {
                this.$router.go(-1)
              }
            }
          })
        } else {
          return false
        }
      })
    },
    deletepre () {
      api.del(this.obj.id).then(result => {
        if (result.head.errCode === 0) {
          this.$router.go(-1)
        }
      })
    },
    verify (isAgree) {
      api.verify(this.objId, isAgree).then(result => {
        if (result.head.errCode === 0) {
          this.$router.go(-1)
        }
      })
    }
  },
  created () {
    if (this.objId !== '-1') {
      api.getById(this.objId).then(result => {
        Object.assign(this.obj, result)
      })
    }
    api.getPeriod().then(result => {
      result.forEach(function (item) {
        item.name = item.periodName
      })
      this.$ever.getFieldFromSchema(this.schema, 'period').options = result
    })
    supplierApi.getSupplierLocalByClinic().then(result => {
      this.$ever.getFieldFromSchema(this.schema, 'supplierID').options =
        result.clinicArr
    })
    api.getStaffList().then(res => {
      let staffList = res.data && res.data.pageList
      this.$ever.getFieldFromSchema(this.schema, 'agentID').options = staffList
    })
  }
}
</script>
