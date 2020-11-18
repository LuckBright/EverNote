<template>
  <div style="height:600px;overflow-y:scroll;">
    <ever-form2 ref="form" :inline="true" :schema="schema" :rules="rules" v-model="queryObj">
      <template slot="patientId">
        <ever-patient-select v-model="queryObj.patientId" @select="handleSelect"></ever-patient-select>
      </template>
      <template slot="btns">
        <el-button type="primary" size="small" @click="sdllybReadCard">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <hr />
    <ever-form2 :span="8" labelWidth="170px" :schema="schemaInfo" v-model="queryObjInfo">
      <div></div>
    </ever-form2>
    <template v-if="tableData.length>0">
      <hr />
      <h3>多社保局信息</h3>
      <el-table :data="tableData" border stripe>
        <el-table-column label="单位名称" prop="dwmc"></el-table-column>
        <el-table-column label="参保状态" prop="cbzt"></el-table-column>
        <el-table-column label="险种标志" prop="xzbz"></el-table-column>
        <el-table-column label="社保机构编号" prop="sbjgbh"></el-table-column>
        <el-table-column label="参保人员类别" prop="cbrylb"></el-table-column>
        <el-table-column label="社保机构名称" prop="sbjgmc"></el-table-column>
      </el-table>
    </template>
    <hr />
    <div>
      <ever-form2
        ref="formDB"
        :span="8"
        :schema="schemaDB"
        :rules="schemaDBRules"
        v-model="queryObjDB"
      >
        <template slot="jbbm">
          <ever-select
            v-model="queryObjDB.jbbm"
            :options="mzdbjbsOptions"
            :clearable="true"
            @change="handleDbSelect"
          ></ever-select>
        </template>
        <span></span>
      </ever-form2>
    </div>
    <div class="remark">门诊大病备注：</div>
    <hr />
  </div>
</template>

<script>
import { schemaInfo } from '@/rcm/otmdiscomponent/config-js/sdll-cardinfo.js'
import { yltclb, insuranceType } from '@/rcm/otmdiscomponent/config-js/sdll-baseconfig.js'
import { queryBasicInfo } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
function obj2arr (obj) {
  return Object.keys(obj).map((key) => {
    return { id: key, name: obj[key] }
  })
}
const schema = [{
  label: '快速搜索框',
  name: 'patientId',
  comp: 'custom'
},
{
  label: '个人编号',
  name: 'grbh'
},
{
  label: '险种标志',
  name: 'xzbz',
  comp: 'ever-select',
  props: {
    options: obj2arr(insuranceType)
  }
},
{
  label: '姓名',
  name: 'xm',
},
{
  label: '医疗统筹类别',
  name: 'yltclb',
  comp: 'ever-select',
  props: {
    options: yltclb
  }
},
{
  label: '',
  labelWith: '15px',
  name: 'btns',
  comp: 'custom'
}]
const rules = {
  grbh: [{
    required: true,
    message: '请填写个人编号',
    trigger: 'change'
  }],
  xzbz: [{
    required: true,
    message: '请填写险种类型',
    trigger: 'change'
  }]
}
const schemaDB = [{
  label: '疾病编码',
  name: 'jbbm',
  comp: 'custom'
}]
const schemaDBRules = {
  jbbm: [{
    required: true,
    message: '请选择疾病编码',
    trigger: 'change'
  }]
}
export default {
  props: ['medicalObj', 'confirmDisabled'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.yltclb = '4'
    queryObj.xzbz = 'C'
    let queryObjInfo = this.$ever.createObjFromSchema(schemaInfo)
    let queryObjDB = this.$ever.createObjFromSchema(schemaDB)
    return {
      schema,
      rules,
      queryObj,
      schemaInfo,
      queryObjInfo,
      sdllCode,
      mzdbjbs: '',
      schemaDB,
      schemaDBRules,
      queryObjDB
    }
  },
  computed: {
    tableData () {
      return this.queryObjInfo.multisbjds || []
    },
    mzdbjbsOptions () {
      let mzdbjbsOptions = this.queryObjInfo.mzdbjbs
      if (mzdbjbsOptions) {
        mzdbjbsOptions = mzdbjbsOptions.split('/').filter(item => item).map(item => {
          let [name, id] = item.split('#m')
          return { id, name }
        })
        this.queryObjDB.jbbm = this.queryObjDB.jbbm || mzdbjbsOptions[0].id
        this.$emit('update:medicalObj', Object.assign({}, this.queryObj, this.queryObjInfo, this.queryObjDB))
      }
      return mzdbjbsOptions || []
    }
  },
  methods: {
    sdllybReadCard () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let params = {
            insuranceOrgId: this.sdllCode,
            sbjgbh: '000000', // 社保机构编号写死的
            macId: this.macId,
            jsonPara: this.filterParams(this.queryObj)
          }
          queryBasicInfo(params).then(res => {
            let result = res.data
            result.personname = result.xm
            result.personno = result.grbh
            result.idno = result.grbh
            Object.assign(this.queryObjInfo, result)
            // 获取到的医保卡信息外传
            this.$emit('update:medicalObj', this.queryObjInfo)
            this.$emit('update:confirmDisabled', false)
          }).catch((err) => {
            console.log('err', err)
          })
        } else {
          this.$messageTips(this, 'error', '请输入个人编码和险种标志再进行查询操作，个人编码可以通过快速搜索框带入！')
        }
      })
    },
    putIdCode () {
      const basicInfo = this.medicalObj.basicInfo
      Object.assign(this.queryObj, { grbh: basicInfo && basicInfo.idCode })
    },
    filterParams (obj) {
      let result = {}
      Object.keys(obj).forEach(key => {
        if (obj[key] !== '') {
          result[key] = obj[key]
        }
      })
      return result
    },
    handleDbSelect (val) {
      this.$emit('update:medicalObj', Object.assign({}, this.queryObj, this.queryObjInfo, this.queryObjDB))
    },
    async checkRequiredParams () {
      let result = false
      await this.$refs.formDB.$refs.form.validate(valid => {
        result = valid
      })
      return result
    },
    handleSelect (val) {
      if (val) {
        const { idNo, name } = val
        if (idNo) {
          this.queryObj.grbh = idNo
          this.queryObj.xm = name
        } else {
          this.$messageTips(this, 'error', '系统中该患者没有录入身份证信息，请先到客户中心维护患者身份证信息')
        }
      } else {
        // 清空
        this.queryObj.grbh = ''
        this.queryObj.xm = ''
        return false
      }
    }
  }
}
</script>
<style scoped>
.remark {
  width: 120px;
  line-height: 32px;
  text-align: right;
}
</style>
