<template>
  <div>
    <ever-bread-crumb name="诊疗项目维护"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form
        :schema="schema"
        v-model="obj"
        :span="14"
        :api="api"
        :rules="rules"
        @objsaved="afterSave"
        label-position="right"
      ></ever-form>
    </div>
  </div>
</template>
<script>
import api from '../store/insurstditemtreatapi'
var schema = [
  {
    name: 'insuranceOrgID',
    label: '保险公司ID'
  },
  {
    name: 'stdSrvItemCode',
    label: '服务项目编码'
  },
  {
    name: 'stdSrvItemName',
    label: '服务项目名称'
  },
  {
    name: 'itemCode',
    label: '医嘱项目编码'
  },
  {
    name: 'itemName',
    label: '医嘱项目名称'
  },
  {
    name: 'clinicBillCode',
    label: '门诊账单码'
  },
  {
    name: 'clinicFeeClass',
    label: '门诊收费类别',
    type: 'systype',
    code: 'CV07.10.001'
  },
  {
    name: 'clinicBillName',
    label: '门诊账单名称'
  },
  {
    name: 'hospitalBillCode',
    label: '住院账单码'
  },
  {
    name: 'hospitalFeeClass',
    label: '住院收费类别',
    type: 'systype',
    code: 'CV07.10.002'
  },
  {
    name: 'hospitalBillName',
    label: '住院账单名称'
  },
  {
    name: 'price',
    label: '收费价格'
  },
  {
    name: 'unit',
    label: '收费单位'
  },
  {
    name: 'chargeLevel',
    label: '收费等级',
    type: 'select',
    options: api.levelArr
  },
  {
    name: 'effectiveDate',
    label: '生效日期',
    type: 'date'
  },
  {
    name: 'deleteFlag',
    label: '删除标志',
    type: 'radio',
    options: [{
      id: 1,
      name: '已删除'
    }, {
      id: 0,
      name: '在用'
    }
    ]
  },
  {
    name: 'annotation',
    label: '注释'
  },
  {
    name: 'remark',
    label: '备注'
  },
  {
    name: 'feeAccording',
    label: '收费依据'
  },
  {
    name: 'chinaMedicalClass',
    label: '中医分类',
    type: 'systype',
    code: 'THC_RCM_CLASS_CHN_CLASS'
  }
  // {
  //   name: '',
  //   type: 'date',
  //   label: '失效日期'
  // },
  // {
  //   name: 'description',
  //   label: '备注',
  //   span: 24,
  //   type: 'textarea'
  // }
]

export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    if (this.$route.params.id) {
      schema.filter(function (v, i) {
        return v.name === 'stdSrvItemCode'
      })[0].disabled = true
    } else {
      schema.filter(function (v, i) {
        return v.name === 'stdSrvItemCode'
      })[0].disabled = false
    }

    if (this.$route.params.treatId) {
      schema.filter(function (v, i) {
        return v.name === 'insuranceOrgID'
      })[0].disabled = true
      obj.insuranceOrgID = this.$route.params.treatId
    } else {
      schema.filter(function (v, i) {
        return v.name === 'insuranceOrgID'
      })[0].disabled = false
    }
    return {
      schema,
      obj: obj,
      api: api,
      rules: {
        // insuranceOrgID: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // isHospitalize: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    afterSave () {
      this.$router.push('/manages/insurstditemtreats/' + this.$route.params.treatId)
    }
  },
  created () {
    console.log(api)
    // storageroom.list().then(results => {
    //   this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').options = results
    // })
  }
}
</script>
