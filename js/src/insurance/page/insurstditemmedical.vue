<template>
  <div>
    <ever-bread-crumb></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        :schema="schema"
        v-model="obj"
        :api="api"
        :rules="rules"
        class="page"
        @objsaved="afterSave" label-position="right">
        <template slot="isHospitalize">
          <el-radio v-model="obj.isHospitalize" :label="1">是</el-radio>
          <el-radio v-model="obj.isHospitalize" :label="0">否</el-radio>
        </template>
        <template slot="isClinic">
          <el-radio v-model="obj.isClinic" :label="1">是</el-radio>
          <el-radio v-model="obj.isClinic" :label="0">否</el-radio>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
  import api from '../store/insurstditemmedicalapi'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  var schema = [
    {
      name: 'insuranceOrgID',
      label: '保险公司ID',
      span: 12,
      props: {
        disabled: true
      }
    },
    {
      name: 'stdSrvItemCode',
      label: '服务项目编码',
      span: 12
    },
    {
      name: 'stdSrvItemName',
      label: '服务项目名称',
      span: 12
    },
    {
      name: 'medicalCode',
      label: '药品通用编码',
      span: 12
    },
    {
      name: 'medicalName',
      label: '药品通用名称',
      span: 12
    },
    {
      name: 'payRatio',
      label: '保险支付比例',
      span: 12
    },
    {
      name: 'medicalType',
      label: '药品类别',
      span: 12,
      comp: 'select',
      props: {
        options: []
      }
    },
    {
      name: 'drugForm',
      label: '药品剂型',
      comp: 'sys-type',
      props: {
        placeholder: '药品剂型',
        code: 'THC_WH_DRUG_FORM'
      },
      span: 12
    },
    {
      name: 'stdFeeClass',
      label: '收费类别',
      comp: 'sys-type',
      props: {
        placeholder: '收费类别',
        code: 'THC_RCM_CLASS_MED_CLASS'
      },
      span: 12
    },
    {
      name: 'chargeLevel',
      label: '收费等级',
      comp: 'select',
      props: {
        options: [
          {id: '1', name: '无自付'},
          {id: '2', name: '部分自付'},
          {id: '3', name: '全自付'}
        ]
      },
      span: 12
    },
    {
      name: 'isClinic',
      label: '门诊使用标识',
      comp: 'custom',
      span: 12
    },
    {
      name: 'isHospitalize',
      label: '住院使用标识',
      comp: 'custom',
      span: 12
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
      let validatePasss = (rule, value, callback) => {
        if (!value) {
          callback()
        } else {
          let reg = /^(((\\d{1,2})[.]((\\d{1,2})?))|100|(?:0|[1-9][0-9]?)|100.00|100.0)$/
          if (!reg.test(value)) {
            callback(new Error('请输入0-100的数字'))
          } else {
            callback()
          }
        }
      }
      if (this.$route.params.id) {
        schema.filter(function (v, i) {
          return v.name === 'stdSrvItemCode'
        })[0].disabled = true
      } else {
        schema.filter(function (v, i) {
          return v.name === 'stdSrvItemCode'
        })[0].disabled = false
      }

      if (this.$route.params.medicalId) {
        schema.filter(function (v, i) {
          return v.name === 'insuranceOrgID'
        })[0].disabled = true
        obj.insuranceOrgID = this.$route.params.medicalId
      } else {
        schema.filter(function (v, i) {
          return v.name === 'insuranceOrgID'
        })[0].disabled = false
      }
      return {
        schema,
        obj: obj,
        api: api,
        options: [],
        rules: {
          payRatio: [{ validator: validatePasss, trigger: 'blur' }]
        }
      }
    },
    methods: {
      afterSave (params) {
        if (params.head.errCode === 0) {
          history.go(-1)
        }
      }
    },
    created () {
      sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE')
        .then(options => {
          let typeArr = []
          options.forEach(function (item, index) {
            if (item.parentId === '296') {
              typeArr.push(item)
            }
          })
          this.$ever.getFieldFromSchema(this.schema, 'medicalType').props.options = typeArr
        })
    }
  }
</script>
<style scoped>
  .page /deep/ .el-select {
    width: 100%;
  }
</style>

