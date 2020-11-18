<template>
  <div class="tableContainer">
    <ever-form2 ref="queryform" :inline="true" :schema="schema" :rules="rules" v-model="queryObj">
      <template slot="btns">
        <el-button type="primary" size="small" @click="queryList">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table class="table" v-loading="loading" :data="tableData" border stripe>
      <el-table-column label="病历号" prop="blh" width="130" show-overflow-tooltip></el-table-column>
      <el-table-column label="病人结算号" prop="brjsh" width="210"></el-table-column>
      <el-table-column label="姓名" prop="xm" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="个人编号" prop="grbh" width="170"></el-table-column>
      <el-table-column label="身份证号码" prop="sfzhm" width="180"></el-table-column>
      <el-table-column label="总金额" prop="zje" align="right" width="120">
        <template slot-scope="scope">{{scope.row.zje | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="操作员编号" prop="czybh" width="100"></el-table-column>
      <el-table-column label="医保负担金额" prop="ybfdje" width="120" align="right">
        <template slot-scope="scope">{{scope.row.ybfdje | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="病人负担金额" prop="brfdje" width="120" align="right">
        <template slot-scope="scope">{{scope.row.brfdje | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="个人账户支付" prop="grzhzf" width="120" align="right">
        <template slot-scope="scope">{{scope.row.grzhzf | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="操作时间" prop="czsj" width="140"></el-table-column>
      <el-table-column label="门诊流水号" prop="mzzdlsh" width="180"></el-table-column>
      <el-table-column label="撤销标志" prop="cxbz">
        <template slot-scope="scope">{{scope.row.cxbz>0?'撤销':'正向消费'}}</template>
      </el-table-column>
      <el-table-column label="经办机构" prop="sbjgbh" width="90"></el-table-column>
      <el-table-column label="基本统筹" prop="tczf" align="right" width="120">
        <template slot-scope="scope">{{scope.row.tczf | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="大额统筹" prop="dezf" align="right" width="120">
        <template slot-scope="scope">{{scope.row.dezf | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="其他统筹" prop="qttczf" align="right" width="120">
        <template slot-scope="scope">{{scope.row.qttczf | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="医疗补助金额" prop="ylbzje" align="right" width="120">
        <template slot-scope="scope">{{scope.row.ylbzje | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="医疗统筹类别" prop="yltclb" width="120">
        <template slot-scope="scope">{{scope.row.yltclb | yltclb}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { mzlbOptions, yltclb } from '@/rcm/otmdiscomponent/config-js/sdll-baseconfig.js'
import { queryMzdz } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
const schema = [{
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
  label: '个人编号',
  name: 'grbh'
},
{
  label: '门诊类别',
  name: 'mzlb',
  comp: 'ever-select',
  props: {
    options: mzlbOptions
  }
},
{
  label: '病人结算号',
  name: 'jshid',
},
{
  label: '院区编号',
  name: 'campusid',
},
{
  label: '',
  labelWidth: '15px',
  name: 'btns',
  comp: 'custom'
}
]
const rules = {
  timeStartAndEnd: [{
    required: true,
    message: '请选择起止日期',
    trigger: 'change'
  }]
}
export default {
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.mzlb = '2'
    return {
      schema,
      rules,
      queryObj,
      loading: false,
      tableData: []
    }
  },
  methods: {
    queryList () {
      this.$refs.queryform.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const [qsrq, zzrq] = this.queryObj.timeStartAndEnd
          const params = {
            macId: this.macId,
            insuranceOrgId: sdllCode,
            sbjgbh: '37140101', // 医保局编号写死
            jsonPara: {
              ...this.queryObj,
              qsrq: qsrq && this.$moment(qsrq).format('YYYYMMDDHHssmm'),
              zzrq: zzrq && this.$moment(zzrq).format('YYYYMMDD235959'),
            }
          }
          Object.keys(params.jsonPara).forEach(key => {
            if (!params.jsonPara[key]) {
              delete params.jsonPara[key]
            }
          })
          queryMzdz(params).then(res => {
            const { mzdz_ds: tableData } = res.data
            this.tableData = tableData
            this.loading = false
          }).catch(err => {
            console.log('err', err)
            this.loading = false
          })
        }
      })
    }
  },
  filters: {
    yltclb (val) {
      const index = yltclb.find(item => item.id === val)
      return index && index.name
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
