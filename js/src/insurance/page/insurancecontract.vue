<template>
  <div>
    <ever-bread-crumb name="保险公司协议管理"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form labelWidth="160px" :schema="schema" v-model="obj" :api="api" :rules="rules" @objsaved="afterSave" label-position="right">
      </ever-form>
    </div>
  </div>
</template>
<script>
import api from '../store/insurancecontractapi'

var schema = [
  {
    name: 'contractName',
    label: '合同名称'
  },
  {
    name: 'contractCode',
    label: '合同编码'
  },
  {
    name: 'beginDate',
    type: 'date',
    label: '有效期自'
  },
  {
    name: 'endDate',
    type: 'date',
    label: '有效期至'
  },
  {
    name: 'isDirect',
    label: '是否直付',
    type: 'radio',
    options: [
      {
        id: false,
        name: '否'
      },
      {
        id: true,
        name: '是'
      }
    ]
  },
  {
    name: 'rate',
    label: '全单优惠比例',
    append: '%'
  },
  {
    name: 'paymentCycle',
    label: '保险公司付款周期',
    type: 'radio',
    options: [
      {
        id: 1,
        name: '季度'
      },
      {
        id: 0,
        name: '月'
      }
    ]
  },
  {
    name: 'singleFee',
    label: '单次金额',
    placeholder: '请填写单次金额，不填默认为0'
  },
  {
    name: 'treatTime',
    label: '诊疗次数'
  },
  {
    name: 'salePolicy',
    label: '促销政策',
    type: 'systype',
    useValue: true,
    code: 'THC_RCM_INSURANCE_SALEPOLICY'
  },
  {
    name: 'setRate',
    label: '保险结算折扣比例',
    append: '%'
  }
]

export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    var init = {
      insuranceOrgID: this.$route.params.inid
    }
    obj = Object.assign(obj, init)
    var reg = /^([1-9]\d{0,1}|100)$/

    var validateSetRate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('必填项'))
      } else if (!reg.test(value)) {
        callback(new Error('只能填写1-100的整数!'))
      } else {
        callback()
      }
    }
    return {
      schema,
      obj: obj,
      api: api,
      insuranceOrgID: this.$route.params.id,
      rules: {
        contractName: [{ required: true, message: '必填项', trigger: 'blur' }],
        isDirect: [
          {
            type: 'boolean',
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        salePolicy: [{ required: true, message: '必填项', trigger: 'blur' }],
        beginDate: [{ required: true, message: '必填项', trigger: 'blur' }],
        endDate: [{ required: true, message: '必填项', trigger: 'blur' }],
        setRate: [{ required: true, validator: validateSetRate, trigger: 'blur' }],
        rate: [{ required: true, validator: validateSetRate, trigger: 'blur' }],
        contractCode: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  methods: {
    afterSave () {
      history.go(-1)
    }
  }
}
</script>
