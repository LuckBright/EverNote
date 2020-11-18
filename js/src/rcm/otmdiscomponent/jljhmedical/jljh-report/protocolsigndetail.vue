<template>
  <div>
    <ever-form2 ref="form" :schema="schema" :rules="rules" v-model="queryObj">
      <template slot="btns">
        <el-button type="primary" size="small" @click="legalPersonQuery">法人注册查询</el-button>
        <el-button type="primary" size="small" @click="hospitalProtocolInfo">签署情况查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <ever-form2
      labelWidth="150px"
      :schema="schemaResult"
      v-model="queryObjResult"
      :nosubmit="true"
      :span="8"
    ></ever-form2>
  </div>
</template>

<script>
import { legalPersonQuery, hospitalProtocolInfo } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
const schema = [
  {
    label: '年度',
    labelWidth: '60px',
    name: 'year',
    comp: 'el-date-picker',
    props: {
      type: 'year',
      width: '100%'
    },
    span: 6
  },
  {
    label: '',
    labelWidth: '15px',
    name: 'btns',
    comp: 'custom',
    span: 18
  },
]
const rules = {
  year: [{
    required: true,
    message: '请选择年度',
    trigger: 'change'
  }]
}
const schemaPerson = [
  {
    label: '医疗机构编码',
    name: 'orgNo',
    comp: 'readonlyitem'
  },
  {
    label: '医疗机构名称',
    name: 'orgName',
    comp: 'readonlyitem'
  },
  {
    label: '地址',
    name: 'address',
    comp: 'readonlyitem'
  },
  {
    label: '医疗机构执业许可证号',
    name: 'medicalInstitutionLicenseNo',
    comp: 'readonlyitem'
  },
  {
    label: '药品经营许可证编号',
    name: 'drugBusinessLicenseNo',
    comp: 'readonlyitem'
  },
  {
    label: '医疗服务机构法定代表人身份证号',
    name: 'medicalInstitutionLegalPersonIdNo',
    comp: 'readonlyitem'
  },
  {
    label: '医疗服务机构法定代表人姓名',
    name: 'medicalInstitutionLegalPersonName',
    comp: 'readonlyitem'
  },
  {
    label: '法人联系电话',
    name: 'phone',
    comp: 'readonlyitem'
  },
  {
    label: '最后注册时间',
    name: 'registerTime',
    comp: 'readonlyitem'
  },
  {
    label: '本年注册次数',
    name: 'registerNums',
    comp: 'readonlyitem'
  },
  {
    label: '登录密码',
    name: 'passWord',
    comp: 'readonlyitem'
  },
  {
    label: '注册操作员',
    name: 'operator',
    comp: 'readonlyitem'
  },
  {
    label: '对应的人员代码',
    name: 'operatorNo',
    comp: 'readonlyitem'
  },
  {
    label: '普通医院标志',
    name: 'hosFlag',
    comp: 'readonlyitem'
  },
  {
    label: '普通协议起止日期',
    name: 'protocolWorkDate',
    comp: 'readonlyitem'
  },
  {
    label: '特殊医院标志',
    name: 'specialHosFlag',
    comp: 'readonlyitem'
  },
  {
    label: '特殊协议起止日期',
    name: 'specialProtocolWorkDate',
    comp: 'readonlyitem'
  }
]
const schemaSign = [
  {
    label: '定点机构编码',
    name: 'orgNo',
    comp: 'readonlyitem'
  },
  {
    label: '定点机构名称',
    name: 'orgName',
    comp: 'readonlyitem'
  },
  {
    label: '医保标志',
    name: 'hosFlag',
    comp: 'readonlyitem'
  },
  {
    label: '协议起止日期',
    name: 'protocolStartDate',
    comp: 'readonlyitem'
  },
  {
    label: '特殊医院标志',
    name: 'specialHosFlag',
    comp: 'readonlyitem'
  },
  {
    label: '特殊协议起止日期',
    name: 'protocolEndDate',
    comp: 'readonlyitem'
  },
  {
    label: '定点机构法人姓名',
    name: 'legalPersonName',
    comp: 'readonlyitem'
  },
  {
    label: '医保经办机构名称',
    name: 'manageOrgName',
    comp: 'readonlyitem'
  },
  {
    label: '医保经办机构负责人',
    name: 'manageOrgChargeMan',
    comp: 'readonlyitem'
  },
]
export default {
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    const schemaResult = schemaPerson
    const queryObjResult = this.$ever.createObjFromSchema(schemaResult)
    return {
      schema,
      rules,
      queryObj,
      schemaResult,
      queryObjResult,
      hljybCode
    }
  },
  methods: {
    legalPersonQuery () {
      this.rules = rules
      this.schemaResult = schemaPerson
      this.queryObjResult = this.$ever.createObjFromSchema(this.schemaResult)
      this.$nextTick(_ => {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            legalPersonQuery({
              year: this.$moment(this.queryObj.year).format('YYYY'),
              macId: this.macId,
              insuranceOrgId: this.hljybCode,
            }).then(res => {
              this.queryObjResult = res.data
            }).catch((err) => {
              console.log('err', err)
            })
          }
        })
      })
    },
    hospitalProtocolInfo () {
      this.schemaResult = schemaSign
      this.$refs.form.$refs.form.clearValidate()
      this.rules = {}
      this.queryObjResult = this.$ever.createObjFromSchema(this.schemaResult)
      let params = {
        macId: this.macId,
        insuranceOrgId: this.hljybCode
      }
      hospitalProtocolInfo(params).then(res => {
        this.queryObjResult = res.data
      }).catch((err) => {
        console.log('err', err)
      })
    }
  },
}
</script>
