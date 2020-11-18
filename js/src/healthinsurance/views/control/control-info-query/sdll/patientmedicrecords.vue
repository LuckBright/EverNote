<template>
  <div class="tableContainer">
    <ever-form2 ref="queryform" :inline="true" :schema="schema" :rules="rules" v-model="queryObj">
      <template slot="btns">
        <el-button type="primary" size="small" @click="beforeQueryList">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table class="table" v-loading="loading" :data="tableData" border stripe>
      <el-table-column label="医院编码" prop="yybm"></el-table-column>
      <el-table-column label="医院名称" prop="yymc"></el-table-column>
      <el-table-column label="疾病编码" prop="jbbm"></el-table-column>
      <el-table-column label="医疗统筹类别" prop="yltclb"></el-table-column>
      <el-table-column label="医院项目编码" prop="yyxmbm"></el-table-column>
      <el-table-column label="医院项目名称" prop="yyxmmc"></el-table-column>
      <el-table-column label="医疗项目编码" prop="ylxmbm"></el-table-column>
      <el-table-column label="医疗项目名称" prop="ylxmmc"></el-table-column>
      <el-table-column label="结算项目编码" prop="jsxmbh"></el-table-column>
      <el-table-column label="结算项目名称" prop="jsxmmc"></el-table-column>
      <el-table-column label="单位" prop="dw"></el-table-column>
      <el-table-column label="剂型名" prop="jxm"></el-table-column>
      <el-table-column label="商品名" prop="spm"></el-table-column>
      <el-table-column label="规格" prop="gg"></el-table-column>
      <el-table-column label="病人结算日期" prop="brjsrq"></el-table-column>
      <el-table-column label="单价" prop="dj"></el-table-column>
      <el-table-column label="数量" prop="sl"></el-table-column>
      <el-table-column label="总金额" prop="zje"></el-table-column>
      <el-table-column label="用药天数" prop="yyts"></el-table-column>
      <el-table-column label="医生姓名" prop="ysxm"></el-table-column>
      <el-table-column label="用药说明" prop="yysm"></el-table-column>
      <el-table-column label="结算地点" prop="jsdd"></el-table-column>
      <el-table-column label="病人结算号" prop="brjsh"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { queryBasicInfo, queryCbrjyxx } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
import { yltclb } from '@/rcm/otmdiscomponent/config-js/sdll-baseconfig.js'
const schema = [{
  label: '个人编号',
  name: 'grbh'
},
{
  label: '起止日期',
  name: 'timeStartAndEnd',
  comp: 'everRangePicker',
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '姓名',
  name: 'xm'
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
  labelWidth: '15px',
  name: 'btns',
  comp: 'custom'
}]
const rules = {
  grbh: [{
    required: true,
    message: '请填写个人编号',
    trigger: 'change'
  }],
  timeStartAndEnd: [{
    required: true,
    message: '请填写日期',
    trigger: 'change'
  }]
}
export default {
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      rules,
      queryObj,
      loading: false,
      tableData: []
    }
  },
  methods: {
    getsbjgbh () {
      const params = {
        insuranceOrgId: sdllCode,
        sbjgbh: '000000', // 社保机构编号写死的
        macId: this.macId,
        jsonPara: {
          grbh: this.queryObj.grbh,
          xzbz: 'C'
        }
      }
      return queryBasicInfo(params)
    },
    beforeQueryList () {
      this.$refs.queryform.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.getsbjgbh().then(res => {
            const { sbjgbh } = res.data
            if (sbjgbh) {
              this.queryList(sbjgbh)
            } else {
              this.$messageTips(this, 'error', '未获取到社保局编号')
              return false
            }
          }).catch((err) => {
            console.log('err', err)
            this.loading = false
          })
        }
      })
    },
    queryList (sbjgbh) {
      const [qsrq, zzrq] = this.queryObj.timeStartAndEnd
      const params = {
        macId: this.macId,
        insuranceOrgId: sdllCode,
        sbjgbh: sbjgbh,
        jsonPara: {
          ...this.queryObj,
          qsrq,
          zzrq: this.$moment(zzrq).format('YYYY-MM-DD 23:59:59')
        }
      }
      Object.keys(params.jsonPara).forEach(key => {
        if (!params.jsonPara[key]) {
          delete params.jsonPara[key]
        }
      })
      queryCbrjyxx(params).then(res => {
        const { jyxx_ds: tableData } = res.data
        this.tableData = tableData
        this.loading = false
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
.tableContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.table {
  overflow: auto;
}
</style>
